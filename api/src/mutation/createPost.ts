import { AppSyncResolverEvent } from "aws-lambda";
import dayjs from "dayjs";
import { CreatePostMutationVariables, Post } from "wordle-friends-graphql";
import { POSTS_TABLE } from "../constants";
import { put } from "../dynamo";

export async function createPostHandler(
  userId: string,
  { arguments: { input } }: AppSyncResolverEvent<CreatePostMutationVariables>
): Promise<Omit<Post, "user">> {
  const createdAt = dayjs().toISOString();

  const { puzzleDate } = input;
  const item = {
    ...input,
    id: `${userId}:${puzzleDate}`,
    userId,
    createdAt,
    updatedAt: createdAt,
  };

  await put({
    TableName: POSTS_TABLE,
    Item: item,
    ConditionExpression: "attribute_not_exists(userId)",
  });

  return { __typename: "Post", ...item };
}
