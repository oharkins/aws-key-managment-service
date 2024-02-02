const { DynamoDBClient, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const ddb = new DynamoDBClient();

exports.handler = async (event) => {
    try {
        const tenantId = event.requestContext.authorizer.sub;
        const { keyId, serviceId } = event.pathParameters;

        await ddb.send(new DeleteItemCommand({
            TableName: process.env.TABLE_NAME,
            Key: marshall({
                pk: tenantId,
                sk: `key#${serviceId}#${keyId}`
            })
        }));

        return {
            statusCode: 200,
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
