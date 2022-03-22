import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchGetCommand,
  BatchGetCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  TransactWriteCommand,
  TransactWriteCommandInput,
  TransactWriteCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { REGION } from "../constants";

const MAX_LIMIT = 100;

const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION }),
  {
    marshallOptions: { removeUndefinedValues: true },
  }
);

type PaginatedResults<T> = {
  items: T[];
  nextToken: string | null;
};

export async function get<I, O extends { [key: string]: any }>(
  input: Omit<GetCommandInput, "Key"> & { Key: I }
): Promise<O | undefined> {
  const { Item: item } = await docClient.send(new GetCommand(input));
  return item as O | undefined;
}

export async function batchGet<T>(
  input: BatchGetCommandInput
): Promise<Record<string, T[]>> {
  const { Responses: responses } = await docClient.send(
    new BatchGetCommand(input)
  );
  return (responses ?? {}) as Record<string, T[]>;
}

export async function query<T>(
  input: Omit<QueryCommandInput, "Limit" | "ExclusiveStartKey">,
  limit: number | null | undefined,
  nextToken: string | null | undefined
): Promise<PaginatedResults<T>> {
  if (limit != null && (limit === 0 || limit > MAX_LIMIT)) {
    throw new Error("limit must be > 0 and <= 100");
  }

  const { Items: items, LastEvaluatedKey: lastEvaluatedKey } =
    await docClient.send(
      new QueryCommand({
        ...input,
        Limit: limit ?? MAX_LIMIT,
        ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
      })
    );

  return {
    items: (items ?? []) as T[],
    nextToken: lastEvaluatedKey ? JSON.stringify(lastEvaluatedKey) : null,
  };
}

export async function transactWrite(
  input: TransactWriteCommandInput
): Promise<TransactWriteCommandOutput> {
  return await docClient.send(new TransactWriteCommand(input));
}

export async function put<T>(
  input: Omit<PutCommandInput, "Item"> & { Item: T }
): Promise<T> {
  await docClient.send(new PutCommand(input));
  return input.Item;
}
