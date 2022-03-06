import { AppSyncResolverEvent } from "aws-lambda";
import { ListPostCommentsQueryVariables } from "wordle-friends-graphql";
import { listComments, SimplePaginatedComments } from "../tables/comments";

export async function listPostCommentsHandler(
  _userId: string,
  { arguments: variables }: AppSyncResolverEvent<ListPostCommentsQueryVariables>
): Promise<SimplePaginatedComments> {
  return await listComments(variables);
}
