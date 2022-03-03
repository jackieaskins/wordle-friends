/* tslint:disable */
 
//  This file was automatically generated and should not be edited.

export type FriendKey = {
  __typename: "FriendKey";
  userId: string;
  friendId: string;
};

export type PostInput = {
  puzzleDate: string;
  isHardMode: boolean;
  message?: string | null;
  colors: Array<Array<Color | null>>;
  guesses?: Array<string> | null;
};

export enum Color {
  GREEN = "GREEN",
  YELLOW = "YELLOW",
}

export type CurrentUserPost = {
  __typename: "CurrentUserPost";
  puzzleDate: string;
  isHardMode: boolean;
  message?: string | null;
  createdAt: string;
  updatedAt: string;
  colors: Array<Array<Color | null>>;
  guesses?: Array<string> | null;
};

export type BasePost = {
  __typename: "BasePost";
  puzzleDate: string;
  isHardMode: boolean;
  message?: string | null;
  createdAt: string;
  updatedAt: string;
  colors: Array<Array<Color | null>>;
  guesses?: Array<string> | null;
};

export type Post = {
  __typename: "Post";
  user: User;
  puzzleDate: string;
  isHardMode: boolean;
  message?: string | null;
  createdAt: string;
  updatedAt: string;
  colors: Array<Array<Color | null>>;
  guesses?: Array<string> | null;
};

export type User = {
  __typename: "User";
  userId: string;
  firstName: string;
  lastName: string;
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

export type PaginatedPosts = {
  __typename: "PaginatedPosts";
  posts: Array<Post>;
  nextToken?: string | null;
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

export type CreatePostMutationVariables = {
  input: PostInput;
};

export type CreatePostMutation = {
  createPost: {
    __typename: "CurrentUserPost";
    puzzleDate: string;
    isHardMode: boolean;
    message?: string | null;
    createdAt: string;
    updatedAt: string;
    colors: Array<Array<Color | null>>;
    guesses?: Array<string> | null;
  };
};

export type ListFriendsQueryVariables = {
  status?: FriendStatus | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListFriendsQuery = {
  listFriends: {
    __typename: "PaginatedFriends";
    friends: Array<{
      __typename: "Friend";
      userId: string;
      status: FriendStatus;
      firstName: string;
      lastName: string;
    }>;
    nextToken?: string | null;
  };
};

export type GetCurrentUserPostQueryVariables = {
  puzzleDate: string;
};

export type GetCurrentUserPostQuery = {
  getCurrentUserPost?: {
    __typename: "CurrentUserPost";
    puzzleDate: string;
    isHardMode: boolean;
    message?: string | null;
    createdAt: string;
    updatedAt: string;
    colors: Array<Array<Color | null>>;
    guesses?: Array<string> | null;
  } | null;
};

export type ListFriendPostsQueryVariables = {
  puzzleDate: string;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListFriendPostsQuery = {
  listFriendPosts: {
    __typename: "PaginatedPosts";
    posts: Array<{
      __typename: "Post";
      user: {
        __typename: "User";
        userId: string;
        firstName: string;
        lastName: string;
      };
      puzzleDate: string;
      isHardMode: boolean;
      message?: string | null;
      createdAt: string;
      updatedAt: string;
      colors: Array<Array<Color | null>>;
      guesses?: Array<string> | null;
    }>;
    nextToken?: string | null;
  };
};
