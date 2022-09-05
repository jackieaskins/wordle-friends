import { updatePostHandler } from "./updatePost";
import { generateEvent } from "../../tests/fixtures/events";
import { generatePost } from "../../tests/fixtures/posts";
import { updatePost } from "../../tables/posts";

jest.mock("../../tables/posts", () => ({
  updatePost: jest.fn(),
}));

const POST = generatePost();
const EVENT = generateEvent({ input: POST });

describe("updatePostHandler", () => {
  beforeEach(() => {
    jest.mocked(updatePost).mockResolvedValue(POST);
  });

  it("updates a post in the posts table", async () => {
    expect.assertions(1);

    await updatePostHandler("", EVENT);

    expect(updatePost).toHaveBeenCalledWith(POST);
  });

  it("returns the updated post", async () => {
    expect.assertions(1);

    await expect(updatePostHandler("", EVENT)).resolves.toEqual(POST);
  });
});
