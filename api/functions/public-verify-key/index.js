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
        const keyObject = unmarshall(GetKeyResponse.Items[0]);

        const serviceResponse = await ddb.send(new GetItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: marshall({
                pk: keyObject.pk,
                sk: `service#${keyObject.keyParts.serviceId}`
            })
        }));

        if (!serviceResponse.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'The requested service is not found' }),
                headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN }
            };
        }
        const { status } = unmarshall(serviceResponse.Item);

        if (status === 'Frozen') {
            return {
                statusCode: 403,
                body: JSON.stringify({message: '⚠️ Service Is Frozen. No Changes! ⚠️'}),
                headers: {'Access-Control-Allow-Origin': process.env.CORS_ORIGIN}
            };
        }

        await updateKey(keyObject.pk, keyObject.keyParts.serviceId, keyObject.keyParts.keyId);

        return {
            statusCode: 201,
            body: JSON.stringify(
                {
                    serviceID: keyObject.keyParts.serviceId,
                    status: keyObject.status,
                    expirationDate: keyObject.expirationDate
                }),
            headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN }
        };

    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Something went wrong' }),
            headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN }
        };
    }
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
        UpdateExpression: 'SET #lastUsed = :lastUsed',
        ExpressionAttributeNames: {
            "#lastUsed": "lastUsed"
        },
        ExpressionAttributeValues: {
            ':lastUsed': { N: Math.floor(currentDate.getTime() / 1000).toString() }
        }
    }));
};