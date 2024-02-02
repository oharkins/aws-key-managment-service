const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb')
const ddb = new DynamoDBClient();

exports.handler = async (event) => {
  try {
    const { serviceId } = event.pathParameters;

    const response = await ddb.send(new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
      ScanIndexForward: false,
      ExpressionAttributeValues: marshall({
        ':pk': event.requestContext.authorizer.sub,
        ':sk': `key#${serviceId}`
      })
    }));

    const keys = response.Items.map(item => {
      const data = unmarshall(item);
      return {
        keyId: data.keyParts.keyId,
        name: data.name,
        key: maskString(data.sort,4),
        expirationDate: data.expirationDate ?? 0,
        createdDate: data.createdDate ?? 0,
        status: data.status ?? 'Unknown',
        ...data.facts && { facts: data.facts }
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify( keys ),
      headers: {
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN
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