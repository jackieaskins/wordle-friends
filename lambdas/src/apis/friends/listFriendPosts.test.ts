import { Color, FriendStatus } from "wordle-friends-graphql";
import { getUser } from "../../clients/cognito";
import { listFriends, SimpleFriend } from "../../tables/friends";
import { batchGetPosts, getPost, SimplePost } from "../../tables/posts";
import { AUTHORIZATION, PUZZLE_DATE, TIMESTAMPS } from "../../tests/constants";
import { generateEvent } from "../../tests/fixtures/events";
import { listFriendPostsHandler } from "./listFriendPosts";

jest.mock("../../clients/cognito", () => ({
  getUser: jest.fn(),
}));

jest.mock("../../tables/friends", () => ({
  listFriends: jest.fn(),
}));

jest.mock("../../tables/posts", () => ({
  getPost: jest.fn(),
  batchGetPosts: jest.fn(),
}));

const NEXT_TOKEN = "nextToken";
const USER_ID = "123";
const FRIEND_ID = "456";
const FRIENDS: SimpleFriend[] = [
  {
    userId: USER_ID,
    friendId: FRIEND_ID,
    id: `${USER_ID}:${FRIEND_ID}`,
    status: FriendStatus.ACCEPTED,
  },
];
const POST: SimplePost = {
  id: `${USER_ID}:${PUZZLE_DATE}`,
  userId: USER_ID,
  puzzleDate: PUZZLE_DATE,
  isHardMode: false,
  colors: [
    [null, Color.YELLOW, null, null, Color.YELLOW],
    [Color.GREEN, Color.GREEN, Color.GREEN, Color.GREEN, Color.GREEN],
  ],
  guesses: ["wrong", "right"],
  message: "WOW!",
  ...TIMESTAMPS,
};
const POSTS = [POST];
const EVENT = generateEvent({
  puzzleDate: PUZZLE_DATE,
  limit: 10,
  nextToken: "PREV_NEXT_TOKEN",
});

async function assertFieldsMatch(fields: Record<string, any>) {
  const { posts } = await listFriendPostsHandler(USER_ID, EVENT);

  expect(posts[0]).toEqual(expect.objectContaining(fields));
}

describe("listFriendPostsHandler", () => {
  beforeEach(() => {
    (getUser as jest.Mock).mockResolvedValue({});
    (listFriends as jest.Mock).mockResolvedValue({
      friends: FRIENDS,
      nextToken: NEXT_TOKEN,
    });
    (getPost as jest.Mock).mockResolvedValue(POST);
    (batchGetPosts as jest.Mock).mockResolvedValue(POSTS);
  });

  it("returns the posts and new next token", async () => {
    expect.assertions(1);

    await expect(listFriendPostsHandler(USER_ID, EVENT)).resolves.toEqual({
      posts: POSTS,
      nextToken: NEXT_TOKEN,
    });
  });

  it("gets the current user's post", async () => {
    expect.assertions(1);

    await listFriendPostsHandler(USER_ID, EVENT);

    expect(getPost).toHaveBeenCalledWith({
      userId: USER_ID,
      puzzleDate: PUZZLE_DATE,
    });
  });

  it("lists the current user's accepted friends", async () => {
    expect.assertions(1);

    await listFriendPostsHandler(USER_ID, EVENT);

    expect(listFriends).toHaveBeenCalledWith({
      userId: USER_ID,
      limit: 10,
      nextToken: "PREV_NEXT_TOKEN",
      status: FriendStatus.ACCEPTED,
    });
  });

  it("gets the current user's attributes", async () => {
    expect.assertions(1);

    await listFriendPostsHandler(USER_ID, EVENT);

    expect(getUser).toHaveBeenCalledWith(AUTHORIZATION);
  });

  describe("message", () => {
    it("does not return the message if the user has not posted", async () => {
      expect.assertions(1);

      (getPost as jest.Mock).mockResolvedValue(undefined);

      await assertFieldsMatch({ message: null });
    });

    it("returns the message if the user has posted", async () => {
      expect.assertions(1);

      (getPost as jest.Mock).mockResolvedValue(POST);

      await assertFieldsMatch({ message: POST.message });
    });
  });

  describe("colors", () => {
    it("returns blank colors if the user has not posted and doesn't show squares", async () => {
      expect.assertions(1);

      (getPost as jest.Mock).mockResolvedValue(undefined);
      (getUser as jest.Mock).mockResolvedValue({
        "custom:showSquares": "false",
      });

      await assertFieldsMatch({
        colors: [
          [null, null, null, null, null],
          [null, null, null, null, null],
        ],
      });
    });

    it("returns colors if the user has not posted but does show squares", async () => {
      expect.assertions(1);

      (getPost as jest.Mock).mockResolvedValue(undefined);
      (getUser as jest.Mock).mockResolvedValue({
        "custom:showSquares": "true",
      });

      await assertFieldsMatch({ colors: POST.colors });
    });

    it("returns colors if the user has posted", async () => {
      expect.assertions(1);

      (getPost as jest.Mock).mockResolvedValue(POST);

      await assertFieldsMatch({ colors: POST.colors });
    });
  });

  describe("guesses", () => {
    it("does not return guesses if the user has not posted", async () => {
      expect.assertions(1);

      (getPost as jest.Mock).mockResolvedValue(undefined);

      await assertFieldsMatch({ guesses: null });
    });

    it("returns guesses if the user has posted", async () => {
      expect.assertions(1);

      (getPost as jest.Mock).mockResolvedValue(POST);

      await assertFieldsMatch({ guesses: POST.guesses });
    });
  });
});
