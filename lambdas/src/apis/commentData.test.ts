import { listComments } from "../tables/comments";
import { getPost } from "../tables/posts";
import { USER_ID } from "../tests/constants";
import { generateComment } from "../tests/fixtures/comments";
import { generateEvent } from "../tests/fixtures/events";
import { generatePost } from "../tests/fixtures/posts";
import { commentDataHandler } from "./commentData";

jest.mock("../tables/posts", () => ({
  getPost: jest.fn(),
}));

jest.mock("../tables/comments", () => ({
  listComments: jest.fn(),
}));

const sourcePost = generatePost({ userId: "123" });
const comments = [generateComment(), generateComment()];

const callHandler = () =>
  commentDataHandler(USER_ID, generateEvent({}, sourcePost));

describe("commentDataHandler", () => {
  beforeEach(() => {
    (getPost as jest.Mock).mockResolvedValue(generatePost());
    (listComments as jest.Mock).mockResolvedValue({
      nextToken: "nextToken",
      comments,
    });
  });

  it("loads the current user's post for the puzzleDate", async () => {
    expect.assertions(1);

    await callHandler();

    expect(getPost).toHaveBeenCalledWith({
      puzzleDate: sourcePost.puzzleDate,
      userId: USER_ID,
    });
  });

  it("returns empty comments and null nextToken if user has not posted", async () => {
    expect.assertions(1);

    (getPost as jest.Mock).mockResolvedValue(undefined);

    await expect(callHandler()).resolves.toEqual({
      nextToken: null,
      comments: [],
    });
  });

  it("loads comment for the source post", async () => {
    expect.assertions(1);

    await callHandler();

    expect(listComments).toHaveBeenCalledWith({ postId: sourcePost.id });
  });

  it("returns comments if the user has posted", async () => {
    expect.assertions(1);

    await expect(callHandler()).resolves.toEqual({
      nextToken: "nextToken",
      comments,
    });
  });
});
