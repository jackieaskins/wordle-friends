import { listComments } from "../../tables/comments";
import { PUZZLE_DATE } from "../../tests/constants";
import { generateEvent } from "../../tests/fixtures/events";
import { listPostCommentsHandler } from "./listPostComments";

jest.mock("../../tables/comments", () => ({
  listComments: jest.fn(),
}));

const USER_ID = "userId";
const INPUT = {
  limit: 10,
  postId: `${USER_ID}:${PUZZLE_DATE}`,
  nextToken: "NEXT_TOKEN",
};
const RESPONSE = { posts: [], nextToken: "NEW_NEXT_TOKEN" };
const EVENT = generateEvent(INPUT);

describe("listPostCommentsHandler", () => {
  beforeEach(() => {
    (listComments as jest.Mock).mockResolvedValue(RESPONSE);
  });

  it("lists the post's comments", async () => {
    expect.assertions(1);

    await listPostCommentsHandler(USER_ID, EVENT);

    expect(listComments).toHaveBeenCalledWith(INPUT);
  });

  it("returns the friends from the list call", async () => {
    expect.assertions(1);

    await expect(listPostCommentsHandler(USER_ID, EVENT)).resolves.toEqual(
      RESPONSE
    );
  });
});
