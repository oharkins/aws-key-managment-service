const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');
const ULID = require('ulid');

const ddb = new DynamoDBClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const tenantId = event.requestContext.authorizer.sub;

    for (let i = 0; i < 5; i++) {
      let success = true;
      try {
        await saveProfile(tenantId, ULID.ulid().toLowerCase(), body);
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
          body: JSON.stringify({ passcode: profilePasscode }),
          headers: { 'Access-Control-Allow-Origin': process.env.CORS_ORIGIN }
        };
      }
    }

    // This means we tried 5 times for a unique value but couldn't find one. Let the user try again.
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Unable to generate unique passcode. Please try again' }),
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

const saveProfile = async (tenantId,serviceId, body) => {
  await ddb.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    ConditionExpression: 'attribute_not_exists(sort)',
    Item: marshall({
      pk: tenantId,
      sk: `service#${serviceId}`,
      type: 'service',
      sort: serviceId,
      ...body
    })
  }));
};