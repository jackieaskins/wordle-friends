import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Callback, Context, PostConfirmationTriggerEvent } from "aws-lambda";

const dynamo = new DynamoDBClient({ region: process.env.REGION });

export async function handler(
  event: PostConfirmationTriggerEvent,
  _context: Context,
  callback: Callback<PostConfirmationTriggerEvent>
): Promise<void> {
  const {
    request: {
      userAttributes: { sub: id, given_name: firstName, family_name: lastName },
    },
  } = event;

  try {
    await dynamo.send(
      new PutItemCommand({
        TableName: process.env.USERS_TABLE,
        Item: {
          id: { S: id },
          firstName: { S: firstName },
          lastName: { S: lastName },
        },
      })
    );
  } catch (e: any) {
    callback(e, event);
    throw e;
  }

  callback(null, event);
}
