import { Color, PostInput } from "wordle-friends-graphql";
import { createPost, SimplePost } from "../../tables/posts";
import { PUZZLE_DATE, TIMESTAMPS } from "../../tests/constants";
import { generateEvent } from "../../tests/fixtures/events";
import { createPostHandler } from "./createPost";

jest.mock("../../tables/posts", () => ({
  createPost: jest.fn(),
}));

const USER_ID = "123";
const POST_INPUT: PostInput = {
  message: "Message!",
  puzzleDate: "2021-01-01",
  isHardMode: true,
  colors: [
    [Color.GREEN],
    [Color.GREEN],
    [Color.GREEN],
    [Color.GREEN],
    [Color.GREEN],
  ],
  guesses: ["first"],
};
const POST: SimplePost = {
  ...POST_INPUT,
  ...TIMESTAMPS,
  id: `${USER_ID}:${PUZZLE_DATE}`,
  userId: USER_ID,
};
const EVENT = generateEvent({ input: POST_INPUT });

describe("createPostHandler", () => {
  beforeEach(() => {
    (createPost as jest.Mock).mockResolvedValue(POST);
  });

  it("creates a post in the posts table", async () => {
    expect.assertions(1);

    await createPostHandler(USER_ID, EVENT);

    expect(createPost).toHaveBeenCalledWith({ ...POST_INPUT, userId: USER_ID });
  });

  it("returns the created post", async () => {
    expect.assertions(1);

    await expect(createPostHandler(USER_ID, EVENT)).resolves.toEqual(POST);
  });
});
