import { AppSyncResolverEvent } from "aws-lambda";
import { SendFriendRequestMutationVariables } from "wordle-friends-graphql";
import { sendFriendRequest, SimpleFriend } from "../../tables/friends";

export async function sendFriendRequestHandler(
  userId: string,
  {
    arguments: { friendId },
  }: AppSyncResolverEvent<SendFriendRequestMutationVariables>
): Promise<SimpleFriend> {
  if (friendId === userId) {
    throw new Error("You cannot add yourself as a friend");
  }
  return await sendFriendRequest({ userId, friendId });
}
