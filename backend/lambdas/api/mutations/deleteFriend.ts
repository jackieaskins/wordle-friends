import { AppSyncResolverEvent } from "aws-lambda";
import { FRIENDS_TABLE } from "../constants";
import { transactWrite } from "../dynamo";
import { DeleteFriendMutationVariables, FriendKey } from "../types";

export async function deleteFriend(
  userId: string,
  {
    arguments: { friendId },
  }: AppSyncResolverEvent<DeleteFriendMutationVariables>
): Promise<FriendKey> {
  if (friendId === "" || friendId === userId) {
    throw new Error("Invalid friendId");
  }

  await transactWrite({
    TransactItems: [
      {
        Delete: {
          TableName: FRIENDS_TABLE,
          Key: { userId, friendId },
        },
      },
      {
        Delete: {
          TableName: FRIENDS_TABLE,
          Key: { userId: friendId, friendId: userId },
        },
      },
    ],
  });

  return { __typename: "FriendKey", userId, friendId };
}
