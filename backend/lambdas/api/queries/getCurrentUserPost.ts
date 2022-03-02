import { AppSyncResolverEvent } from "aws-lambda";
import { POSTS_TABLE } from "../constants";
import { get } from "../dynamo";
import { CurrentUserPost, GetCurrentUserPostQueryVariables } from "../types";

export async function getCurrentUserPost(
  userId: string,
  {
    arguments: { puzzleDate },
  }: AppSyncResolverEvent<GetCurrentUserPostQueryVariables>
): Promise<CurrentUserPost | undefined> {
  const { Item: item } = await get({
    TableName: POSTS_TABLE,
    Key: { userId, puzzleDate },
  });

  return item as CurrentUserPost;
}
