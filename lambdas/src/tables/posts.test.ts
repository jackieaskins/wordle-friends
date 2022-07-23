import { Color } from "wordle-friends-graphql";
import { batchGet, get, put, query } from "../clients/dynamo";
import { ISO_STRING, PUZZLE_DATE, TIMESTAMPS } from "../tests/constants";
import {
  batchGetPosts,
  createPost,
  getPost,
  getPostById,
  queryPosts,
  SimplePost,
  updatePost,
} from "./posts";

jest.mock("../constants", () => ({
  POSTS_TABLE: "POSTS_TABLE",
}));

jest.mock("../clients/dynamo", () => ({
  MAX_LIMIT: 100,
  batchGet: jest.fn(),
  get: jest.fn(),
  put: jest.fn(({ Item: item }) => item),
  query: jest.fn(),
}));

jest.mock("dayjs", () => ({
  __esModule: true,
  default: () => ({
    toISOString: jest.fn().mockReturnValueOnce(ISO_STRING),
  }),
}));

const POST_INPUT = {
  colors: [[Color.GREEN, Color.GREEN, Color.GREEN, Color.GREEN, Color.GREEN]],
  isHardMode: true,
  puzzleDate: PUZZLE_DATE,
  message: "Hello!",
  guesses: ["stare"],
  userId: "123",
};

const POST: SimplePost = {
  ...POST_INPUT,
  ...TIMESTAMPS,
  id: `123:${PUZZLE_DATE}`,
};

describe("postsTable", () => {
  describe("createPost", () => {
    it("puts a post in the table", async () => {
      expect.assertions(1);

      await createPost(POST_INPUT);

      expect(put).toHaveBeenCalledWith({
        TableName: "POSTS_TABLE",
        Item: POST,
        ConditionExpression: "attribute_not_exists(userId)",
      });
    });

    it("returns the result of the put", async () => {
      expect.assertions(1);

      await expect(createPost(POST_INPUT)).resolves.toEqual(POST);
    });
  });

  describe("updatePost", () => {
    it("puts a post in the table", async () => {
      expect.assertions(1);

      const post = {
        ...POST,
        createdAt: "123",
        updatedAt: "123",
      };

      await updatePost(post);

      expect(put).toHaveBeenCalledWith({
        TableName: "POSTS_TABLE",
        Item: { ...post, updatedAt: ISO_STRING },
        ConditionExpression: "attribute_exists(userId)",
      });
    });

    it("returns the result of the put", async () => {
      expect.assertions(1);

      await expect(updatePost(POST)).resolves.toEqual(POST);
    });
  });

  describe("getPostById", () => {
    const postKey = { userId: "userId", puzzleDate: PUZZLE_DATE };
    const postId = `userId:${PUZZLE_DATE}`;

    beforeEach(() => {
      (get as jest.Mock).mockResolvedValue(POST);
    });

    it("gets the post from the table", async () => {
      expect.assertions(1);

      await getPostById(postId);

      expect(get).toHaveBeenCalledWith({
        TableName: "POSTS_TABLE",
        Key: postKey,
      });
    });

    it("returns the element returned from the table", async () => {
      expect.assertions(1);

      await expect(getPostById(postId)).resolves.toEqual(POST);
    });
  });

  describe("getPost", () => {
    const postKey = { userId: "userId", puzzleDate: PUZZLE_DATE };
    beforeEach(() => {
      (get as jest.Mock).mockResolvedValue(POST);
    });

    it("gets the post from the table", async () => {
      expect.assertions(1);

      await getPost(postKey);

      expect(get).toHaveBeenCalledWith({
        TableName: "POSTS_TABLE",
        Key: postKey,
      });
    });

    it("returns the element returned from the table", async () => {
      expect.assertions(1);

      await expect(getPost(postKey)).resolves.toEqual(POST);
    });
  });

  describe("batchGetPosts", () => {
    beforeEach(() => {
      (batchGet as jest.Mock).mockResolvedValue({ POSTS_TABLE: [POST] });
    });

    it("returns an empty array of no user ids", async () => {
      expect.assertions(1);

      await expect(
        batchGetPosts({ userIds: [], puzzleDate: PUZZLE_DATE })
      ).resolves.toEqual([]);
    });

    it("sends a batch get request to the table", async () => {
      expect.assertions(1);

      const userId = "123";

      await batchGetPosts({ userIds: [userId], puzzleDate: PUZZLE_DATE });

      expect(batchGet).toHaveBeenCalledWith({
        RequestItems: {
          POSTS_TABLE: { Keys: [{ userId, puzzleDate: PUZZLE_DATE }] },
        },
      });
    });

    it("returns the posts returned from the batch get request", async () => {
      expect.assertions(1);

      await expect(
        batchGetPosts({ userIds: ["123"], puzzleDate: PUZZLE_DATE })
      ).resolves.toEqual([POST]);
    });
  });

  describe("queryPosts", () => {
    beforeEach(() => {
      (query as jest.Mock).mockResolvedValue({
        nextToken: "nextToken",
        items: [POST],
      });
    });

    it("queries the posts table", async () => {
      expect.assertions(1);

      await queryPosts("123", "start", "end", "nextToken");

      expect(query).toHaveBeenCalledWith(
        expect.objectContaining({
          TableName: "POSTS_TABLE",
        }),
        100,
        "nextToken"
      );
    });

    it("queries between start and end if both provided", async () => {
      expect.assertions(1);

      await queryPosts("123", "start", "end", null);

      expect((query as jest.Mock).mock.calls[0][0]).toEqual(
        expect.objectContaining({
          KeyConditionExpression:
            "userId = :userId and puzzleDate BETWEEN :startDate AND :endDate",
          ExpressionAttributeValues: {
            ":userId": "123",
            ":startDate": "start",
            ":endDate": "end",
          },
        })
      );
    });

    it("queries after start if only start date is provided", async () => {
      expect.assertions(1);

      await queryPosts("123", "start", null, null);

      expect((query as jest.Mock).mock.calls[0][0]).toEqual(
        expect.objectContaining({
          KeyConditionExpression:
            "userId = :userId and puzzleDate >= :startDate",
          ExpressionAttributeValues: {
            ":userId": "123",
            ":startDate": "start",
          },
        })
      );
    });

    it("queries before end if only end date is provided", async () => {
      expect.assertions(1);

      await queryPosts("123", null, "end", null);

      expect((query as jest.Mock).mock.calls[0][0]).toEqual(
        expect.objectContaining({
          KeyConditionExpression: "userId = :userId and puzzleDate <= :endDate",
          ExpressionAttributeValues: {
            ":userId": "123",
            ":endDate": "end",
          },
        })
      );
    });

    it("queries without dates if none provided", async () => {
      expect.assertions(1);

      await queryPosts("123", null, null, null);

      expect((query as jest.Mock).mock.calls[0][0]).toEqual(
        expect.objectContaining({
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: { ":userId": "123" },
        })
      );
    });

    it("returns the posts returned from the query request", async () => {
      expect.assertions(1);

      await expect(queryPosts("123", "start", "end", null)).resolves.toEqual({
        posts: [POST],
        nextToken: "nextToken",
      });
    });
  });
});
