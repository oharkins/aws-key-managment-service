const { DynamoDBClient, GetItemCommand, PutItemCommand, UpdateItemCommand, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const ULID = require('ulid');
const ddb = new DynamoDBClient();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    try {
        const apiKey = event.headers && event.headers[Object.keys(event.headers).find((k) => k.toLowerCase() === 'x-api-key')];

        const GetKeyResponse = await ddb.send(new QueryCommand({
            TableName: process.env.TABLE_NAME,
            IndexName: 'types',
            KeyConditionExpression: '#type = :type and #key = :key',
            ExpressionAttributeNames: {
                '#type': 'type',
                '#key': 'sort'
            },
            ExpressionAttributeValues: marshall({
                ':type': 'key',
                ':key': apiKey
            }),
            Limit: 1
        }));

        if (!GetKeyResponse.Items?.length) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Invalid Key' }),
                headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN }
            };
        }
        const { pk, keyParts } = unmarshall(GetKeyResponse.Items[0]);

        const serviceResponse = await ddb.send(new GetItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: marshall({
                pk: pk,
                sk: `service#${keyParts.serviceId}`
            })
        }));

        if (!serviceResponse.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'The requested service is not found' }),
                headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN }
            };
        }
        const { maxKeyAgeDays , status } = unmarshall(serviceResponse.Item);

        if (status === 'Frozen') {
            return {
                statusCode: 403,
                body: JSON.stringify({message: '⚠️ Service Is Frozen. No Changes! ⚠️'}),
                headers: {'Access-Control-Allow-Origin': process.env.CORS_ORIGIN}
            };
        }
        // Attempt to generate a new key 5 times
        for (let i = 0; i < 5; i++) {
            const newKey = getKey();
            const newKeyId = ULID.ulid().toLowerCase();
            let success = true;
            try {
                await saveKey(pk, keyParts.serviceId, newKeyId, newKey, maxKeyAgeDays);
                await updateKey(pk, keyParts.serviceId, keyParts.keyId);
            } catch (err) {
                if (err.name == 'ConditionalCheckFailedException') {
                    success = false;
                } else {
                    throw err;
                }
            }
            if (success) {
                return {
                    statusCode: 201,
                    body: JSON.stringify({ keyId: newKeyId, key: newKey }),
                    headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN }
                };
            }
        }
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Something went wrong' }),
            headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN }
        };
    }
};
const getKey = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const saveKey = async (tenantId, serviceId, keyId, key, maxKeyAgeDays) => {
    let currentDate = new Date();
    let terminatedDate = new Date(currentDate.setDate(currentDate.getDate() + maxKeyAgeDays));

    await ddb.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        ConditionExpression: 'attribute_not_exists(sort)',
        Item: marshall({
            pk: tenantId,
            sk: `key#${serviceId}#${keyId}`,
            status: 'Active',
            type: 'key',
            key: key,
            sort: key,
            keyParts: { serviceId: serviceId, keyId: keyId},
            createdDate: Math.floor(new Date().getTime() / 1000),
            expirationDate: Math.floor(terminatedDate.getTime() / 1000),
        })
    }));
};
const updateKey = async (tenantId, serviceId, keyId) => {
    let currentDate = new Date();
    let terminatedDate = new Date(currentDate.getTime() + 60000); // 1 minute from now

    await ddb.send(new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
            pk: {S: tenantId},
            sk: {S: `key#${serviceId}#${keyId}`}
        },
        UpdateExpression: 'SET #status = :status , #expirationDate = :expirationDate',
        ExpressionAttributeNames: {
            "#status": "status",
            "#expirationDate": "expirationDate"
        },
        ExpressionAttributeValues: {
            ':status': { S: 'Expiring' },
            ':expirationDate': { N: Math.floor(terminatedDate.getTime() / 1000).toString() }
        }
    }));
};