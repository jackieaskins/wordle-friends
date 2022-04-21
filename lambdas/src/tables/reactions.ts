import { Reaction, ReactionInput, RefType } from "wordle-friends-graphql";
import { get, update } from "../clients/dynamo";
import { REACTIONS_TABLE } from "../constants";

export type SimpleReaction = Omit<Reaction, "__typename">;
type DynamoReaction = {
  [key: string]: Set<string>;
} & {
  id: string;
  refId: string;
  refType: RefType;
};
type ReactionKey = {
  refType: RefType;
  refId: string;
};

function generateId(refType: string, refId: string): string {
  return `${refType}:${refId}`;
}

export async function createReaction({
  refType,
  refId,
  userId,
  react,
}: ReactionInput & { userId: string }): Promise<SimpleReaction> {
  const response = await update({
    Key: { id: generateId(refType, refId) },
    TableName: REACTIONS_TABLE,
    ReturnValues: "UPDATED_NEW",
    UpdateExpression:
      "SET refType = :refType, refId = :refId ADD #react :react",
    ExpressionAttributeNames: { "#react": react },
    ExpressionAttributeValues: {
      ":refType": refType,
      ":refId": refId,
      ":react": new Set([userId]),
    },
  });

  const { [react]: userIds } = response;
  return { react, userIds: Array.from(userIds) };
}

export async function deleteReaction({
  refType,
  refId,
  userId,
  react,
}: ReactionInput & { userId: string }): Promise<SimpleReaction> {
  const { [react]: userIds } = await update({
    Key: { id: generateId(refType, refId) },
    TableName: REACTIONS_TABLE,
    ReturnValues: "UPDATED_NEW",
    UpdateExpression: "DELETE #react :react",
    ExpressionAttributeNames: { "#react": react },
    ExpressionAttributeValues: { ":react": new Set([userId]) },
  });

  return { react, userIds: Array.from(userIds ?? []) };
}

export async function getReactions({
  refType,
  refId,
}: ReactionKey): Promise<SimpleReaction[]> {
  const response = await get<{ id: string }, DynamoReaction>({
    Key: { id: generateId(refType, refId) },
    TableName: REACTIONS_TABLE,
  });

  if (!response) {
    return [];
  }

  const { id: _id, refId: _refId, refType: _refType, ...reactions } = response;

  return Object.entries(reactions).map(([react, userIds]) => ({
    userIds: Array.from(userIds),
    react,
  }));
}
