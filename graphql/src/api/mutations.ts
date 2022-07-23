/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const acceptFriendRequest = /* GraphQL */ `
  mutation AcceptFriendRequest($friendId: String!) {
    acceptFriendRequest(friendId: $friendId) {
      id
      userId
      friendId
      status
      friend {
        id
        firstName
        lastName
      }
    }
  }
`;
export const deleteFriend = /* GraphQL */ `
  mutation DeleteFriend($friendId: String!) {
    deleteFriend(friendId: $friendId)
  }
`;
export const sendFriendRequest = /* GraphQL */ `
  mutation SendFriendRequest($friendId: String!) {
    sendFriendRequest(friendId: $friendId) {
      id
      userId
      friendId
      status
      friend {
        id
        firstName
        lastName
      }
    }
  }
`;
export const createPost = /* GraphQL */ `
  mutation CreatePost($input: PostInput!) {
    createPost(input: $input) {
      id
      userId
      user {
        id
        firstName
        lastName
      }
      puzzleDate
      isHardMode
      message
      createdAt
      updatedAt
      colors
      guesses
      commentData {
        comments {
          id
          postId
          userId
          user {
            id
            firstName
            lastName
          }
          text
          createdAt
          updatedAt
        }
        nextToken
      }
      reactions {
        react
        userIds
      }
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      id
      userId
      puzzleDate
      isHardMode
      message
      createdAt
      updatedAt
      colors
      guesses
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
      id
      postId
      userId
      user {
        id
        firstName
        lastName
      }
      text
      createdAt
      updatedAt
    }
  }
`;
export const createReaction = /* GraphQL */ `
  mutation CreateReaction($input: ReactionInput!) {
    createReaction(input: $input) {
      react
      userIds
    }
  }
`;
export const deleteReaction = /* GraphQL */ `
  mutation DeleteReaction($input: ReactionInput!) {
    deleteReaction(input: $input) {
      react
      userIds
    }
  }
`;
