import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchGetCommand,
  BatchGetCommandInput,
  BatchGetCommandOutput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  TransactWriteCommand,
  TransactWriteCommandInput,
  TransactWriteCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { REGION } from "./constants";

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});

export async function get(input: GetCommandInput): Promise<GetCommandOutput> {
  return await client.send(new GetCommand(input));
}

export async function batchGet(
  input: BatchGetCommandInput
): Promise<BatchGetCommandOutput> {
  return await client.send(new BatchGetCommand(input));
}

export async function query(
  input: QueryCommandInput
): Promise<QueryCommandOutput> {
  return await client.send(new QueryCommand(input));
}

export async function transactWrite(
  input: TransactWriteCommandInput
): Promise<TransactWriteCommandOutput> {
  return await client.send(new TransactWriteCommand(input));
}

export async function put(input: PutCommandInput): Promise<PutCommandOutput> {
  return await docClient.send(new PutCommand(input));
}
