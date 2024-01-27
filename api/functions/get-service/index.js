const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const ddb = new DynamoDBClient();

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  try {
    const tenantId = event.requestContext.authorizer.sub;
    const { serviceId } = event.pathParameters;

    const response = await ddb.send(new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: marshall({
        pk: tenantId,
        sk: `service#${serviceId}`
      })
    }));

    if (!response.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'The requested service is not found' }),
        headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN }
      };
    }

    const data = unmarshall(response.Item);

    return {
      statusCode: 200,
      body: JSON.stringify({
        serviceId: data.sort,
        name: data.name,
        status: data.status ?? 'Unknown',
        maxKeyAgeDays: data.maxKeyAgeDays,
        emails: data.emails,
        ...data.facts && { facts: data.facts },
        ...data.presents && { presents: data.presents }
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