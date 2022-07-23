/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Friend = {
  __typename: "Friend",
  id: string,
  userId: string,
  friendId: string,
  status: FriendStatus,
  friend?: User | null,
};

export enum FriendStatus {
  ACCEPTED = "ACCEPTED",
  SENT = "SENT",
  RECEIVED = "RECEIVED",
}


export type User = {
  __typename: "User",
  id: string,
  firstName: string,
  lastName: string,
};

export type PostInput = {
  puzzleDate: string,
  isHardMode: boolean,
  message?: string | null,
  colors: Array< Array< Color | null > >,
  guesses?: Array< string > | null,
};

export enum Color {
  GREEN = "GREEN",
  YELLOW = "YELLOW",
}


export type Post = {
  __typename: "Post",
  id: string,
  userId: string,
  user?: User | null,
  puzzleDate: string,
  isHardMode: boolean,
  message?: string | null,
  createdAt: string,
  updatedAt: string,
  colors: Array< Array< Color | null > >,
  guesses?: Array< string > | null,
  commentData: PaginatedComments,
  reactions:  Array<Reaction >,
};

export type PaginatedComments = {
  __typename: "PaginatedComments",
  comments:  Array<Comment >,
  nextToken?: string | null,
};

export type Comment = {
  __typename: "Comment",
  id: string,
  postId: string,
  userId: string,
  user?: User | null,
  text: string,
  createdAt: string,
  updatedAt: string,
};

export type Reaction = {
  __typename: "Reaction",
  react: string,
  userIds: Array< string >,
};

export type UpdatePostInput = {
  id: string,
  userId: string,
  puzzleDate: string,
  isHardMode: boolean,
  message?: string | null,
  createdAt: string,
  updatedAt: string,
  colors: Array< Array< Color | null > >,
  guesses?: Array< string > | null,
};

export type MinimalPost = {
  __typename: "MinimalPost",
  id: string,
  userId: string,
  puzzleDate: string,
  isHardMode: boolean,
  message?: string | null,
  createdAt: string,
  updatedAt: string,
  colors: Array< Array< Color | null > >,
  guesses?: Array< string > | null,
};

export type CommentInput = {
  postId: string,
  text: string,
};

export type ReactionInput = {
  refId: string,
  refType: RefType,
  react: string,
};

export enum RefType {
  Comment = "Comment",
  Post = "Post",
}


export type PaginatedFriends = {
  __typename: "PaginatedFriends",
  friends:  Array<Friend >,
  nextToken?: string | null,
};

export type PaginatedPosts = {
  __typename: "PaginatedPosts",
  posts:  Array<Post >,
  nextToken?: string | null,
};

export type PaginatedMinimalPosts = {
  __typename: "PaginatedMinimalPosts",
  posts:  Array<MinimalPost >,
  nextToken?: string | null,
};

export type AcceptFriendRequestMutationVariables = {
  friendId: string,
};

export type AcceptFriendRequestMutation = {
  acceptFriendRequest:  {
    __typename: "Friend",
    id: string,
    userId: string,
    friendId: string,
    status: FriendStatus,
    friend?:  {
      __typename: "User",
      id: string,
      firstName: string,
      lastName: string,
    } | null,
  },
};

export type DeleteFriendMutationVariables = {
  friendId: string,
};

export type DeleteFriendMutation = {
  deleteFriend?: boolean | null,
};

export type SendFriendRequestMutationVariables = {
  friendId: string,
};

export type SendFriendRequestMutation = {
  sendFriendRequest:  {
    __typename: "Friend",
    id: string,
    userId: string,
    friendId: string,
    status: FriendStatus,
    friend?:  {
      __typename: "User",
      id: string,
      firstName: string,
      lastName: string,
    } | null,
  },
};

export type CreatePostMutationVariables = {
  input: PostInput,
};

export type CreatePostMutation = {
  createPost:  {
    __typename: "Post",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      firstName: string,
      lastName: string,
    } | null,
    puzzleDate: string,
    isHardMode: boolean,
    message?: string | null,
    createdAt: string,
    updatedAt: string,
    colors: Array< Array< Color | null > >,
    guesses?: Array< string > | null,
    commentData:  {
      __typename: "PaginatedComments",
      comments:  Array< {
        __typename: "Comment",
        id: string,
        postId: string,
        userId: string,
        user?:  {
          __typename: "User",
          id: string,
          firstName: string,
          lastName: string,
        } | null,
        text: string,
        createdAt: string,
        updatedAt: string,
      } >,
      nextToken?: string | null,
    },
    reactions:  Array< {
      __typename: "Reaction",
      react: string,
      userIds: Array< string >,
    } >,
  },
};

export type UpdatePostMutationVariables = {
  input: UpdatePostInput,
};

export type UpdatePostMutation = {
  updatePost:  {
    __typename: "MinimalPost",
    id: string,
    userId: string,
    puzzleDate: string,
    isHardMode: boolean,
    message?: string | null,
    createdAt: string,
    updatedAt: string,
    colors: Array< Array< Color | null > >,
    guesses?: Array< string > | null,
  },
};

export type CreateCommentMutationVariables = {
  input: CommentInput,
};

export type CreateCommentMutation = {
  createComment:  {
    __typename: "Comment",
    id: string,
    postId: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      firstName: string,
      lastName: string,
    } | null,
    text: string,
    createdAt: string,
    updatedAt: string,
  },
};

export type CreateReactionMutationVariables = {
  input: ReactionInput,
};

export type CreateReactionMutation = {
  createReaction:  {
    __typename: "Reaction",
    react: string,
    userIds: Array< string >,
  },
};

export type DeleteReactionMutationVariables = {
  input: ReactionInput,
};

export type DeleteReactionMutation = {
  deleteReaction:  {
    __typename: "Reaction",
    react: string,
    userIds: Array< string >,
  },
};

export type ListFriendsQueryVariables = {
  status?: FriendStatus | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFriendsQuery = {
  listFriends:  {
    __typename: "PaginatedFriends",
    friends:  Array< {
      __typename: "Friend",
      id: string,
      userId: string,
      friendId: string,
      status: FriendStatus,
      friend?:  {
        __typename: "User",
        id: string,
        firstName: string,
        lastName: string,
      } | null,
    } >,
    nextToken?: string | null,
  },
};

export type ListPostsQueryVariables = {
  puzzleDate: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPostsQuery = {
  listPosts:  {
    __typename: "PaginatedPosts",
    posts:  Array< {
      __typename: "Post",
      id: string,
      userId: string,
      user?:  {
        __typename: "User",
        id: string,
        firstName: string,
        lastName: string,
      } | null,
      puzzleDate: string,
      isHardMode: boolean,
      message?: string | null,
      createdAt: string,
      updatedAt: string,
      colors: Array< Array< Color | null > >,
      guesses?: Array< string > | null,
      commentData:  {
        __typename: "PaginatedComments",
        comments:  Array< {
          __typename: "Comment",
          id: string,
          postId: string,
          userId: string,
          user?:  {
            __typename: "User",
            id: string,
            firstName: string,
            lastName: string,
          } | null,
          text: string,
          createdAt: string,
          updatedAt: string,
        } >,
        nextToken?: string | null,
      },
      reactions:  Array< {
        __typename: "Reaction",
        react: string,
        userIds: Array< string >,
      } >,
    } >,
    nextToken?: string | null,
  },
};

export type ListUserPostsQueryVariables = {
  startDate?: string | null,
  endDate?: string | null,
  nextToken?: string | null,
};

export type ListUserPostsQuery = {
  listUserPosts:  {
    __typename: "PaginatedMinimalPosts",
    posts:  Array< {
      __typename: "MinimalPost",
      id: string,
      userId: string,
      puzzleDate: string,
      isHardMode: boolean,
      message?: string | null,
      createdAt: string,
      updatedAt: string,
      colors: Array< Array< Color | null > >,
      guesses?: Array< string > | null,
    } >,
    nextToken?: string | null,
  },
};

export type GetCurrentUserPostQueryVariables = {
  puzzleDate: string,
};

export type GetCurrentUserPostQuery = {
  getCurrentUserPost?:  {
    __typename: "Post",
    id: string,
    userId: string,
    user?:  {
      __typename: "User",
      id: string,
      firstName: string,
      lastName: string,
    } | null,
    puzzleDate: string,
    isHardMode: boolean,
    message?: string | null,
    createdAt: string,
    updatedAt: string,
    colors: Array< Array< Color | null > >,
    guesses?: Array< string > | null,
    commentData:  {
      __typename: "PaginatedComments",
      comments:  Array< {
        __typename: "Comment",
        id: string,
        postId: string,
        userId: string,
        user?:  {
          __typename: "User",
          id: string,
          firstName: string,
          lastName: string,
        } | null,
        text: string,
        createdAt: string,
        updatedAt: string,
      } >,
      nextToken?: string | null,
    },
    reactions:  Array< {
      __typename: "Reaction",
      react: string,
      userIds: Array< string >,
    } >,
  } | null,
};

export type ListFriendPostsQueryVariables = {
  puzzleDate: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFriendPostsQuery = {
  listFriendPosts:  {
    __typename: "PaginatedPosts",
    posts:  Array< {
      __typename: "Post",
      id: string,
      userId: string,
      user?:  {
        __typename: "User",
        id: string,
        firstName: string,
        lastName: string,
      } | null,
      puzzleDate: string,
      isHardMode: boolean,
      message?: string | null,
      createdAt: string,
      updatedAt: string,
      colors: Array< Array< Color | null > >,
      guesses?: Array< string > | null,
      commentData:  {
        __typename: "PaginatedComments",
        comments:  Array< {
          __typename: "Comment",
          id: string,
          postId: string,
          userId: string,
          user?:  {
            __typename: "User",
            id: string,
            firstName: string,
            lastName: string,
          } | null,
          text: string,
          createdAt: string,
          updatedAt: string,
        } >,
        nextToken?: string | null,
      },
      reactions:  Array< {
        __typename: "Reaction",
        react: string,
        userIds: Array< string >,
      } >,
    } >,
    nextToken?: string | null,
  },
};

export type ListPostCommentsQueryVariables = {
  postId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPostCommentsQuery = {
  listPostComments:  {
    __typename: "PaginatedComments",
    comments:  Array< {
      __typename: "Comment",
      id: string,
      postId: string,
      userId: string,
      user?:  {
        __typename: "User",
        id: string,
        firstName: string,
        lastName: string,
      } | null,
      text: string,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
  },
};
