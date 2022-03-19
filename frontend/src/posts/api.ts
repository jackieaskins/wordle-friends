import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import {
  Comment,
  createComment,
  CreateCommentMutation,
  CreateCommentMutationVariables,
  createPost,
  CreatePostMutation,
  CreatePostMutationVariables,
  getCurrentUserPost,
  GetCurrentUserPostQuery,
  GetCurrentUserPostQueryVariables,
  listFriendPosts,
  ListFriendPostsQuery,
  ListFriendPostsQueryVariables,
  listPostComments,
  ListPostCommentsQuery,
  ListPostCommentsQueryVariables,
  Post,
} from "wordle-friends-graphql";
import { useCurrentUser } from "../auth/CurrentUserContext";
import { callGraphql } from "../graphql";

export type PostWithComments = Post & { comments: Comment[] };

function getCurrentUserPostKey(puzzleDate: string): [string, string] {
  return ["currentUserPost", puzzleDate];
}
function getListFriendPostsKey(puzzleDate: string): [string, string] {
  return ["listFriendPosts", puzzleDate];
}

export function useCreateComment({
  id: postId,
  userId,
  puzzleDate,
}: PostWithComments): UseMutationResult<
  Comment,
  Error,
  CreateCommentMutationVariables
> {
  const queryClient = useQueryClient();
  const { id: currentUserId } = useCurrentUser();

  return useMutation(
    async (input) => {
      const { data } = await callGraphql<
        CreateCommentMutationVariables,
        CreateCommentMutation
      >(createComment, input);

      if (data?.createComment) {
        return data?.createComment;
      }

      throw new Error("No comment returned");
    },
    {
      onSuccess: (comment: Comment) => {
        if (userId === currentUserId) {
          queryClient.setQueryData<PostWithComments | null | undefined>(
            getCurrentUserPostKey(puzzleDate),
            (post) =>
              post ? { ...post, comments: [...post.comments, comment] } : post
          );
        } else {
          queryClient.setQueryData<PostWithComments[] | undefined>(
            getListFriendPostsKey(puzzleDate),
            (posts) => {
              if (!posts) {
                return posts;
              }

              const index = posts.findIndex(({ id }) => id === postId);
              if (index === -1) {
                return posts;
              }

              return [
                ...posts.slice(0, index),
                {
                  ...posts[index],
                  comments: [...posts[index].comments, comment],
                },
                ...posts.slice(index + 1),
              ];
            }
          );
        }
      },
    }
  );
}

export function useCreatePost(): UseMutationResult<
  Post,
  Error,
  CreatePostMutationVariables
> {
  const queryClient = useQueryClient();

  return useMutation(
    async (input) => {
      const { data } = await callGraphql<
        CreatePostMutationVariables,
        CreatePostMutation
      >(createPost, input);

      if (data?.createPost) {
        return data?.createPost;
      }

      throw new Error("No post returned");
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(getCurrentUserPostKey(data.puzzleDate));
        queryClient.invalidateQueries(getListFriendPostsKey(data.puzzleDate));
      },
    }
  );
}

async function listComments(postId: string): Promise<Comment[]> {
  return (
    (
      await callGraphql<ListPostCommentsQueryVariables, ListPostCommentsQuery>(
        listPostComments,
        { postId }
      )
    ).data?.listPostComments?.comments ?? []
  );
}

export function useGetCurrentUserPost(
  puzzleDate: string
): UseQueryResult<PostWithComments | null> {
  return useQuery<PostWithComments | null>(
    getCurrentUserPostKey(puzzleDate),
    async () => {
      const currentUserPost = (
        await callGraphql<
          GetCurrentUserPostQueryVariables,
          GetCurrentUserPostQuery
        >(getCurrentUserPost, { puzzleDate })
      ).data?.getCurrentUserPost;

      if (!currentUserPost) {
        return null;
      }

      const comments = await listComments(currentUserPost.id);

      return { ...currentUserPost, comments };
    }
  );
}

export function useListFriendPosts(
  puzzleDate: string
): UseQueryResult<PostWithComments[]> {
  return useQuery<PostWithComments[]>(
    getListFriendPostsKey(puzzleDate),
    async () => {
      const posts =
        (
          await callGraphql<
            ListFriendPostsQueryVariables,
            ListFriendPostsQuery
          >(listFriendPosts, { puzzleDate })
        ).data?.listFriendPosts.posts ?? [];

      const allComments = await Promise.all(
        posts.map(({ id }) => listComments(id))
      );

      return posts.map((post, index) => ({
        ...post,
        comments: allComments[index],
      }));
    }
  );
}
