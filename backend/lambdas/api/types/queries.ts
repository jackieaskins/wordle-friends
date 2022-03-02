/* tslint:disable */
 
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
      createdAt
      updatedAt
      colors
      guesses
    }
  }
`;
