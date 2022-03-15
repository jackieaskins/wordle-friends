import { CommentInput } from "wordle-friends-graphql";
import { createComment, SimpleComment } from "../tables/comments";
import { generateEvent, PUZZLE_DATE, TIMESTAMPS } from "../testUtils";
import { createCommentHandler } from "./createComment";

const USER_ID = "123";
const COMMENT_INPUT: CommentInput = {
  text: "Comment text",
  postId: `${USER_ID}:${PUZZLE_DATE}`,
};
const COMMENT: SimpleComment = {
  ...COMMENT_INPUT,
  id: "1",
  userId: USER_ID,
  ...TIMESTAMPS,
};
const EVENT = generateEvent({ input: COMMENT_INPUT });

jest.mock("../tables/comments", () => ({
  createComment: jest.fn(),
}));

describe("createCommentHandler", () => {
  beforeEach(() => {
    (createComment as jest.Mock).mockResolvedValue(COMMENT);
  });

  it("creates a comment in the comments table", async () => {
    expect.assertions(1);

    await createCommentHandler(USER_ID, EVENT);

    expect(createComment).toHaveBeenCalledWith({
      ...COMMENT_INPUT,
      userId: USER_ID,
    });
  });

  it("returns the created comment", async () => {
    expect.assertions(1);

    await expect(createCommentHandler(USER_ID, EVENT)).resolves.toEqual(
      COMMENT
    );
  });
});
