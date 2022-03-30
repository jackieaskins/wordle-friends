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
  listPostComments,
  ListPostCommentsQuery,
  ListPostCommentsQueryVariables,
  listPosts,
  ListPostsQuery,
  ListPostsQueryVariables,
  Post,
} from "wordle-friends-graphql";
import { callGraphql } from "../graphql";

export type PostWithComments = Post & { comments: Comment[] };

function getListPostsKey(puzzleDate: string): [string, string] {
  return ["listPosts", puzzleDate];
}

export function useCreateComment({
  id: postId,
  puzzleDate,
}: PostWithComments): UseMutationResult<
  Comment,
  Error,
  CreateCommentMutationVariables
> {
  const queryClient = useQueryClient();

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
        queryClient.setQueryData<PostWithComments[] | undefined>(
          getListPostsKey(puzzleDate),
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
      onSuccess: (post) => {
        queryClient.setQueryData<PostWithComments[] | null | undefined>(
          getListPostsKey(post.puzzleDate),
          (posts) => (posts ? [{ ...post, comments: [] }, ...posts] : posts)
        );
        queryClient.invalidateQueries(getListPostsKey(post.puzzleDate));
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
export function usePosts(
  puzzleDate: string
): UseQueryResult<PostWithComments[]> {
  return useQuery<PostWithComments[]>(getListPostsKey(puzzleDate), async () => {
    const posts =
      (
        await callGraphql<ListPostsQueryVariables, ListPostsQuery>(listPosts, {
          puzzleDate,
        })
      ).data?.listPosts.posts ?? [];

    const allComments = await Promise.all(
      posts.map(({ id }) => listComments(id))
    );

    return posts.map((post, index) => ({
      ...post,
      comments: allComments[index],
    }));
  });
}
