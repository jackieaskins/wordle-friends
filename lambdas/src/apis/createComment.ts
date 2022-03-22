import { AppSyncResolverEvent } from "aws-lambda";
import { CreateCommentMutationVariables } from "wordle-friends-graphql";
import { createComment, SimpleComment } from "../tables/comments";

export async function createCommentHandler(
  userId: string,
  { arguments: { input } }: AppSyncResolverEvent<CreateCommentMutationVariables>
): Promise<SimpleComment> {
  return await createComment({ ...input, userId });
}
