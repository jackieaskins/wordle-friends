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
  createReaction,
  CreateReactionMutation,
  CreateReactionMutationVariables,
  deleteReaction,
  DeleteReactionMutation,
  DeleteReactionMutationVariables,
  listPosts,
  ListPostsQuery,
  ListPostsQueryVariables,
  listUserPosts,
  ListUserPostsQuery,
  ListUserPostsQueryVariables,
  MinimalPost,
  Post,
  Reaction,
  RefType,
} from "wordle-friends-graphql";
import { callGraphql } from "../graphql";

export type SimplePost = Omit<Post, "commentData" | "reactions">;

function getPostsKey(puzzleDate: string): [string, string] {
  return ["posts", puzzleDate];
}
function getCommentsKey(postId: string): [string, string] {
  return ["comments", postId];
}
function getReactionsKey(
  refType: RefType,
  refId: string
): [string, string, string] {
  return ["reactions", refType, refId];
}

export function usePosts(puzzleDate: string): UseQueryResult<SimplePost[]> {
  const queryClient = useQueryClient();

  return useQuery<SimplePost[]>(getPostsKey(puzzleDate), async () => {
    const posts =
      (
        await callGraphql<ListPostsQueryVariables, ListPostsQuery>(listPosts, {
          puzzleDate,
        })
      ).data?.listPosts.posts ?? [];

    posts.forEach(({ id: postId, reactions, commentData: { comments } }) => {
      queryClient.setQueryData(getCommentsKey(postId), comments);
      queryClient.setQueryData(
        getReactionsKey(RefType.Post, postId),
        Object.fromEntries(
          reactions.map(({ react, userIds }) => [react, userIds])
        )
      );
    });

    return posts.map(({ commentData, reactions, ...post }) => post);
  });
}

async function paginateUserPosts(
  startDate: string,
  endDate: string,
  nextToken: string | null | undefined
): Promise<MinimalPost[]> {
  const { data } = await callGraphql<
    ListUserPostsQueryVariables,
    ListUserPostsQuery
  >(listUserPosts, { startDate, endDate, nextToken });

  if (!data) {
    return [];
  }

  const { posts, nextToken: newNextToken } = data.listUserPosts;

  if (newNextToken) {
    return [
      ...posts,
      ...(await paginateUserPosts(startDate, endDate, newNextToken)),
    ];
  }

  return posts;
}
export function useUserPosts(
  startDate: string,
  endDate: string
): UseQueryResult<MinimalPost[]> {
  return useQuery<MinimalPost[]>("userPosts", () =>
    paginateUserPosts(startDate, endDate, null)
  );
}

export function useComments(postId: string): UseQueryResult<Comment[]> {
  return useQuery<Comment[]>(getCommentsKey(postId), { enabled: false });
}

export function useReactions(
  refType: RefType,
  refId: string
): UseQueryResult<Record<string, string[]>> {
  return useQuery<Record<string, string[]>>(getReactionsKey(refType, refId), {
    enabled: false,
  });
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
          (posts) => [post, ...(posts ?? [])]
        );
        queryClient.invalidateQueries(getPostsKey(puzzleDate));
        queryClient.invalidateQueries("userPosts");
      },
    }
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
      onSuccess: (comment: Comment, { input: { postId } }) => {
        queryClient.setQueryData<Comment[]>(
          getCommentsKey(postId),
          (comments) => [...(comments ?? []), comment]
        );
      },
    }
  );
}

export function useCreateReaction(): UseMutationResult<
  Reaction,
  Error,
  CreateReactionMutationVariables
> {
  const queryClient = useQueryClient();

  return useMutation(
    async (input) => {
      const { data } = await callGraphql<
        CreateReactionMutationVariables,
        CreateReactionMutation
      >(createReaction, input);

      if (data?.createReaction) {
        return data?.createReaction;
      }

      throw new Error("No reaction returned");
    },
    {
      onSuccess: (
        { react, userIds }: Reaction,
        { input: { refType, refId } }
      ) => {
        queryClient.setQueryData<Record<string, string[]>>(
          getReactionsKey(refType, refId),
          (reactions) => ({ ...reactions, [react]: userIds })
        );
      },
    }
  );
}

export function useDeleteReaction(): UseMutationResult<
  Reaction,
  Error,
  DeleteReactionMutationVariables
> {
  const queryClient = useQueryClient();

  return useMutation(
    async (input) => {
      const { data } = await callGraphql<
        DeleteReactionMutationVariables,
        DeleteReactionMutation
      >(deleteReaction, input);

      if (data?.deleteReaction) {
        return data?.deleteReaction;
      }

      throw new Error("No reaction returned");
    },
    {
      onSuccess: (
        { react, userIds }: Reaction,
        { input: { refType, refId } }
      ) => {
        queryClient.setQueryData<Record<string, string[]>>(
          getReactionsKey(refType, refId),
          (reactions) => ({ ...reactions, [react]: userIds })
        );
      },
    }
  );
}
