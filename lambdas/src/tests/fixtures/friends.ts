import { FriendStatus } from "wordle-friends-graphql";
import { SimpleFriend } from "../../tables/friends";
import { FRIEND_ID, USER_ID } from "../constants";

export function generateFriend(
  overrides: Partial<SimpleFriend> = {}
): SimpleFriend {
  return {
    userId: USER_ID,
    friendId: FRIEND_ID,
    id: `${USER_ID}:${FRIEND_ID}`,
    status: FriendStatus.ACCEPTED,
    ...overrides,
  };
}
