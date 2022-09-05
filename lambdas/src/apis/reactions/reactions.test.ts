import { RefType } from "wordle-friends-graphql";
import { getReactions } from "../../tables/reactions";
import { USER_ID } from "../../tests/constants";
import { generateEvent } from "../../tests/fixtures/events";
import { generatePost } from "../../tests/fixtures/posts";
import { reactionsHandler } from "./reactions";

jest.mock("../../tables/reactions", () => ({
  getReactions: jest.fn(),
}));

const POST = generatePost();
const EVENT = generateEvent({}, POST, { parentTypeName: "Post" });
const REACTIONS = [{ react: "like", userIds: [] }];

const callHandler = () => reactionsHandler(USER_ID, EVENT);

describe("reactionsHandler", () => {
  beforeEach(() => {
    (getReactions as jest.Mock).mockResolvedValue(REACTIONS);
  });

  it("gets reactions for the ref", async () => {
    expect.assertions(1);

    await callHandler();

    expect(getReactions).toHaveBeenCalledWith({
      refType: RefType.Post,
      refId: POST.id,
    });
  });

  it("returns the ref's reactions", async () => {
    expect.assertions(1);

    await expect(callHandler()).resolves.toEqual(REACTIONS);
  });
});
