import { AppSyncResolverEvent } from "aws-lambda";
import { GetCurrentUserPostQueryVariables } from "wordle-friends-graphql";
import { getPost, SimplePost } from "../tables/posts";

export async function getCurrentUserPostHandler(
  userId: string,
  {
    arguments: { puzzleDate },
  }: AppSyncResolverEvent<GetCurrentUserPostQueryVariables>
): Promise<SimplePost | undefined> {
  return await getPost({
    userId,
    puzzleDate,
  });
}
