import { AppSyncResolverEvent } from "aws-lambda";
import { AcceptFriendRequestMutationVariables } from "wordle-friends-graphql";
import { acceptFriendRequest, SimpleFriend } from "../tables/friends";

export async function acceptFriendRequestHandler(
  userId: string,
  {
    arguments: { friendId },
  }: AppSyncResolverEvent<AcceptFriendRequestMutationVariables>
): Promise<SimpleFriend> {
  if (friendId === userId) {
    throw new Error("You cannot add yourself as a friend");
  }

  return await acceptFriendRequest({ userId, friendId });
}
