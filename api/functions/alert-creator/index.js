const { DynamoDBClient, PutItemCommand, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const ddb = new DynamoDBClient();

exports.handler = async (event, context, callback) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    try {
        let currentDate = new Date();
        let terminatedDate = new Date(currentDate.setDate(currentDate.getDate() + 14));

        const GetKeyResponse = await ddb.send(new QueryCommand({
            TableName: process.env.TABLE_NAME,
            IndexName: 'expirationDate',
            KeyConditionExpression: '#type = :type AND #expirationDate BETWEEN :smaller AND :larger',
            ExpressionAttributeNames: {
                '#type': 'type',
                '#expirationDate': 'expirationDate'
            },
            ExpressionAttributeValues: marshall({
                ':type': 'key',
                ':smaller': Math.floor(new Date().getTime() / 1000),
                ':larger': Math.floor(terminatedDate.getTime() / 1000)
            })
        }));

        if (!GetKeyResponse.Items?.length) {
            console.log('No Records found');
            callback(null, 'Finished');
            return;
        }

        for (let i = 0; i < GetKeyResponse.Items.length; i++) {
            let keyObject = unmarshall(GetKeyResponse.Items[i]);
            //console.log('Key:', keyObject);
            if (keyObject.status === 'Active') {
                try {
                    await saveAlert(keyObject.pk, keyObject.keyParts.serviceId, keyObject.keyParts.keyId);
                } catch (err) {
                    if (err.name == 'ConditionalCheckFailedException') {
                        continue;
                    } else {
                        throw err;
                    }
                }
            }
        }

        callback(null, 'Finished');
    } catch (err) {
        console.error(err);
        callback(err, 'Finished');
    }
};
const saveAlert = async (tenantId, serviceId, keyId) => {
    let currentDate = new Date();
    // Add 10 days to the current date
    let terminatedDate = new Date(currentDate.setDate(currentDate.getDate() + 15));

    await ddb.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        ConditionExpression: 'attribute_not_exists(sort)',
        Item: marshall({
            pk: tenantId,
            sk: `alert#${serviceId}#${keyId}`,
            status: 'Active', // Active, Viewed, Dismissed
            type: 'alert',
            sort: `${serviceId}#${keyId}`,
            keyParts: { serviceId: serviceId, keyId: keyId},
            createdDate: Math.floor(new Date().getTime() / 1000),
            expirationDate: Math.floor(terminatedDate.getTime() / 1000),
        })
    }));
};