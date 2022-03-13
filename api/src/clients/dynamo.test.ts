import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import { batchGet, get, put, query, transactWrite } from "./dynamo";

const docClient = mockClient(DynamoDBDocumentClient);

describe("dynamo", () => {
  beforeEach(() => {
    docClient.reset();
  });

  describe("get", () => {
    const input = { Key: { primary: "key" }, TableName: "table" };
    const outputItem = { key: "hello" };

    beforeEach(() => {
      docClient.on(GetCommand).resolves({ Item: outputItem });
    });

    it("sends dynamo get command request", async () => {
      expect.assertions(1);

      await get(input);

      expect(docClient.commandCalls(GetCommand, input)).toHaveLength(1);
    });

    it("returns item returned from get command", async () => {
      expect.assertions(1);

      await expect(get(input)).resolves.toEqual(outputItem);
    });
  });

  describe("batchGet", () => {
    const items = [{ key: 1 }, { key: 2 }];
    const input = { RequestItems: { table: { Keys: items } } };
    const outputResponses = { table: items };

    beforeEach(() => {
      docClient.on(BatchGetCommand).resolves({ Responses: outputResponses });
    });

    it("sends dynamo batch get command request", async () => {
      expect.assertions(1);

      await batchGet(input);

      expect(docClient.commandCalls(BatchGetCommand, input)).toHaveLength(1);
    });

    it("returns responses if defined", async () => {
      expect.assertions(1);

      await expect(batchGet(input)).resolves.toEqual(outputResponses);
    });

    it("returns an empty object if no responses", async () => {
      expect.assertions(1);

      docClient.on(BatchGetCommand).resolves({});

      await expect(batchGet(input)).resolves.toEqual({});
    });
  });

  describe("query", () => {
    const input = { TableName: "Table" };
    const outputItems = [{ hello: "world" }];
    const nextToken = { next: "token" };
    const nextTokenStr = JSON.stringify(nextToken);

    beforeEach(() => {
      docClient.on(QueryCommand).resolves({
        Items: outputItems,
        LastEvaluatedKey: nextToken,
      });
    });

    it("returns items from query command", async () => {
      expect.assertions(1);

      const response = await query(input, null, null);

      expect(response.items).toEqual(outputItems);
    });

    describe("limit", () => {
      it("throws an error if 0", async () => {
        expect.assertions(1);

        await expect(query(input, 0, null)).rejects.toEqual(
          new Error("limit must be > 0 and <= 100")
        );
      });

      it("throws an error if > 100", async () => {
        expect.assertions(1);

        await expect(query(input, 101, null)).rejects.toEqual(
          new Error("limit must be > 0 and <= 100")
        );
      });

      it("passes 100 as limit if not defined", async () => {
        expect.assertions(1);

        await query(input, null, null);

        expect(
          docClient.commandCalls(QueryCommand, { Limit: 100 })
        ).toHaveLength(1);
      });

      it("passes limit to query if provided", async () => {
        expect.assertions(1);

        await query(input, 50, null);

        expect(
          docClient.commandCalls(QueryCommand, { Limit: 50 })
        ).toHaveLength(1);
      });
    });

    describe("nextToken", () => {
      it("passes undefined ExclusiveStartKey if not provided", async () => {
        expect.assertions(1);

        await query(input, null, null);

        expect(
          docClient.commandCalls(QueryCommand, { ExclusiveStartKey: undefined })
        ).toHaveLength(1);
      });

      it("parses the passed in next token", async () => {
        expect.assertions(1);

        await query(input, null, nextTokenStr);

        expect(
          docClient.commandCalls(QueryCommand, { ExclusiveStartKey: nextToken })
        ).toHaveLength(1);
      });

      it("returns null next token if not returned in result", async () => {
        expect.assertions(1);

        docClient.on(QueryCommand).resolves({ Items: [] });
        const response = await query(input, null, null);

        expect(response.nextToken).toBeNull();
      });

      it("returns stringified last evaluated key if in result", async () => {
        expect.assertions(1);

        const response = await query(input, null, null);

        expect(response.nextToken).toEqual(nextTokenStr);
      });
    });
  });

  describe("transactWrite", () => {
    const input = { TransactItems: [] };
    const transactWriteOutput = { ItemCollectionMetrics: {} };

    beforeEach(() => {
      docClient.on(TransactWriteCommand).resolves(transactWriteOutput);
    });

    it("sends transact write command with input", async () => {
      expect.assertions(1);

      await transactWrite(input);

      expect(docClient.commandCalls(TransactWriteCommand, input)).toHaveLength(
        1
      );
    });

    it("returns response from transact write", async () => {
      expect.assertions(1);

      await expect(transactWrite(input)).resolves.toEqual(transactWriteOutput);
    });
  });

  describe("put", () => {
    const item = { hello: "world" };
    const input = { TableName: "table", Item: item };

    it("sends put command to dynamo with input", async () => {
      expect.assertions(1);

      await put(input);

      expect(docClient.commandCalls(PutCommand, input)).toHaveLength(1);
    });

    it("returns Item from put command input", async () => {
      expect.assertions(1);

      await expect(put(input)).resolves.toEqual(item);
    });
  });
});
