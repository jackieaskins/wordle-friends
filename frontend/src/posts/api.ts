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
  listPosts,
  ListPostsQuery,
  ListPostsQueryVariables,
  Post,
} from "wordle-friends-graphql";
import { callGraphql } from "../graphql";
import { useComments } from "./CommentsContext";

export type SimplePost = Omit<Post, "commentData">;

function getPostsKey(puzzleDate: string): [string, string] {
  return ["posts", puzzleDate];
}

export function usePosts(puzzleDate: string): UseQueryResult<SimplePost[]> {
  const { setComments } = useComments();

  return useQuery<SimplePost[]>(getPostsKey(puzzleDate), async () => {
    const posts =
      (
        await callGraphql<ListPostsQueryVariables, ListPostsQuery>(listPosts, {
          puzzleDate,
        })
      ).data?.listPosts.posts ?? [];

    posts.forEach(({ id: postId, commentData: { comments } }) =>
      setComments(postId, comments)
    );

    return posts.map(({ commentData, ...post }) => post);
  });
}

export function useCreateComment(): UseMutationResult<
  Comment,
  Error,
  CreateCommentMutationVariables
> {
  const { setComments } = useComments();

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
      onSuccess: (comment: Comment, { input: { postId } }) => {
        setComments(postId, (currComments) => [...currComments, comment]);
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
      onSuccess: ({ commentData, ...post }) => {
        const { puzzleDate } = post;
        queryClient.setQueryData<SimplePost[] | null | undefined>(
          getPostsKey(puzzleDate),
          (posts) => (posts ? [post, ...posts] : posts)
        );
        queryClient.invalidateQueries(getPostsKey(puzzleDate));
      },
    }
  );
}
