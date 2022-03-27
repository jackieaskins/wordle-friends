import { DynamoDBStreamEvent } from "aws-lambda";
import {
  COMMENTS_TABLE_STREAM_ARN,
  POSTS_TABLE_STREAM_ARN,
} from "../constants";
import { handleFriendPost } from "../notifications/friendPost";
import { handlePostComment } from "../notifications/postComment";

export async function handler({
  Records: records,
}: DynamoDBStreamEvent): Promise<void> {
  const filteredRecords = records.filter(
    ({ eventName }) => eventName === "INSERT"
  );

  for (const record of filteredRecords) {
    const { eventSourceARN } = record;

    if (eventSourceARN === POSTS_TABLE_STREAM_ARN) {
      return await handleFriendPost(record);
    }

    if (eventSourceARN === COMMENTS_TABLE_STREAM_ARN) {
      return await handlePostComment(record);
    }
  }
}
