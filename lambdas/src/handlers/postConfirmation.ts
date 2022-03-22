import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PostConfirmationTriggerEvent } from "aws-lambda";

const dynamo = new DynamoDBClient({ region: process.env.REGION });

export async function handler(
  event: PostConfirmationTriggerEvent
): Promise<PostConfirmationTriggerEvent> {
  const {
    request: {
      userAttributes: { sub: id, given_name: firstName, family_name: lastName },
    },
  } = event;

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

  return event;
}
