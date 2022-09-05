import { AppSyncResolverEvent } from "aws-lambda";
import { DeleteReactionMutationVariables } from "wordle-friends-graphql";
import { deleteReaction, SimpleReaction } from "../../tables/reactions";

export async function deleteReactionHandler(
  userId: string,
  {
    arguments: { input },
  }: AppSyncResolverEvent<DeleteReactionMutationVariables>
): Promise<SimpleReaction> {
  return await deleteReaction({ ...input, userId });
}
