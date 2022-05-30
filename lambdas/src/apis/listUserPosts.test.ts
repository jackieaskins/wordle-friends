import { ListUserPostsQueryVariables } from "wordle-friends-graphql";
import { queryPosts } from "../tables/posts";
import { USER_ID } from "../tests/constants";
import { generateEvent } from "../tests/fixtures/events";
import { listUserPostsHandler } from "./listUserPosts";

jest.mock("../tables/posts", () => ({
  queryPosts: jest.fn(),
}));

const INPUT = {
  startDate: "start",
  endDate: "end",
  nextToken: "NEXT_TOKEN",
};
const RESPONSE = { posts: [], nextToken: "NEW_NEXT_TOKEN" };
const EVENT = generateEvent<ListUserPostsQueryVariables>(INPUT);

describe("listUserPostsHandler", () => {
  beforeEach(() => {
    (queryPosts as jest.Mock).mockResolvedValue(RESPONSE);
  });

  it("lists the current user's posts", async () => {
    expect.assertions(1);

    await listUserPostsHandler(USER_ID, EVENT);

    expect(queryPosts).toHaveBeenCalledWith(
      USER_ID,
      "start",
      "end",
      "NEXT_TOKEN"
    );
  });

  it("returns the posts from the query call", async () => {
    expect.assertions(1);

    await expect(listUserPostsHandler(USER_ID, EVENT)).resolves.toEqual(
      RESPONSE
    );
  });
});
