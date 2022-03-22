import { FriendStatus } from "wordle-friends-graphql";
import { acceptFriendRequest } from "../tables/friends";
import { generateEvent } from "../testUtils";
import { acceptFriendRequestHandler } from "./acceptFriendRequest";

const USER_ID = "123";
const FRIEND_ID = "456";
const FRIEND = {
  id: `${USER_ID}:${FRIEND_ID}`,
  userId: USER_ID,
  friendId: FRIEND_ID,
  status: FriendStatus.ACCEPTED,
};
const EVENT = generateEvent({ friendId: FRIEND_ID });

jest.mock("../tables/friends", () => ({
  acceptFriendRequest: jest.fn(),
}));

describe("acceptFriendRequestHandler", () => {
  beforeEach(() => {
    (acceptFriendRequest as jest.Mock).mockResolvedValue(FRIEND);
  });

  it("throws an error if friend id is the userId", async () => {
    expect.assertions(1);

    await expect(
      acceptFriendRequestHandler(USER_ID, generateEvent({ friendId: USER_ID }))
    ).rejects.toEqual(new Error("You cannot add yourself as a friend"));
  });

  it("sends accept friend request to table", async () => {
    expect.assertions(1);

    await acceptFriendRequestHandler(USER_ID, EVENT);

    expect(acceptFriendRequest).toHaveBeenCalledWith({
      userId: USER_ID,
      friendId: FRIEND_ID,
    });
  });

  it("returns the accepted friend request", async () => {
    expect.assertions(1);

    await expect(acceptFriendRequestHandler(USER_ID, EVENT)).resolves.toEqual(
      FRIEND
    );
  });
});
