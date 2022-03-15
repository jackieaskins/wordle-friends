import { AppSyncResolverEvent } from "aws-lambda";
import { DeleteFriendMutationVariables } from "wordle-friends-graphql";
import { deleteFriend } from "../tables/friends";

export async function deleteFriendHandler(
  userId: string,
  {
    arguments: { friendId },
  }: AppSyncResolverEvent<DeleteFriendMutationVariables>
): Promise<void> {
  if (friendId === userId) {
    throw new Error("Cannot delete yourself as a friend");
  }

  await deleteFriend({ userId, friendId });
}
