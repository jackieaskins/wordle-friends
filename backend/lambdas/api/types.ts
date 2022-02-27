/* tslint:disable */
 
//  This file was automatically generated and should not be edited.

export type FriendKey = {
  __typename: "FriendKey";
  userId: string;
  friendId: string;
};

export enum FriendStatus {
  ACCEPTED = "ACCEPTED",
  SENT = "SENT",
  RECEIVED = "RECEIVED",
}

export type PaginatedFriends = {
  __typename: "PaginatedFriends";
  friends: Array<Friend>;
  nextToken?: string | null;
};

export type Friend = {
  __typename: "Friend";
  userId: string;
  status: FriendStatus;
  firstName: string;
  lastName: string;
};

export type AcceptFriendRequestMutationVariables = {
  friendId: string;
};

export type AcceptFriendRequestMutation = {
  acceptFriendRequest: {
    __typename: "FriendKey";
    userId: string;
    friendId: string;
  };
};

export type DeleteFriendMutationVariables = {
  friendId: string;
};

export type DeleteFriendMutation = {
  deleteFriend: {
    __typename: "FriendKey";
    userId: string;
    friendId: string;
  };
};

export type SendFriendRequestMutationVariables = {
  friendId: string;
};

export type SendFriendRequestMutation = {
  sendFriendRequest: {
    __typename: "FriendKey";
    userId: string;
    friendId: string;
  };
};

export type ListFriendsQueryVariables = {
  status?: FriendStatus | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListFriendsQuery = {
  listFriends?: {
    __typename: "PaginatedFriends";
    friends: Array<{
      __typename: "Friend";
      userId: string;
      status: FriendStatus;
      firstName: string;
      lastName: string;
    }>;
    nextToken?: string | null;
  } | null;
};
