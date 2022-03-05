import { AppSyncResolverEvent } from "aws-lambda";
import {
  Friend,
  ListFriendsQueryVariables,
  PaginatedFriends,
} from "wordle-friends-graphql";
import { FRIENDS_TABLE, USER_ID_STATUS_INDEX } from "../constants";
import { query } from "../dynamo";

export async function listFriendsHandler(
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
    Limit: limit ?? 100,
    ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
    KeyConditionExpression: status
      ? "userId = :userId and #status = :status"
      : "userId = :userId",
    ExpressionAttributeNames: status ? { "#status": "status" } : undefined,
    ExpressionAttributeValues: {
      ":userId": userId,
      ...(status ? { ":status": status } : {}),
    },
  });

  return {
    __typename: "PaginatedFriends",
    friends: (friends ?? []) as Friend[],
    nextToken: lastEvaluatedKey ? JSON.stringify(lastEvaluatedKey) : null,
  };
}
