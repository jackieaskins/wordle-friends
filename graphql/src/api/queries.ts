/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listFriends = /* GraphQL */ `
  query ListFriends($status: FriendStatus, $limit: Int, $nextToken: String) {
    listFriends(status: $status, limit: $limit, nextToken: $nextToken) {
      friends {
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
      nextToken
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts($puzzleDate: AWSDate!, $limit: Int, $nextToken: String) {
    listPosts(puzzleDate: $puzzleDate, limit: $limit, nextToken: $nextToken) {
      posts {
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
      }
      nextToken
    }
  }
`;
export const getCurrentUserPost = /* GraphQL */ `
  query GetCurrentUserPost($puzzleDate: AWSDate!) {
    getCurrentUserPost(puzzleDate: $puzzleDate) {
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
    }
  }
`;
export const listFriendPosts = /* GraphQL */ `
  query ListFriendPosts(
    $puzzleDate: AWSDate!
    $limit: Int
    $nextToken: String
  ) {
    listFriendPosts(
      puzzleDate: $puzzleDate
      limit: $limit
      nextToken: $nextToken
    ) {
      posts {
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
      }
      nextToken
    }
  }
`;
export const listPostComments = /* GraphQL */ `
  query ListPostComments($postId: String!, $limit: Int, $nextToken: String) {
    listPostComments(postId: $postId, limit: $limit, nextToken: $nextToken) {
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
  }
`;
