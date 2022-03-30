import { FriendStatus } from "wordle-friends-graphql";
import { getUser } from "../clients/cognito";
import { listFriends } from "../tables/friends";
import { batchGetPosts, getPost } from "../tables/posts";
import {
  AUTHORIZATION,
  FRIEND_ID,
  PUZZLE_DATE,
  USER_ID,
} from "../tests/constants";
import { generateEvent } from "../tests/fixtures/events";
import { generateFriend } from "../tests/fixtures/friends";
import { generatePartialPost, generatePost } from "../tests/fixtures/posts";
import { listPostsHandler } from "./listPosts";

jest.mock("../clients/cognito", () => ({
  getUser: jest.fn(),
}));

jest.mock("../tables/friends", () => ({
  listFriends: jest.fn(),
}));

jest.mock("../tables/posts", () => ({
  batchGetPosts: jest.fn(),
  getPost: jest.fn(),
}));

const POST = generatePost();

const mockGetUser = getUser as jest.Mock;
const mockListFriends = listFriends as jest.Mock;
const mockBatchGetPosts = batchGetPosts as jest.Mock;
const mockGetPost = getPost as jest.Mock;

describe("listsPostsHandler", () => {
  let nextToken: string | null;
  let limit: number | null;

  const callHandler = () =>
    listPostsHandler(
      USER_ID,
      generateEvent({ puzzleDate: PUZZLE_DATE, limit, nextToken })
    );

  beforeEach(() => {
    nextToken = null;
    limit = null;

    mockGetUser.mockResolvedValue({});
    mockListFriends.mockResolvedValue({ nextToken: null, friends: [] });
    mockBatchGetPosts.mockResolvedValue([]);
    mockGetPost.mockResolvedValue(undefined);
  });

  describe("call params", () => {
    it("passes current user and puzzle date to getPost", async () => {
      expect.assertions(1);

      await callHandler();

      expect(mockGetPost).toHaveBeenCalledWith({
        userId: USER_ID,
        puzzleDate: PUZZLE_DATE,
      });
    });

    it("passes authorization to getUser", async () => {
      expect.assertions(1);

      await callHandler();

      expect(mockGetUser).toHaveBeenCalledWith(AUTHORIZATION);
    });

    it("passes current user, limit, next token, and accepted status to listFriends", async () => {
      expect.assertions(1);

      limit = 25;
      nextToken = "nextToken";
      await callHandler();

      expect(mockListFriends).toHaveBeenCalledWith({
        userId: USER_ID,
        limit,
        nextToken,
        status: FriendStatus.ACCEPTED,
      });
    });

    it("passes puzzle date and friend ids to batchGetPosts", async () => {
      expect.assertions(1);

      mockListFriends.mockResolvedValue({
        nextToken: null,
        friends: [generateFriend(), generateFriend({ friendId: "friend2" })],
      });

      await callHandler();

      expect(mockBatchGetPosts).toHaveBeenCalledWith({
        userIds: [FRIEND_ID, "friend2"],
        puzzleDate: PUZZLE_DATE,
      });
    });
  });

  describe("on first request", () => {
    describe("if has posted", () => {
      beforeEach(() => {
        mockGetPost.mockResolvedValue(POST);
      });

      describe("if requesting 1 post", () => {
        beforeEach(() => {
          limit = 1;
        });

        it("returns the current user's post", async () => {
          expect.assertions(1);

          await expect(callHandler()).resolves.toEqual(
            expect.objectContaining({
              posts: [POST],
            })
          );
        });

        it("returns the one limit next token", async () => {
          expect.assertions(1);

          await expect(callHandler()).resolves.toEqual(
            expect.objectContaining({
              nextToken: "START",
            })
          );
        });
      });

      it("gets one less than the max number of friends if no limit provided", async () => {
        expect.assertions(1);

        await callHandler();

        expect(mockListFriends.mock.calls[0][0].limit).toBe(99);
      });

      it("gets one less than the requested number of posts", async () => {
        expect.assertions(1);

        limit = 25;
        await callHandler();

        expect(mockListFriends.mock.calls[0][0].limit).toBe(24);
      });

      it("returns the current user's post and friend posts", async () => {
        expect.assertions(1);

        const friendPosts = [
          generatePost({ userId: "1" }),
          generatePost({ userId: "2" }),
        ];

        mockGetPost.mockResolvedValue(POST);
        mockBatchGetPosts.mockResolvedValue(friendPosts);

        await expect(callHandler()).resolves.toEqual(
          expect.objectContaining({ posts: [POST, ...friendPosts] })
        );
      });

      it("returns the new next token", async () => {
        expect.assertions(1);

        mockListFriends.mockResolvedValue({
          nextToken: "newNextToken",
          friends: [],
        });

        await expect(callHandler()).resolves.toEqual(
          expect.objectContaining({ nextToken: "newNextToken" })
        );
      });
    });

    describe("if has not posted", () => {
      it("only returns friends posts", async () => {
        expect.assertions(1);

        mockBatchGetPosts.mockResolvedValue([
          generatePost({ userId: FRIEND_ID }),
        ]);

        await expect(callHandler()).resolves.toEqual(
          expect.objectContaining({
            posts: [generatePartialPost({ userId: FRIEND_ID })],
          })
        );
      });

      it("gets the requested number of posts", async () => {
        expect.assertions(1);

        limit = 25;
        await callHandler();

        expect(mockListFriends.mock.calls[0][0].limit).toBe(25);
      });

      it("returns the new next token", async () => {
        expect.assertions(1);

        mockListFriends.mockResolvedValue({
          nextToken: "newNextToken",
          friends: [],
        });

        await expect(callHandler()).resolves.toEqual(
          expect.objectContaining({ nextToken: "newNextToken" })
        );
      });
    });
  });

  describe("on subsequent request", () => {
    beforeEach(() => {
      nextToken = "nextToken";
    });

    it("does not return the current user's post if posted", async () => {
      expect.assertions(1);

      mockGetPost.mockResolvedValue(POST);

      await expect(callHandler()).resolves.toEqual(
        expect.objectContaining({ posts: [] })
      );
    });

    it("does not return the current user's post if has not posted", async () => {
      expect.assertions(1);

      await expect(callHandler()).resolves.toEqual(
        expect.objectContaining({ posts: [] })
      );
    });

    it("gets the requested number of posts", async () => {
      expect.assertions(1);

      limit = 25;
      await callHandler();

      expect(mockListFriends.mock.calls[0][0].limit).toBe(25);
    });

    it("returns the new next token", async () => {
      expect.assertions(1);

      mockListFriends.mockResolvedValue({
        nextToken: "newNextToken",
        friends: [],
      });

      await expect(callHandler()).resolves.toEqual(
        expect.objectContaining({ nextToken: "newNextToken" })
      );
    });
  });
});
