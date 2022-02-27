/* tslint:disable */
 
// this is an auto generated file. This will be overwritten

export const acceptFriendRequest = /* GraphQL */ `
  mutation AcceptFriendRequest($friendId: String!) {
    acceptFriendRequest(friendId: $friendId) {
      userId
      friendId
    }
  }
`;
export const deleteFriend = /* GraphQL */ `
  mutation DeleteFriend($friendId: String!) {
    deleteFriend(friendId: $friendId) {
      userId
      friendId
    }
  }
`;
export const sendFriendRequest = /* GraphQL */ `
  mutation SendFriendRequest($friendId: String!) {
    sendFriendRequest(friendId: $friendId) {
      userId
      friendId
    }
  }
`;
