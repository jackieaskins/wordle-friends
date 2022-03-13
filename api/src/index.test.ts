import { AppSyncResolverEvent, Context } from "aws-lambda";
import { handler } from ".";

const USER_ID = "userId";
const PARENT_TYPE_NAME = "Query";
const FIELD_NAME = "supported";
const EVENT = {
  info: { parentTypeName: PARENT_TYPE_NAME, fieldName: FIELD_NAME },
  identity: { sub: USER_ID },
};
const mockCallback = jest.fn();

jest.mock("./handlers", () => ({
  __esModule: true,
  default: {
    supportedHandler: jest.fn().mockReturnValue("rv"),
  },
}));

async function callHandler(event: any = EVENT) {
  await handler(
    event as AppSyncResolverEvent<any, any>,
    {} as Context,
    mockCallback
  );
}

describe("handler", () => {
  it("throws an error if no userId", async () => {
    expect.assertions(1);

    await callHandler({ ...EVENT, identity: {} });

    expect(mockCallback).toHaveBeenCalledWith(
      new Error("Must be logged in to access API"),
      null
    );
  });

  it("throws an unsupported operation error if operation is not supported", async () => {
    expect.assertions(1);

    await callHandler({
      ...EVENT,
      info: { ...EVENT.info, fieldName: "unsupported" },
    });

    expect(mockCallback).toHaveBeenCalledWith(
      new Error("Unsupported operation: Query unsupported"),
      null
    );
  });

  it("calls callback with handler data on success", async () => {
    expect.assertions(1);

    await callHandler();

    expect(mockCallback).toHaveBeenCalledWith(null, "rv");
  });
});
