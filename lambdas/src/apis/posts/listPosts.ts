import { AppSyncResolverEvent } from "aws-lambda";
import { FriendStatus, ListPostsQueryVariables } from "wordle-friends-graphql";
import { getUser } from "../../clients/cognito";
import { MAX_LIMIT } from "../../clients/dynamo";
import { listFriends } from "../../tables/friends";
import {
  batchGetPosts,
  getPost,
  SimplePaginatedPosts,
} from "../../tables/posts";

const ONE_LIMIT_NEXT_TOKEN = "START";

export async function listPostsHandler(
  userId: string,
  {
    arguments: { puzzleDate, limit, nextToken },
    request: {
      headers: { authorization },
    },
  }: AppSyncResolverEvent<ListPostsQueryVariables>
): Promise<SimplePaginatedPosts> {
  const [currentUserPost, userAttributes] = await Promise.all([
    getPost({ userId, puzzleDate }),
    getUser(authorization),
  ]);

  if (!nextToken && limit === 1 && currentUserPost) {
    return {
      nextToken: ONE_LIMIT_NEXT_TOKEN,
      posts: [currentUserPost],
    };
  }

  const friendNextToken = nextToken === ONE_LIMIT_NEXT_TOKEN ? null : nextToken;
  const friendLimit =
    currentUserPost && !nextToken ? (limit ?? MAX_LIMIT) - 1 : limit;

  const { friends, nextToken: newNextToken } = await listFriends({
    userId,
    limit: friendLimit,
    nextToken: friendNextToken,
    status: FriendStatus.ACCEPTED,
  });

  const friendPosts = await batchGetPosts({
    userIds: friends.map(({ friendId }) => friendId),
    puzzleDate,
  });

  const posts =
    currentUserPost && !nextToken
      ? [currentUserPost, ...friendPosts]
      : friendPosts;

  const hasAlreadyPosted = !!currentUserPost;
  const showSquares = userAttributes["custom:showSquares"] === "true";

  return {
    nextToken: newNextToken,
    posts: posts.map(({ message, colors, guesses, ...rest }) => ({
      ...rest,
      message: hasAlreadyPosted ? message : null,
      colors:
        hasAlreadyPosted || showSquares
          ? colors
          : colors.map(() => [null, null, null, null, null]),
      guesses: hasAlreadyPosted ? guesses : null,
    })),
  };
}
