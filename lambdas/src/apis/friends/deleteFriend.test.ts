import { deleteFriend } from "../../tables/friends";
import { generateEvent } from "../../tests/fixtures/events";
import { deleteFriendHandler } from "./deleteFriend";

jest.mock("../../tables/friends", () => ({
  deleteFriend: jest.fn(),
}));

const USER_ID = "123";
const FRIEND_ID = "456";

describe("deleteFriendHandler", () => {
  it("throws an error if", async () => {
    expect.assertions(1);

    await expect(
      deleteFriendHandler(USER_ID, generateEvent({ friendId: USER_ID }))
    ).rejects.toEqual(new Error("Cannot delete yourself as a friend"));
  });

  it("deletes the friend from the table", async () => {
    expect.assertions(1);

    await deleteFriendHandler(USER_ID, generateEvent({ friendId: FRIEND_ID }));

    expect(deleteFriend).toHaveBeenCalledWith({
      userId: USER_ID,
      friendId: FRIEND_ID,
    });
  });
});
