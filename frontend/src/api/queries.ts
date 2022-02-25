/* tslint:disable */
 
// this is an auto generated file. This will be overwritten

export const listFriends = /* GraphQL */ `
  query ListFriends($status: FriendStatus, $limit: Int, $nextToken: String) {
    listFriends(status: $status, limit: $limit, nextToken: $nextToken) {
      friends {
        userId
        friend {
          userId
          firstName
          lastName
        }
        status
      }
      nextToken
    }
  }
`;
