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
  Post,
  Reaction,
} from "wordle-friends-graphql";
import { callGraphql } from "../graphql";
import { useComments } from "./CommentsContext";
import { useReactions } from "./ReactionsContext";

export type SimplePost = Omit<Post, "commentData" | "reactions">;

function getPostsKey(puzzleDate: string): [string, string] {
  return ["posts", puzzleDate];
}

export function usePosts(puzzleDate: string): UseQueryResult<SimplePost[]> {
  const { setComments } = useComments();
  const { setReactions } = useReactions();

  return useQuery<SimplePost[]>(getPostsKey(puzzleDate), async () => {
    const posts =
      (
        await callGraphql<ListPostsQueryVariables, ListPostsQuery>(listPosts, {
          puzzleDate,
        })
      ).data?.listPosts.posts ?? [];

    posts.forEach(({ id: postId, reactions, commentData: { comments } }) => {
      setComments(postId, comments);
      setReactions(postId, reactions);
    });

    return posts.map(({ commentData, ...post }) => post);
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
          (posts) => (posts ? [post, ...posts] : posts)
        );
        queryClient.invalidateQueries(getPostsKey(puzzleDate));
      },
    }
  );
}

export function useCreateComment(): UseMutationResult<
  Comment,
  Error,
  CreateCommentMutationVariables
> {
  const { addComment } = useComments();

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
        addComment(postId, comment);
      },
    }
  );
}

export function useCreateReaction(): UseMutationResult<
  Reaction,
  Error,
  CreateReactionMutationVariables
> {
  const { updateReaction } = useReactions();

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
      onSuccess: (reaction: Reaction, { input: { refId } }) => {
        updateReaction(refId, reaction);
      },
    }
  );
}

export function useDeleteReaction(): UseMutationResult<
  Reaction,
  Error,
  DeleteReactionMutationVariables
> {
  const { updateReaction } = useReactions();

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
      onSuccess: (reaction: Reaction, { input: { refId } }) => {
        updateReaction(refId, reaction);
      },
    }
  );
}
