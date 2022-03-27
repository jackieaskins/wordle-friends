import { DynamoDBStreamEvent } from "aws-lambda";
import { handleFriendPost } from "../notifications/friendPost";
import { handlePostComment } from "../notifications/postComment";
import { handler } from "./notifications";

jest.mock("../constants", () => ({
  COMMENTS_TABLE_STREAM_ARN: "COMMENTS_TABLE_STREAM_ARN",
  POSTS_TABLE_STREAM_ARN: "POSTS_TABLE_STREAM_ARN",
}));

jest.mock("../notifications/friendPost", () => ({
  handleFriendPost: jest.fn(),
}));

jest.mock("../notifications/postComment", () => ({
  handlePostComment: jest.fn(),
}));

const handlers: [string, jest.Mock][] = [
  ["POSTS_TABLE_STREAM_ARN", handleFriendPost as jest.Mock],
  ["COMMENTS_TABLE_STREAM_ARN", handlePostComment as jest.Mock],
];

function generateEvent(eventName: string, eventSourceARN: string) {
  return { Records: [{ eventName, eventSourceARN }] } as DynamoDBStreamEvent;
}

describe("notifications", () => {
  it("does not process non-insert events", async () => {
    expect.assertions(handlers.length);

    await handler(generateEvent("NO_INSERT", "COMMENTS_TABLE_STREAM_ARN"));

    handlers.forEach(([, handler]) => {
      expect(handler).not.toHaveBeenCalled();
    });
  });

  it.each(handlers)(
    "calls handler for %s insert event",
    async (streamArn, handleFn) => {
      expect.assertions(handlers.length);

      const event = generateEvent("INSERT", streamArn);
      await handler(event);

      handlers.forEach(([, handle]) => {
        expect(handle.mock.calls).toHaveLength(handleFn === handle ? 1 : 0);
      });
    }
  );
});
