import { getPost, SimplePost } from "../../tables/posts";
import { PUZZLE_DATE, TIMESTAMPS } from "../../tests/constants";
import { generateEvent } from "../../tests/fixtures/events";
import { getCurrentUserPostHandler } from "./getCurrentUserPost";

jest.mock("../../tables/posts", () => ({
  getPost: jest.fn(),
}));

const USER_ID = "123";
const POST: SimplePost = {
  id: `${USER_ID}:${PUZZLE_DATE}`,
  userId: USER_ID,
  message: "Message!",
  puzzleDate: PUZZLE_DATE,
  isHardMode: true,
  colors: [],
  guesses: ["first"],
  ...TIMESTAMPS,
};
const EVENT = generateEvent({ puzzleDate: PUZZLE_DATE });

describe("getCurrentUserPostHandler", () => {
  beforeEach(() => {
    (getPost as jest.Mock).mockResolvedValue(POST);
  });

  it("gets the post from the table", async () => {
    expect.assertions(1);

    await getCurrentUserPostHandler(USER_ID, EVENT);

    expect(getPost).toHaveBeenCalledWith({
      userId: USER_ID,
      puzzleDate: PUZZLE_DATE,
    });
  });

  it("returns the result of the get post request", async () => {
    expect.assertions(1);

    await expect(getCurrentUserPostHandler(USER_ID, EVENT)).resolves.toEqual(
      POST
    );
  });
});
