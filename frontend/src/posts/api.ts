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
import { useAuth, UserInfo } from "../auth/AuthContext";
import { callGraphql } from "../graphql";
import { formatDateString } from "../utils/dates";

enum PostsQueryKey {
  CurrentUserPost = "currentUserPost",
  ListFriendPosts = "listFriendPosts",
}

function generateUser(currentUserInfo: UserInfo): User {
  const { id: userId, firstName, lastName } = currentUserInfo;
  return { __typename: "User", userId, firstName, lastName };
}

export function useCreatePost(): UseMutationResult<
  Post,
  Error,
  CreatePostMutationVariables
> {
  const queryClient = useQueryClient();
  const { currentUserInfo } = useAuth();

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
          user: generateUser(currentUserInfo as UserInfo),
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
  const { currentUserInfo } = useAuth();

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
      user: generateUser(currentUserInfo as UserInfo),
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
