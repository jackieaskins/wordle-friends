import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { nanoid } from "nanoid";
import { put, query, queryAll } from "../clients/dynamo";
import { ISO_STRING, TIMESTAMPS } from "../testUtils";
import { createComment, listAllComments, listComments } from "./comments";

jest.mock("dayjs", () => ({
  __esModule: true,
  default: () => ({
    toISOString: jest.fn().mockReturnValueOnce(ISO_STRING),
  }),
}));

const ID_1 = "1";
const ID_2 = "2";
jest.mock("nanoid", () => ({
  nanoid: jest.fn(),
}));

jest.mock("../clients/dynamo", () => ({
  put: jest.fn(),
  query: jest.fn(),
  queryAll: jest.fn().mockResolvedValue([]),
}));

jest.mock("../constants", () => ({
  COMMENTS_TABLE: "COMMENTS_TABLE",
  POST_ID_CREATED_AT_INDEX: "POST_ID_CREATED_AT_INDEX",
}));

describe("commentsTable", () => {
  describe("createComment", () => {
    const commentInput = {
      text: "Text",
      postId: "123",
      userId: "123",
    };

    function assertPutInput(id: string = ID_1) {
      expect(put).toHaveBeenCalledWith({
        Item: {
          ...commentInput,
          ...TIMESTAMPS,
          id,
        },
        TableName: "COMMENTS_TABLE",
        ConditionExpression: "attribute_not_exists(id)",
      });
    }

    beforeEach(() => {
      (put as jest.Mock).mockImplementation(({ Item: item }) => item);
      (nanoid as jest.Mock).mockReturnValueOnce(ID_1).mockReturnValueOnce(ID_2);
    });

    it("puts an element in the table", async () => {
      expect.assertions(1);

      await createComment(commentInput);

      assertPutInput();
    });

    it("retries adding if an item with id already exists", async () => {
      expect.assertions(2);

      (put as jest.Mock).mockRejectedValueOnce(
        new ConditionalCheckFailedException(new Error("Error") as any)
      );

      await createComment(commentInput);

      assertPutInput(ID_1);
      assertPutInput(ID_2);
    });

    it("throws an error if put call throws non-conditional check failed exception", async () => {
      expect.assertions(1);

      const error = new Error("Error!");
      (put as jest.Mock).mockRejectedValue(error);

      await expect(createComment(commentInput)).rejects.toEqual(error);
    });

    it("returns the created comment", async () => {
      expect.assertions(1);

      await expect(createComment(commentInput)).resolves.toEqual({
        ...commentInput,
        id: ID_1,
        createdAt: ISO_STRING,
        updatedAt: ISO_STRING,
      });
    });
  });

  describe("listAllComments", () => {
    it("queries the table index", async () => {
      expect.assertions(1);

      await listAllComments({ postId: "1" });

      expect(queryAll).toHaveBeenCalledWith({
        TableName: "COMMENTS_TABLE",
        IndexName: "POST_ID_CREATED_AT_INDEX",
        KeyConditionExpression: "postId = :postId",
        ExpressionAttributeValues: { ":postId": "1" },
      });
    });

    it("returns comments and nextToken", async () => {
      expect.assertions(1);

      await expect(listAllComments({ postId: "1" })).resolves.toEqual([]);
    });
  });

  describe("listComments", () => {
    const nextToken = "nextToken";
    const items: never[] = [];

    beforeEach(() => {
      (query as jest.Mock).mockResolvedValue({ items, nextToken });
    });

    it("queries the table index", async () => {
      expect.assertions(1);

      await listComments({ postId: "1", limit: 1, nextToken: undefined });

      expect(query).toHaveBeenCalledWith(
        {
          TableName: "COMMENTS_TABLE",
          IndexName: "POST_ID_CREATED_AT_INDEX",
          KeyConditionExpression: "postId = :postId",
          ExpressionAttributeValues: { ":postId": "1" },
        },
        1,
        undefined
      );
    });

    it("returns comments and nextToken", async () => {
      expect.assertions(1);

      await expect(listComments({ postId: "1" })).resolves.toEqual({
        comments: [],
        nextToken,
      });
    });
  });
});
