import {
  Friend,
  FriendStatus,
  ListFriendsQueryVariables,
  PaginatedFriends,
} from "wordle-friends-graphql";
import { query, transactWrite } from "../clients/dynamo";
import { FRIENDS_TABLE, USER_ID_STATUS_INDEX } from "../constants";

export type FriendKey = {
  userId: string;
  friendId: string;
};
export type SimpleFriend = Omit<Friend, "__typename" | "friend">;
export type SimplePaginatedFriends = Omit<
  PaginatedFriends,
  "__typename" | "friends"
> & { friends: SimpleFriend[] };

function generateId(userId: string, friendId: string): string {
  return `${userId}:${friendId}`;
}

function generateFriend(
  userId: string,
  friendId: string,
  status: FriendStatus
) {
  return {
    id: generateId(userId, friendId),
    userId,
    friendId,
    status,
  };
}

export async function sendFriendRequest({
  userId,
  friendId,
}: FriendKey): Promise<SimpleFriend> {
  const sentRequest = generateFriend(userId, friendId, FriendStatus.SENT);

  const generateItem = (friend: SimpleFriend) => ({
    TableName: FRIENDS_TABLE,
    Item: friend,
    ConditionExpression: "attribute_not_exists(userId)",
  });

  await transactWrite({
    TransactItems: [
      { Put: generateItem(sentRequest) },
      {
        Put: generateItem(
          generateFriend(friendId, userId, FriendStatus.RECEIVED)
        ),
      },
    ],
  });

  return sentRequest;
}

export async function acceptFriendRequest({
  userId,
  friendId,
}: FriendKey): Promise<SimpleFriend> {
  const generateItem = (userId: string, friendId: string) => ({
    TableName: FRIENDS_TABLE,
    Key: { userId, friendId },
    UpdateExpression: "SET #status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": FriendStatus.ACCEPTED },
  });

  await transactWrite({
    TransactItems: [
      { Update: generateItem(userId, friendId) },
      { Update: generateItem(friendId, userId) },
    ],
  });

  return generateFriend(userId, friendId, FriendStatus.ACCEPTED);
}

export async function deleteFriend({
  userId,
  friendId,
}: FriendKey): Promise<void> {
  const generateItem = (userId: string, friendId: string) => ({
    TableName: FRIENDS_TABLE,
    Key: { userId, friendId },
  });

  await transactWrite({
    TransactItems: [
      { Delete: generateItem(userId, friendId) },
      { Delete: generateItem(friendId, userId) },
    ],
  });
}

export async function listFriends({
  userId,
  limit,
  nextToken,
  status,
}: ListFriendsQueryVariables & {
  userId: string;
}): Promise<SimplePaginatedFriends> {
  const { items: friends, nextToken: newNextToken } = await query<SimpleFriend>(
    {
      TableName: FRIENDS_TABLE,
      IndexName: USER_ID_STATUS_INDEX,
      KeyConditionExpression: status
        ? "userId = :userId and #status = :status"
        : "userId = :userId",
      ExpressionAttributeNames: status ? { "#status": "status" } : undefined,
      ExpressionAttributeValues: {
        ":userId": userId,
        ...(status ? { ":status": status } : {}),
      },
    },
    limit,
    nextToken
  );

  return { friends, nextToken: newNextToken };
}
