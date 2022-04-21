import { RefType } from "wordle-friends-graphql";
import { get, update } from "../clients/dynamo";
import { REACTIONS_TABLE } from "../constants";
import { USER_ID } from "../tests/constants";
import { createReaction, deleteReaction, getReactions } from "./reactions";

jest.mock("../clients/dynamo", () => ({
  get: jest.fn(),
  update: jest.fn(),
}));

const USER_IDS = ["USER1", "USER2"];
const USER_IDS_SET = new Set(USER_IDS);
const POST_ID = "123";
const ID = `Post:${POST_ID}`;
const REACT = "like";
const REACTION_INPUT = {
  refType: RefType.Post,
  refId: POST_ID,
  userId: USER_ID,
  react: REACT,
};

describe("reactionsTable", () => {
  beforeEach(() => {
    (update as jest.Mock).mockResolvedValue({ [REACT]: USER_IDS_SET });
  });

  describe("createReaction", () => {
    it("calls update", async () => {
      expect.assertions(1);

      await createReaction(REACTION_INPUT);

      expect(update).toHaveBeenCalledWith({
        Key: { id: ID },
        TableName: REACTIONS_TABLE,
        ReturnValues: "UPDATED_NEW",
        UpdateExpression:
          "SET refType = :refType, refId = :refId ADD #react :react",
        ExpressionAttributeNames: { "#react": REACT },
        ExpressionAttributeValues: {
          ":refType": "Post",
          ":refId": POST_ID,
          ":react": new Set([USER_ID]),
        },
      });
    });

    it("returns the returned react and user ids", async () => {
      expect.assertions(1);

      await expect(createReaction(REACTION_INPUT)).resolves.toEqual({
        react: REACT,
        userIds: USER_IDS,
      });
    });
  });

  describe("deleteReaction", () => {
    it("calls update", async () => {
      expect.assertions(1);

      await deleteReaction(REACTION_INPUT);

      expect(update).toHaveBeenCalledWith({
        Key: { id: ID },
        TableName: REACTIONS_TABLE,
        ReturnValues: "UPDATED_NEW",
        UpdateExpression: "DELETE #react :react",
        ExpressionAttributeNames: { "#react": REACT },
        ExpressionAttributeValues: { ":react": new Set([USER_ID]) },
      });
    });

    it("returns the returned react and user ids", async () => {
      expect.assertions(1);

      await expect(createReaction(REACTION_INPUT)).resolves.toEqual({
        react: REACT,
        userIds: USER_IDS,
      });
    });
  });

  describe("getReactions", () => {
    const callGetReactions = () =>
      getReactions({ refType: RefType.Post, refId: POST_ID });

    beforeEach(() => {
      (get as jest.Mock).mockResolvedValue({
        id: ID,
        refId: POST_ID,
        refType: RefType.Post,
        like: new Set(["123", "456"]),
        dislike: new Set(["654", "321"]),
      });
    });

    it("gets the reactions for the ref", async () => {
      expect.assertions(1);

      await callGetReactions();

      expect(get).toHaveBeenCalledWith({
        Key: { id: ID },
        TableName: REACTIONS_TABLE,
      });
    });

    it("returns the reactions from the response", async () => {
      expect.assertions(1);

      await expect(callGetReactions()).resolves.toEqual([
        { react: "like", userIds: ["123", "456"] },
        { react: "dislike", userIds: ["654", "321"] },
      ]);
    });

    it("returns an empty array if no response", async () => {
      expect.assertions(1);

      (get as jest.Mock).mockReturnValue(undefined);

      await expect(callGetReactions()).resolves.toEqual([]);
    });
  });
});
