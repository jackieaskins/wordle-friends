import { AppSyncResolverEvent } from "aws-lambda";
import { FRIENDS_TABLE } from "../constants";
import { transactWrite } from "../dynamo";
import {
  FriendKey,
  FriendStatus,
  SendFriendRequestMutationVariables,
} from "../types";

export async function sendFriendRequest(
  userId: string,
  {
    arguments: { friendId },
  }: AppSyncResolverEvent<SendFriendRequestMutationVariables>
): Promise<FriendKey> {
  if (friendId === "" || friendId === userId) {
    throw new Error("Invalid friendId");
  }

  // TODO: Validate friend exists

  await transactWrite({
    TransactItems: [
      {
        Put: {
          TableName: FRIENDS_TABLE,
          Item: { userId, friendId, status: FriendStatus.SENT },
          ConditionExpression: "attribute_not_exists(userId)",
        },
      },
      {
        Put: {
          TableName: FRIENDS_TABLE,
          Item: {
            userId: friendId,
            friendId: userId,
            status: FriendStatus.RECEIVED,
          },
          ConditionExpression: "attribute_not_exists(userId)",
        },
      },
    ],
  });

  return { __typename: "FriendKey", userId, friendId };
}
