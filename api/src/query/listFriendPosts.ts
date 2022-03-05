import { AppSyncResolverEvent } from "aws-lambda";
import {
  FriendStatus,
  GetCurrentUserPostQueryVariables,
  ListFriendPostsQueryVariables,
  PaginatedPosts,
} from "wordle-friends-graphql";
import { getUser } from "../cognito";
import { FRIENDS_TABLE, POSTS_TABLE, USER_ID_STATUS_INDEX } from "../constants";
import { batchGet, query } from "../dynamo";
import { getCurrentUserPostHandler } from "./getCurrentUserPost";

export async function listFriendPostsHandler(
  userId: string,
  {
    arguments: { puzzleDate, limit, nextToken },
    request: {
      headers: { authorization },
    },
  }: AppSyncResolverEvent<ListFriendPostsQueryVariables>
): Promise<PaginatedPosts> {
  if (limit != null && (limit <= 0 || limit > 100)) {
    throw new Error("limit must be > 0 and <= 100");
  }

  // TODO: Remove casting
  const [
    currentUserPost,
    { Items: friends, LastEvaluatedKey: lastEvaluatedKey },
    { UserAttributes: userAttributes },
  ] = await Promise.all([
    getCurrentUserPostHandler(userId, {
      arguments: { puzzleDate },
    } as AppSyncResolverEvent<GetCurrentUserPostQueryVariables>),
    query({
      TableName: FRIENDS_TABLE,
      IndexName: USER_ID_STATUS_INDEX,
      Limit: limit ?? 100,
      ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
      KeyConditionExpression: "userId = :userId and #status = :status",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":userId": userId,
        ":status": FriendStatus.ACCEPTED,
      },
    }),
    getUser(authorization),
  ]);

  if (!friends?.length) {
    return {
      __typename: "PaginatedPosts",
      nextToken: lastEvaluatedKey ? JSON.stringify(lastEvaluatedKey) : null,
      posts: [],
    };
  }

  // TODO: Handle unprocessed keys
  const posts =
    (
      await batchGet({
        RequestItems: {
          [POSTS_TABLE]: {
            Keys: friends.map(({ friendId: userId }) => ({
              userId,
              puzzleDate,
            })),
          },
        },
      })
    ).Responses?.[POSTS_TABLE] ?? [];

  const hasAlreadyPosted = !!currentUserPost;
  const showSquares =
    userAttributes?.find(({ Name: name }) => name === "custom:showSquares")
      ?.Value === "true";

  return {
    __typename: "PaginatedPosts",
    nextToken: lastEvaluatedKey ? JSON.stringify(lastEvaluatedKey) : null,
    posts: posts.map(
      ({
        userId: postUserId,
        id,
        puzzleDate,
        isHardMode,
        message,
        createdAt,
        updatedAt,
        colors,
        guesses,
      }) => ({
        __typename: "Post",
        id,
        userId: postUserId,
        puzzleDate,
        isHardMode,
        message: hasAlreadyPosted ? message : null,
        createdAt,
        updatedAt,
        colors:
          hasAlreadyPosted || showSquares
            ? colors
            : colors.map(() => [null, null, null, null, null]),
        guesses: hasAlreadyPosted ? guesses : null,
      })
    ),
  };
}
