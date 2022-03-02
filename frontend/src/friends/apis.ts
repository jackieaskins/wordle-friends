import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import {
  AcceptFriendRequestMutation,
  AcceptFriendRequestMutationVariables,
  DeleteFriendMutation,
  DeleteFriendMutationVariables,
  Friend,
  FriendKey,
  FriendStatus,
  ListFriendsQuery,
  ListFriendsQueryVariables,
  SendFriendRequestMutation,
  SendFriendRequestMutationVariables,
} from "../API";
import {
  acceptFriendRequest,
  deleteFriend,
  sendFriendRequest,
} from "../api/mutations";
import { listFriends } from "../api/queries";
import { callGraphql } from "../graphql";

type FriendsQueryKey =
  | "sentFriendRequests"
  | "receivedFriendRequests"
  | "friends";

export function useSendFriendRequest(): UseMutationResult<
  FriendKey | undefined,
  Error,
  SendFriendRequestMutationVariables
> {
  const queryClient = useQueryClient();

  return useMutation(
    async (input) =>
      (
        await callGraphql<
          SendFriendRequestMutationVariables,
          SendFriendRequestMutation
        >(sendFriendRequest, input)
      ).data?.sendFriendRequest,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("sentFriendRequests");
      },
    }
  );
}

export function useAcceptFriendRequest(): UseMutationResult<
  FriendKey | undefined,
  Error,
  AcceptFriendRequestMutationVariables
> {
  const queryClient = useQueryClient();

  return useMutation(
    async (input) =>
      (
        await callGraphql<
          AcceptFriendRequestMutationVariables,
          AcceptFriendRequestMutation
        >(acceptFriendRequest, input)
      ).data?.acceptFriendRequest,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("receivedFriendRequests");
        queryClient.invalidateQueries("friends");
      },
    }
  );
}

export function useDeleteFriend(): UseMutationResult<
  FriendKey | undefined,
  Error,
  DeleteFriendMutationVariables
> {
  const queryClient = useQueryClient();

  return useMutation(
    async (input) =>
      (
        await callGraphql<DeleteFriendMutationVariables, DeleteFriendMutation>(
          deleteFriend,
          input
        )
      ).data?.deleteFriend,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("sentFriendRequests");
        queryClient.invalidateQueries("receivedFriendRequests");
        queryClient.invalidateQueries("friends");
      },
    }
  );
}

// TODO: Handle pagination
function useListFriends(
  key: FriendsQueryKey,
  status?: FriendStatus
): UseQueryResult<Friend[]> {
  return useQuery<Friend[]>(
    key,
    async () =>
      (
        await callGraphql<ListFriendsQueryVariables, ListFriendsQuery>(
          listFriends,
          { status }
        )
      ).data?.listFriends?.friends ?? []
  );
}

export function useSentFriendRequests(): UseQueryResult<Friend[]> {
  return useListFriends("sentFriendRequests", FriendStatus.SENT);
}
export function useReceivedFriendRequests(): UseQueryResult<Friend[]> {
  return useListFriends("receivedFriendRequests", FriendStatus.RECEIVED);
}
export function useFriends(): UseQueryResult<Friend[]> {
  return useListFriends("friends", FriendStatus.ACCEPTED);
}
