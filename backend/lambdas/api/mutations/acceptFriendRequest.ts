import { AppSyncResolverEvent } from "aws-lambda";
import { FRIENDS_TABLE } from "../constants";
import { transactWrite } from "../dynamo";
import {
  AcceptFriendRequestMutationVariables,
  FriendKey,
  FriendStatus,
} from "../types";

export async function acceptFriendRequest(
  userId: string,
  {
    arguments: { friendId },
  }: AppSyncResolverEvent<AcceptFriendRequestMutationVariables>
): Promise<FriendKey> {
  if (friendId === "" || friendId === userId) {
    throw new Error("Invalid friendId");
  }

  // TODO: Validate friend exists

  await transactWrite({
    TransactItems: [
      {
        Update: {
          TableName: FRIENDS_TABLE,
          Key: { userId: { S: userId }, friendId: { S: friendId } },
          UpdateExpression: "SET #status = :status",
          ExpressionAttributeNames: { "#status": "status" },
          ExpressionAttributeValues: {
            ":status": { S: FriendStatus.ACCEPTED },
          },
        },
      },
      {
        Update: {
          TableName: FRIENDS_TABLE,
          Key: {
            friendId: { S: userId },
            userId: { S: friendId },
          },
          UpdateExpression: "SET #status = :status",
          ExpressionAttributeNames: { "#status": "status" },
          ExpressionAttributeValues: {
            ":status": { S: FriendStatus.ACCEPTED },
          },
        },
      },
    ],
  });

  return { __typename: "FriendKey", userId, friendId };
}
