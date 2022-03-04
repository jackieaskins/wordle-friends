import { AppSyncResolverEvent } from "aws-lambda";
import {
  CurrentUserPost,
  GetCurrentUserPostQueryVariables,
} from "wordle-friends-graphql";
import { POSTS_TABLE } from "../constants";
import { get } from "../dynamo";

export async function getCurrentUserPostHandler(
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
