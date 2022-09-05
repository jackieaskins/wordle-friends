import { AppSyncResolverEvent } from "aws-lambda";
import { listComments, SimplePaginatedComments } from "../../tables/comments";
import { getPost, SimplePost } from "../../tables/posts";

export async function commentDataHandler(
  userId: string,
  { source: { id: postId, puzzleDate } }: AppSyncResolverEvent<any, SimplePost>
): Promise<SimplePaginatedComments> {
  const currentUserPost = await getPost({
    puzzleDate,
    userId,
  });

  if (!currentUserPost) {
    return {
      comments: [],
      nextToken: null,
    };
  }

  const commentData = await listComments({ postId });
  return commentData;
}
