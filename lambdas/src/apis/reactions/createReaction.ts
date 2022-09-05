import { AppSyncResolverEvent } from "aws-lambda";
import { CreateReactionMutationVariables } from "wordle-friends-graphql";
import { createReaction, SimpleReaction } from "../../tables/reactions";

export async function createReactionHandler(
  userId: string,
  {
    arguments: { input },
  }: AppSyncResolverEvent<CreateReactionMutationVariables>
): Promise<SimpleReaction> {
  return await createReaction({ ...input, userId });
}
