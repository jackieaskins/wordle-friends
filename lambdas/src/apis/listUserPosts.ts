import { AppSyncResolverEvent } from "aws-lambda";
import { ListUserPostsQueryVariables } from "wordle-friends-graphql";
import { queryPosts, SimplePaginatedPosts } from "../tables/posts";

export async function listUserPostsHandler(
  userId: string,
  {
    arguments: { startDate, endDate, nextToken },
  }: AppSyncResolverEvent<ListUserPostsQueryVariables>
): Promise<SimplePaginatedPosts> {
  return await queryPosts(userId, startDate, endDate, nextToken);
}
