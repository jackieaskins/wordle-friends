import { FriendStatus } from "wordle-friends-graphql";
import { sendFriendRequest } from "../tables/friends";
import { generateEvent } from "../tests/fixtures/events";
import { sendFriendRequestHandler } from "./sendFriendRequest";

const USER_ID = "123";
const FRIEND_ID = "456";
const FRIEND = {
  id: `${USER_ID}:${FRIEND_ID}`,
  userId: USER_ID,
  friendId: FRIEND_ID,
  status: FriendStatus.SENT,
};
const EVENT = generateEvent({ friendId: FRIEND_ID });

jest.mock("../tables/friends", () => ({
  sendFriendRequest: jest.fn(),
}));

describe("sendFriendRequestHandler", () => {
  beforeEach(() => {
    (sendFriendRequest as jest.Mock).mockResolvedValue(FRIEND);
  });

  it("throws an error if friend id is the userId", async () => {
    expect.assertions(1);

    await expect(
      sendFriendRequestHandler(USER_ID, generateEvent({ friendId: USER_ID }))
    ).rejects.toEqual(new Error("You cannot add yourself as a friend"));
  });

  it("sends accept friend request to table", async () => {
    expect.assertions(1);

    await sendFriendRequestHandler(USER_ID, EVENT);

    expect(sendFriendRequest).toHaveBeenCalledWith({
      userId: USER_ID,
      friendId: FRIEND_ID,
    });
  });

  it("returns the accepted friend request", async () => {
    expect.assertions(1);

    await expect(sendFriendRequestHandler(USER_ID, EVENT)).resolves.toEqual(
      FRIEND
    );
  });
});
