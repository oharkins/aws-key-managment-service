const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const ULID = require('ulid');

const ddb = new DynamoDBClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { serviceId } = event.pathParameters;
    const tenantId = event.requestContext.authorizer.sub;

    for (let i = 0; i < 5; i++) {
      const key = getKey();
      const keyId = ULID.ulid().toLowerCase();
      let success = true;
      try {
        await saveKey(tenantId, serviceId, keyId, key, body);
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
          body: JSON.stringify({ keyId: keyId, key: key }),
          headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN }
        };
      }
    }

    // This means we tried 5 times for a unique value but couldn't find one. Let the user try again.
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Unable to generate unique key. Please try again' }),
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

const saveKey = async (tenantId, serviceId, keyId, key, body) => {
  let currentDate = new Date();
  // Add 90 days to the current date
  let terminatedDate = currentDate.setDate(currentDate.getDate() + 90);

  await ddb.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    ConditionExpression: 'attribute_not_exists(sort)',
    Item: marshall({
      pk: tenantId,
      sk: `key#${serviceId}#${keyId}`,
      type: 'key',
      sort: key,
      keyParts: { serviceId: serviceId, keyId: keyId},
      createdDate: currentDate.getTime() / 1000,
      expirationDate: terminatedDate.getTime() / 1000,
      ...body
    })
  }));
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