import { AppSyncResolverEvent } from "aws-lambda";
import {
  AcceptFriendRequestMutationVariables,
  FriendKey,
  FriendStatus,
} from "wordle-friends-graphql";
import { FRIENDS_TABLE } from "../constants";
import { transactWrite } from "../dynamo";

export async function acceptFriendRequestHandler(
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
          Key: { userId, friendId },
          UpdateExpression: "SET #status = :status",
          ExpressionAttributeNames: { "#status": "status" },
          ExpressionAttributeValues: { ":status": FriendStatus.ACCEPTED },
        },
      },
      {
        Update: {
          TableName: FRIENDS_TABLE,
          Key: { friendId: userId, userId: friendId },
          UpdateExpression: "SET #status = :status",
          ExpressionAttributeNames: { "#status": "status" },
          ExpressionAttributeValues: { ":status": FriendStatus.ACCEPTED },
        },
      },
    ],
  });

  return { __typename: "FriendKey", userId, friendId };
}
