import { RefType } from "wordle-friends-graphql";
import { deleteReaction } from "../../tables/reactions";
import { USER_ID } from "../../tests/constants";
import { generateEvent } from "../../tests/fixtures/events";
import { deleteReactionHandler } from "./deleteReaction";

jest.mock("../../tables/reactions", () => ({
  deleteReaction: jest.fn(),
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

const callHandler = () => deleteReactionHandler(USER_ID, EVENT);

describe("deleteReactionHandler", () => {
  beforeEach(() => {
    (deleteReaction as jest.Mock).mockResolvedValue(REACTION);
  });

  it("deletes a reaction in the reactions table", async () => {
    expect.assertions(1);

    await callHandler();

    expect(deleteReaction).toHaveBeenCalledWith({
      ...REACTION_INPUT,
      userId: USER_ID,
    });
  });

  it("returns the deleted reaction", async () => {
    expect.assertions(1);

    await expect(callHandler()).resolves.toEqual(REACTION);
  });
});
