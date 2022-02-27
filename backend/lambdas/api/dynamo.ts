import {
  BatchGetItemCommand,
  BatchGetItemCommandInput,
  BatchGetItemCommandOutput,
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  TransactWriteItemsCommand,
  TransactWriteItemsCommandInput,
  TransactWriteItemsCommandOutput,
} from "@aws-sdk/client-dynamodb";

const dynamo = new DynamoDBClient({ region: process.env.REGION });

export async function query(
  input: QueryCommandInput
): Promise<QueryCommandOutput> {
  return await dynamo.send(new QueryCommand(input));
}

export async function batchGet(
  input: BatchGetItemCommandInput
): Promise<BatchGetItemCommandOutput> {
  return await dynamo.send(new BatchGetItemCommand(input));
}

export async function transactWrite(
  input: TransactWriteItemsCommandInput
): Promise<TransactWriteItemsCommandOutput> {
  return await dynamo.send(new TransactWriteItemsCommand(input));
}
