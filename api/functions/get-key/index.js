const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
const ddb = new DynamoDBClient();

exports.handler = async (event) => {
  try {
    const tenantId = event.requestContext.authorizer.claims.sub;
    const { keyId, serviceId } = event.pathParameters;

    const response = await ddb.send(new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: marshall({
        pk: tenantId,
        sk: `key#${serviceId}#${keyId}`
      })
    }));

    if (!response.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'The requested profile is not found' }),
        headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN }
      };
    }

    const data = unmarshall(response.Item);

    return {
      statusCode: 200,
      body: JSON.stringify({
        keyId: data.keyParts.keyId,
        name: data.name,
        key: maskString(data.sort,4),
        ageDays: data.createdDate ?? 'Unknown',
        status: data.status ?? 'Unknown',
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
const maskString = (inputString,length) => {
    if (typeof inputString !== 'string') {
    return 'Invalid input';
  }
  // Calculate the number of characters to mask
  const maskLength = Math.max(0, inputString.length - length);
  // Create a masked string with '*' for the characters to be masked
  const maskedString = '*'.repeat(maskLength) + inputString.slice(maskLength);
  return maskedString;
};