import dayjs from "dayjs";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import {
  CreatePostMutation,
  CreatePostMutationVariables,
  FullPost,
  GetCurrentUserPostQuery,
  GetCurrentUserPostQueryVariables,
  User,
} from "../API";
import { createPost } from "../api/mutations";
import { getCurrentUserPost } from "../api/queries";
import { useAuth, UserInfo } from "../auth/AuthContext";
import { callGraphql } from "../graphql";
import { formatDateString } from "../utils/dates";

enum PostsQueryKey {
  CurrentUserPost = "currentUserPost",
}

function generateUser(currentUserInfo: UserInfo): User {
  const { id: userId, firstName, lastName } = currentUserInfo;
  return { __typename: "User", userId, firstName, lastName };
}

export function useCreatePost(): UseMutationResult<
  FullPost,
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
          __typename: "FullPost",
          user: generateUser(currentUserInfo as UserInfo),
        };
      }

      throw new Error("No data returned");
    },
    {
      onSuccess: (data) => {
        if (data.puzzleDate === formatDateString(dayjs())) {
          queryClient.setQueryData(PostsQueryKey.CurrentUserPost, data);
        }
      },
    }
  );
}

export function useGetCurrentUserPost(): UseQueryResult<FullPost | null> {
  const { currentUserInfo } = useAuth();

  return useQuery<FullPost | null>(PostsQueryKey.CurrentUserPost, async () => {
    const currentUserPost = (
      await callGraphql<
        GetCurrentUserPostQueryVariables,
        GetCurrentUserPostQuery
      >(getCurrentUserPost, { puzzleDate: formatDateString(dayjs()) })
    ).data?.getCurrentUserPost;

    if (!currentUserPost) {
      return null;
    }

    const post: FullPost = {
      ...currentUserPost,
      __typename: "FullPost",
      user: generateUser(currentUserInfo as UserInfo),
    };

    return post;
  });
}
