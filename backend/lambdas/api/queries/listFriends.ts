import { AppSyncResolverEvent } from "aws-lambda";
import {
  FRIENDS_TABLE,
  USER_ATTRIBUTES_TABLE,
  USER_ID_STATUS_INDEX,
} from "../constants";
import { batchGet, query } from "../dynamo";
import { ListFriendsQueryVariables, PaginatedFriends } from "../types";

export async function listFriends(
  userId: string,
  {
    arguments: { limit, status, nextToken },
  }: AppSyncResolverEvent<ListFriendsQueryVariables>
): Promise<PaginatedFriends> {
  if (limit != null && (limit <= 0 || limit > 100)) {
    throw new Error("limit must be > 0 and <= 100");
  }

  const { Items: friends, LastEvaluatedKey: lastEvaluatedKey } = await query({
    TableName: FRIENDS_TABLE,
    IndexName: USER_ID_STATUS_INDEX,
    Limit: limit ?? undefined,
    ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
    KeyConditionExpression: status
      ? "userId = :userId and #status = :status"
      : "userId = :userId",
    ExpressionAttributeNames: status ? { "#status": "status" } : undefined,
    ExpressionAttributeValues: {
      ":userId": { S: userId },
      ...(status ? { ":status": { S: status } } : {}),
    },
  });

  if (!friends || friends.length === 0) {
    return { __typename: "PaginatedFriends", friends: [], nextToken: null };
  }

  // TODO: Handle unprocessed keys
  const userAttributes =
    (
      await batchGet({
        RequestItems: {
          [USER_ATTRIBUTES_TABLE]: {
            ConsistentRead: true,
            Keys: friends.map(({ friendId }) => ({
              userId: friendId,
            })),
          },
        },
      })
    ).Responses?.[USER_ATTRIBUTES_TABLE] ?? [];

  const userAttributesMap = Object.fromEntries(
    userAttributes.map(({ userId, firstName, lastName }) => [
      userId.S,
      { userId: userId.S, firstName: firstName.S, lastName: lastName.S },
    ])
  );

  return {
    __typename: "PaginatedFriends",
    friends: friends.map(({ friendId, status }) => ({
      __typename: "Friend",
      status: status.S,
      ...userAttributesMap[friendId.S as string],
    })),
    nextToken: lastEvaluatedKey ? JSON.stringify(lastEvaluatedKey) : null,
  };
}
