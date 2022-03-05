import { AppSyncResolverEvent } from "aws-lambda";
import {
  Friend,
  FriendStatus,
  SendFriendRequestMutationVariables,
} from "wordle-friends-graphql";
import { FRIENDS_TABLE } from "../constants";
import { transactWrite } from "../dynamo";

export async function sendFriendRequestHandler(
  userId: string,
  {
    arguments: { friendId },
  }: AppSyncResolverEvent<SendFriendRequestMutationVariables>
): Promise<Friend> {
  if (friendId === "" || friendId === userId) {
    throw new Error("Invalid friendId");
  }

  const sentRequest = {
    id: `${userId}:${friendId}`,
    userId,
    friendId,
    status: FriendStatus.SENT,
  };

  // TODO: Validate friend exists
  await transactWrite({
    TransactItems: [
      {
        Put: {
          TableName: FRIENDS_TABLE,
          Item: sentRequest,
          ConditionExpression: "attribute_not_exists(userId)",
        },
      },
      {
        Put: {
          TableName: FRIENDS_TABLE,
          Item: {
            id: `${friendId}:${userId}`,
            userId: friendId,
            friendId: userId,
            status: FriendStatus.RECEIVED,
          },
          ConditionExpression: "attribute_not_exists(userId)",
        },
      },
    ],
  });

  return { __typename: "Friend", ...sentRequest };
}
