import { FriendStatus } from "wordle-friends-graphql";
import { query, transactWrite } from "../clients/dynamo";
import {
  acceptFriendRequest,
  deleteFriend,
  listFriends,
  sendFriendRequest,
} from "./friends";

const USER_ID = "from";
const FRIEND_ID = "to";
const USER_KEY = { userId: USER_ID, friendId: FRIEND_ID };
const FRIEND_KEY = { userId: FRIEND_ID, friendId: USER_ID };

jest.mock("../constants", () => ({
  FRIENDS_TABLE: "FRIENDS_TABLE",
  USER_ID_STATUS_INDEX: "USER_ID_STATUS_INDEX",
}));

jest.mock("../clients/dynamo", () => ({
  query: jest.fn().mockReturnValue({ items: [], nextToken: "nextToken" }),
  transactWrite: jest.fn(),
}));

describe("friendsTable", () => {
  describe("sendFriendRequest", () => {
    it("sends a transact write request for requester and recipient", async () => {
      expect.assertions(1);

      await sendFriendRequest(USER_KEY);

      expect(transactWrite).toHaveBeenCalledWith({
        TransactItems: [
          {
            Put: {
              TableName: "FRIENDS_TABLE",
              Item: {
                id: `${USER_ID}:${FRIEND_ID}`,
                userId: USER_ID,
                friendId: FRIEND_ID,
                status: FriendStatus.SENT,
              },
              ConditionExpression: "attribute_not_exists(userId)",
            },
          },
          {
            Put: {
              TableName: "FRIENDS_TABLE",
              Item: {
                id: `${FRIEND_ID}:${USER_ID}`,
                userId: FRIEND_ID,
                friendId: USER_ID,
                status: FriendStatus.RECEIVED,
              },
              ConditionExpression: "attribute_not_exists(userId)",
            },
          },
        ],
      });
    });

    it("returns the sent user request", async () => {
      expect.assertions(1);

      await expect(sendFriendRequest(USER_KEY)).resolves.toEqual({
        ...USER_KEY,
        id: `${USER_ID}:${FRIEND_ID}`,
        status: FriendStatus.SENT,
      });
    });
  });

  describe("acceptFriendRequest", () => {
    it("sends a transact write request for requester and recipient", async () => {
      expect.assertions(1);

      await acceptFriendRequest(USER_KEY);

      expect(transactWrite).toHaveBeenCalledWith({
        TransactItems: [
          {
            Update: {
              TableName: "FRIENDS_TABLE",
              Key: USER_KEY,
              UpdateExpression: "SET #status = :status",
              ExpressionAttributeNames: { "#status": "status" },
              ExpressionAttributeValues: { ":status": FriendStatus.ACCEPTED },
            },
          },
          {
            Update: {
              TableName: "FRIENDS_TABLE",
              Key: FRIEND_KEY,
              UpdateExpression: "SET #status = :status",
              ExpressionAttributeNames: { "#status": "status" },
              ExpressionAttributeValues: { ":status": FriendStatus.ACCEPTED },
            },
          },
        ],
      });
    });

    it("returns the accepting user request", async () => {
      expect.assertions(1);

      await expect(acceptFriendRequest(USER_KEY)).resolves.toEqual({
        ...USER_KEY,
        id: `${USER_ID}:${FRIEND_ID}`,
        status: FriendStatus.ACCEPTED,
      });
    });
  });

  describe("deleteFriend", () => {
    it("sends a transact write request for both users", async () => {
      expect.assertions(1);

      await deleteFriend(USER_KEY);

      expect(transactWrite).toHaveBeenCalledWith({
        TransactItems: [
          { Delete: { TableName: "FRIENDS_TABLE", Key: USER_KEY } },
          { Delete: { TableName: "FRIENDS_TABLE", Key: FRIEND_KEY } },
        ],
      });
    });
  });

  describe("listFriends", () => {
    it("queries table for friends with provided status", async () => {
      expect.assertions(1);

      await listFriends({ ...USER_KEY, status: FriendStatus.ACCEPTED });

      expect(query).toHaveBeenCalledWith(
        {
          TableName: "FRIENDS_TABLE",
          IndexName: "USER_ID_STATUS_INDEX",
          KeyConditionExpression: "userId = :userId and #status = :status",
          ExpressionAttributeNames: { "#status": "status" },
          ExpressionAttributeValues: {
            ":userId": USER_ID,
            ":status": FriendStatus.ACCEPTED,
          },
        },
        undefined,
        undefined
      );
    });

    it("queries table for all friends if no status", async () => {
      expect.assertions(1);

      await listFriends(USER_KEY);

      expect(query).toHaveBeenCalledWith(
        {
          TableName: "FRIENDS_TABLE",
          IndexName: "USER_ID_STATUS_INDEX",
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeNames: undefined,
          ExpressionAttributeValues: { ":userId": USER_ID },
        },
        undefined,
        undefined
      );
    });

    it("queries table with provided limit and nextToken", async () => {
      expect.assertions(1);

      await listFriends({ ...USER_KEY, limit: 10, nextToken: "nextToken" });

      expect(query).toHaveBeenCalledWith(expect.anything(), 10, "nextToken");
    });

    it("returns query's friends and nextToken", async () => {
      expect.assertions(1);

      await expect(listFriends({ ...USER_KEY })).resolves.toEqual({
        friends: [],
        nextToken: "nextToken",
      });
    });
  });
});
