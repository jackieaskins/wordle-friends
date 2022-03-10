import dayjs from "dayjs";
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
import { callGraphql } from "../graphql";
import { formatDateString } from "../utils/dates";

enum PostsQueryKey {
  CurrentUserPost = "currentUserPost",
  ListFriendPosts = "listFriendPosts",
}

function getCommentsKey(postId: string): [string, string] {
  return ["coments", postId];
}

export function usePostComments(postId: string): UseQueryResult<Comment[]> {
  return useQuery<Comment[]>(
    getCommentsKey(postId),
    async () =>
      (
        await callGraphql<
          ListPostCommentsQueryVariables,
          ListPostCommentsQuery
        >(listPostComments, { postId })
      ).data?.listPostComments?.comments ?? []
  );
}

export function useCreateComment(): UseMutationResult<
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
        queryClient.setQueryData<Comment[]>(
          getCommentsKey(comment.postId),
          (comments) => [...(comments ?? []), comment]
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
      onSuccess: (data) => {
        if (data.puzzleDate === formatDateString(dayjs())) {
          queryClient.setQueryData(PostsQueryKey.CurrentUserPost, data);
          queryClient.invalidateQueries(PostsQueryKey.ListFriendPosts);
        }
      },
    }
  );
}

export function useGetCurrentUserPost(): UseQueryResult<Post | null> {
  return useQuery<Post | null>(PostsQueryKey.CurrentUserPost, async () => {
    const currentUserPost = (
      await callGraphql<
        GetCurrentUserPostQueryVariables,
        GetCurrentUserPostQuery
      >(getCurrentUserPost, { puzzleDate: formatDateString(dayjs()) })
    ).data?.getCurrentUserPost;

    if (!currentUserPost) {
      return null;
    }

    return currentUserPost;
  });
}

export function useListFriendPosts(): UseQueryResult<Post[]> {
  return useQuery<Post[]>(
    PostsQueryKey.ListFriendPosts,
    async () =>
      (
        await callGraphql<ListFriendPostsQueryVariables, ListFriendPostsQuery>(
          listFriendPosts,
          { puzzleDate: formatDateString(dayjs()) }
        )
      ).data?.listFriendPosts.posts ?? []
  );
}
