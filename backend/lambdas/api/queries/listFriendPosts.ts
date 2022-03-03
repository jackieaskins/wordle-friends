import { AppSyncResolverEvent } from "aws-lambda";
import { getUser } from "../cognito";
import { POSTS_TABLE } from "../constants";
import { batchGet } from "../dynamo";
import {
  FriendStatus,
  GetCurrentUserPostQueryVariables,
  ListFriendPostsQueryVariables,
  ListFriendsQueryVariables,
  PaginatedPosts,
} from "../types";
import { getCurrentUserPost } from "./getCurrentUserPost";
import { listFriends } from "./listFriends";

export async function listFriendPosts(
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
    { nextToken: newNextToken, friends },
    { UserAttributes: userAttributes },
  ] = await Promise.all([
    getCurrentUserPost(userId, {
      arguments: { puzzleDate },
    } as AppSyncResolverEvent<GetCurrentUserPostQueryVariables>),
    listFriends(userId, {
      arguments: { nextToken, limit, status: FriendStatus.ACCEPTED },
    } as AppSyncResolverEvent<ListFriendsQueryVariables>),
    getUser(authorization),
  ]);
  const friendsById = Object.fromEntries(
    friends.map((friend) => [friend.userId, friend])
  );

  // TODO: Handle unprocessed keys
  const posts =
    (
      await batchGet({
        RequestItems: {
          [POSTS_TABLE]: {
            Keys: friends.map(({ userId: friendId }) => ({
              userId: friendId,
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
    nextToken: newNextToken,
    posts: posts.map(
      ({
        userId: postUserId,
        puzzleDate,
        isHardMode,
        createdAt,
        updatedAt,
        colors,
        guesses,
      }) => {
        const {
          userId: friendId,
          firstName,
          lastName,
        } = friendsById[postUserId];

        return {
          __typename: "Post",
          user: {
            __typename: "User",
            userId: friendId,
            firstName,
            lastName,
          },
          puzzleDate,
          isHardMode,
          createdAt,
          updatedAt,
          colors:
            hasAlreadyPosted || showSquares
              ? colors
              : colors.map(() => [null, null, null, null, null]),
          guesses: hasAlreadyPosted ? guesses : null,
        };
      }
    ),
  };
}
