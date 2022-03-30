import { AppSyncResolverEvent } from "aws-lambda";
import {
  FriendStatus,
  ListFriendPostsQueryVariables,
} from "wordle-friends-graphql";
import { getUser } from "../clients/cognito";
import { listFriends } from "../tables/friends";
import { getPost, batchGetPosts, SimplePaginatedPosts } from "../tables/posts";

export async function listFriendPostsHandler(
  userId: string,
  {
    arguments: { puzzleDate, limit, nextToken },
    request: {
      headers: { authorization },
    },
  }: AppSyncResolverEvent<ListFriendPostsQueryVariables>
): Promise<SimplePaginatedPosts> {
  const [
    currentUserPost,
    { friends, nextToken: newNextToken },
    userAttributes,
  ] = await Promise.all([
    getPost({ userId, puzzleDate }),
    listFriends({ userId, limit, nextToken, status: FriendStatus.ACCEPTED }),
    getUser(authorization),
  ]);

  const posts = await batchGetPosts({
    userIds: friends.map(({ friendId }) => friendId),
    puzzleDate,
  });

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
