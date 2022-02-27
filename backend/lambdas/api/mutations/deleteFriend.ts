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
          Key: { userId: { S: userId }, friendId: { S: friendId } },
        },
      },
      {
        Delete: {
          TableName: FRIENDS_TABLE,
          Key: { userId: { S: friendId }, friendId: { S: userId } },
        },
      },
    ],
  });

  return { __typename: "FriendKey", userId, friendId };
}
