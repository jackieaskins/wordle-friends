/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listFriends = /* GraphQL */ `
  query ListFriends($status: FriendStatus, $limit: Int, $nextToken: String) {
    listFriends(status: $status, limit: $limit, nextToken: $nextToken) {
      friends {
        userId
        status
        firstName
        lastName
      }
      nextToken
    }
  }
`;
export const getCurrentUserPost = /* GraphQL */ `
  query GetCurrentUserPost($puzzleDate: AWSDate!) {
    getCurrentUserPost(puzzleDate: $puzzleDate) {
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
        user {
          userId
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
      }
      nextToken
    }
  }
`;
