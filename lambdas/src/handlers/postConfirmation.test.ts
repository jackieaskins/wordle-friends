import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PostConfirmationTriggerEvent } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from "./postConfirmation";

const ddbMock = mockClient(DynamoDBClient);

const USER_ID = "userId";
const FIRST_NAME = "firstName";
const LAST_NAME = "lastName";

const EVENT = {
  request: {
    userAttributes: {
      sub: USER_ID,
      given_name: FIRST_NAME,
      family_name: LAST_NAME,
    },
  },
} as unknown as PostConfirmationTriggerEvent;

async function callHandler() {
  return await handler(EVENT);
}

describe("handler", () => {
  beforeEach(() => {
    ddbMock.reset();
  });

  it("adds user to users dynamo table", async () => {
    expect.assertions(1);

    await callHandler();

    expect(
      ddbMock.commandCalls(PutItemCommand, {
        TableName: "USERS_TABLE",
        Item: {
          id: { S: USER_ID },
          firstName: { S: FIRST_NAME },
          lastName: { S: LAST_NAME },
        },
      })
    ).toHaveLength(1);
  });

  it("returns event on success", async () => {
    expect.assertions(1);

    await expect(callHandler()).resolves.toEqual(EVENT);
  });

  it("throws error on error", async () => {
    expect.assertions(1);

    const error = new Error("error!");
    ddbMock.rejects(error);

    await expect(callHandler()).rejects.toEqual(error);
  });
});
