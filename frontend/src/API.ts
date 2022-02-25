/* tslint:disable */
 
//  This file was automatically generated and should not be edited.

export type FriendKey = {
  __typename: "FriendKey";
  userId: string;
  status: FriendStatus;
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
  friend: User;
  status: FriendStatus;
};

export type User = {
  __typename: "User";
  userId: string;
  firstName: string;
  lastName: string;
};

export type SendFriendRequestMutationVariables = {
  friendId: string;
};

export type SendFriendRequestMutation = {
  sendFriendRequest: {
    __typename: "FriendKey";
    userId: string;
    status: FriendStatus;
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
      friend: {
        __typename: "User";
        userId: string;
        firstName: string;
        lastName: string;
      };
      status: FriendStatus;
    }>;
    nextToken?: string | null;
  } | null;
};
