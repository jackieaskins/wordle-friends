import { AppSyncResolverEvent } from "aws-lambda";
import { DeleteFriendMutationVariables } from "wordle-friends-graphql";
import { deleteFriend } from "../tables/friends";

export async function deleteFriendHandler(
  userId: string,
  {
    arguments: { friendId },
  }: AppSyncResolverEvent<DeleteFriendMutationVariables>
): Promise<void> {
  if (friendId === "" || friendId === userId) {
    throw new Error("Invalid friendId");
  }

  await deleteFriend({ userId, friendId });
}
