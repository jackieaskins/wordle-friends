import { RefType } from "wordle-friends-graphql";
import { createReaction } from "../../tables/reactions";
import { USER_ID } from "../../tests/constants";
import { generateEvent } from "../../tests/fixtures/events";
import { createReactionHandler } from "./createReaction";

jest.mock("../../tables/reactions", () => ({
  createReaction: jest.fn(),
}));

const REACTION = {
  react: "like",
  userIds: ["1", "2", "3"],
};
const REACTION_INPUT = {
  refId: "refId",
  refType: RefType.Post,
  react: "like",
};
const EVENT = generateEvent({
  input: REACTION_INPUT,
});

const callHandler = () => createReactionHandler(USER_ID, EVENT);

describe("createReactionHandler", () => {
  beforeEach(() => {
    (createReaction as jest.Mock).mockResolvedValue(REACTION);
  });

  it("creates a reaction in the reactions table", async () => {
    expect.assertions(1);

    await callHandler();

    expect(createReaction).toHaveBeenCalledWith({
      ...REACTION_INPUT,
      userId: USER_ID,
    });
  });

  it("returns the created reaction", async () => {
    expect.assertions(1);

    await expect(callHandler()).resolves.toEqual(REACTION);
  });
});
