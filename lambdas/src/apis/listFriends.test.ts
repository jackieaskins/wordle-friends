import {
  FriendStatus,
  ListFriendsQueryVariables,
} from "wordle-friends-graphql";
import { listFriends } from "../tables/friends";
import { generateEvent } from "../tests/fixtures/events";
import { listFriendsHandler } from "./listFriends";

jest.mock("../tables/friends", () => ({
  listFriends: jest.fn(),
}));

const USER_ID = "userId";
const INPUT = {
  limit: 10,
  status: FriendStatus.SENT,
  nextToken: "NEXT_TOKEN",
};
const RESPONSE = { friends: [], nextToken: "NEW_NEXT_TOKEN" };
const EVENT = generateEvent<ListFriendsQueryVariables>(INPUT);

describe("listFriendsHandler", () => {
  beforeEach(() => {
    (listFriends as jest.Mock).mockResolvedValue(RESPONSE);
  });

  it("lists the current user's friends", async () => {
    expect.assertions(1);

    await listFriendsHandler(USER_ID, EVENT);

    expect(listFriends).toHaveBeenCalledWith({ ...INPUT, userId: USER_ID });
  });

  it("returns the friends from the list call", async () => {
    expect.assertions(1);

    await expect(listFriendsHandler(USER_ID, EVENT)).resolves.toEqual(RESPONSE);
  });
});
