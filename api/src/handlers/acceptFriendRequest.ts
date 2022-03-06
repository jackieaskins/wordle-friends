import { AppSyncResolverEvent } from "aws-lambda";
import { AcceptFriendRequestMutationVariables } from "wordle-friends-graphql";
import { acceptFriendRequest, SimpleFriend } from "../tables/friends";

export async function acceptFriendRequestHandler(
  userId: string,
  {
    arguments: { friendId },
  }: AppSyncResolverEvent<AcceptFriendRequestMutationVariables>
): Promise<SimpleFriend> {
  if (friendId === "" || friendId === userId) {
    throw new Error("Invalid friendId");
  }

  return await acceptFriendRequest({ userId, friendId });
}
