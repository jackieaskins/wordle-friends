import { AppSyncResolverEvent } from "aws-lambda";
import { handler } from "./api";

const USER_ID = "userId";
const PARENT_TYPE_NAME = "Query";
const FIELD_NAME = "supported";
const EVENT = {
  info: { parentTypeName: PARENT_TYPE_NAME, fieldName: FIELD_NAME },
  identity: { sub: USER_ID },
};

jest.mock("../apis", () => ({
  __esModule: true,
  default: {
    supportedHandler: jest.fn().mockResolvedValue("rv"),
  },
}));

async function callHandler(event: any = EVENT) {
  return await handler(event as AppSyncResolverEvent<any, any>);
}

describe("api", () => {
  it("throws an error if no userId", async () => {
    expect.assertions(1);

    await expect(callHandler({ ...EVENT, identity: {} })).rejects.toEqual(
      new Error("Must be logged in to access API")
    );
  });

  it("throws an unsupported operation error if operation is not supported", async () => {
    expect.assertions(1);

    await expect(
      callHandler({
        ...EVENT,
        info: { ...EVENT.info, fieldName: "unsupported" },
      })
    ).rejects.toEqual(new Error("Unsupported operation: Query unsupported"));
  });

  it("returns data on success", async () => {
    expect.assertions(1);

    await expect(callHandler()).resolves.toBe("rv");
  });
});
