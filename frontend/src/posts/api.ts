import dayjs from "dayjs";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import {
  createPost,
  CreatePostMutation,
  CreatePostMutationVariables,
  getCurrentUserPost,
  GetCurrentUserPostQuery,
  GetCurrentUserPostQueryVariables,
  listFriendPosts,
  ListFriendPostsQuery,
  ListFriendPostsQueryVariables,
  Post,
  User,
} from "wordle-friends-graphql";
import { UserInfo } from "../auth/AuthContext";
import { useCurrentUser } from "../auth/CurrentUserContext";
import { callGraphql } from "../graphql";
import { formatDateString } from "../utils/dates";

enum PostsQueryKey {
  CurrentUserPost = "currentUserPost",
  ListFriendPosts = "listFriendPosts",
}

function generateUser({ id: userId, firstName, lastName }: UserInfo): User {
  return { __typename: "User", userId, firstName, lastName };
}

export function useCreatePost(): UseMutationResult<
  Post,
  Error,
  CreatePostMutationVariables
> {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  return useMutation(
    async (input) => {
      const { data } = await callGraphql<
        CreatePostMutationVariables,
        CreatePostMutation
      >(createPost, input);

      if (data) {
        return {
          ...data.createPost,
          __typename: "Post",
          user: generateUser(currentUser),
        };
      }

      throw new Error("No data returned");
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
  const currentUser = useCurrentUser();

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

    const post: Post = {
      ...currentUserPost,
      __typename: "Post",
      user: generateUser(currentUser),
    };

    return post;
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
