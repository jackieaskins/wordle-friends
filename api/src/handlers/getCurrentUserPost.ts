import { AppSyncResolverEvent } from "aws-lambda";
import { GetCurrentUserPostQueryVariables, Post } from "wordle-friends-graphql";
import { getPost } from "../tables/posts";

export async function getCurrentUserPostHandler(
  userId: string,
  {
    arguments: { puzzleDate },
  }: AppSyncResolverEvent<GetCurrentUserPostQueryVariables>
): Promise<Post | undefined> {
  return await getPost({
    userId,
    puzzleDate,
  });
}
