import { AppSyncResolverEvent } from "aws-lambda";
import dayjs from "dayjs";
import {
  CreatePostMutationVariables,
  CurrentUserPost,
} from "wordle-friends-graphql";
import { POSTS_TABLE } from "../constants";
import { put } from "../dynamo";

export async function createPostHandler(
  userId: string,
  { arguments: { input } }: AppSyncResolverEvent<CreatePostMutationVariables>
): Promise<CurrentUserPost> {
  const createdAt = dayjs().toISOString();

  const item = { ...input, userId, createdAt, updatedAt: createdAt };

  await put({
    TableName: POSTS_TABLE,
    Item: item,
    ConditionExpression: "attribute_not_exists(userId)",
  });

  return { __typename: "CurrentUserPost", ...item };
}
