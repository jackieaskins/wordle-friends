import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Context, PostConfirmationTriggerEvent } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";
import { handler } from ".";

const ddbMock = mockClient(DynamoDBClient);
const mockCallback = jest.fn();

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
  await handler(EVENT, {} as Context, mockCallback);
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

  it("calls callback with event on success", async () => {
    expect.assertions(1);

    await callHandler();

    expect(mockCallback).toHaveBeenCalledWith(null, EVENT);
  });

  it("calls callback with error and event on error", async () => {
    expect.assertions(1);

    const error = new Error("error!");
    ddbMock.rejects(error);

    await expect(callHandler()).rejects.toEqual(error);
  });
});
