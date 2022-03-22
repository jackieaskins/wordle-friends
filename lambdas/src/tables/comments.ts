import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import {
  Comment,
  CommentInput,
  ListPostCommentsQueryVariables,
  PaginatedComments,
} from "wordle-friends-graphql";
import { put, query } from "../clients/dynamo";
import { COMMENTS_TABLE, POST_ID_CREATED_AT_INDEX } from "../constants";

export type SimpleComment = Omit<Comment, "__typename" | "user">;
export type SimplePaginatedComments = Omit<
  PaginatedComments,
  "__typename" | "comments"
> & { comments: SimpleComment[] };

function generateId(): string {
  return nanoid();
}

function generateComment(
  input: CommentInput & { userId: string },
  createdAt: string
): SimpleComment {
  return {
    ...input,
    createdAt,
    updatedAt: createdAt,
    id: generateId(),
  };
}

export async function createComment(
  input: CommentInput & { userId: string }
): Promise<SimpleComment> {
  const createdAt = dayjs().toISOString();
  let hasCollision = false;

  let comment = generateComment(input, createdAt);
  do {
    try {
      return await put<SimpleComment>({
        Item: comment,
        TableName: COMMENTS_TABLE,
        ConditionExpression: "attribute_not_exists(id)",
      });
    } catch (e) {
      if (e instanceof ConditionalCheckFailedException) {
        comment = generateComment(input, createdAt);
        hasCollision = true;
      } else {
        throw e;
      }
    }
  } while (hasCollision);

  return comment;
}

export async function listComments({
  postId,
  limit,
  nextToken,
}: ListPostCommentsQueryVariables): Promise<SimplePaginatedComments> {
  const { items: comments, nextToken: newNextToken } =
    await query<SimpleComment>(
      {
        TableName: COMMENTS_TABLE,
        IndexName: POST_ID_CREATED_AT_INDEX,
        KeyConditionExpression: "postId = :postId",
        ExpressionAttributeValues: { ":postId": postId },
      },
      limit,
      nextToken
    );

  return { comments, nextToken: newNextToken };
}
