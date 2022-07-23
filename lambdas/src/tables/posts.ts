import dayjs from "dayjs";
import {
  PaginatedPosts,
  Post,
  PostInput,
  UpdatePostInput,
} from "wordle-friends-graphql";
import { batchGet, get, MAX_LIMIT, put, query } from "../clients/dynamo";
import { POSTS_TABLE } from "../constants";

export type PostKey = {
  userId: string;
  puzzleDate: string;
};
export type SimplePost = Omit<
  Post,
  "__typename" | "user" | "commentData" | "reactions"
>;
export type SimplePaginatedPosts = Omit<
  PaginatedPosts,
  "__typename" | "posts"
> & { posts: SimplePost[] };

function generateId(userId: string, puzzleDate: string): string {
  return `${userId}:${puzzleDate}`;
}
function parsePostId(id: string): PostKey {
  const [userId, puzzleDate] = id.split(":");
  return { userId, puzzleDate };
}

export async function createPost(
  input: PostInput & { userId: string }
): Promise<SimplePost> {
  const { userId, puzzleDate } = input;
  const createdAt = dayjs().toISOString();

  return await put<SimplePost>({
    TableName: POSTS_TABLE,
    Item: {
      ...input,
      createdAt,
      updatedAt: createdAt,
      id: generateId(userId, puzzleDate),
    },
    ConditionExpression: "attribute_not_exists(userId)",
  });
}

export async function updatePost(input: UpdatePostInput): Promise<SimplePost> {
  return await put<SimplePost>({
    TableName: POSTS_TABLE,
    Item: { ...input, updatedAt: dayjs().toISOString() },
    ConditionExpression: "attribute_exists(userId)",
  });
}

export async function getPost(key: PostKey): Promise<SimplePost | undefined> {
  return await get<PostKey, SimplePost>({ TableName: POSTS_TABLE, Key: key });
}

export async function getPostById(id: string): Promise<SimplePost | undefined> {
  return await getPost(parsePostId(id));
}

function handleSortKey(
  startDate: string | null | undefined,
  endDate: string | null | undefined
) {
  if (startDate && endDate) {
    return {
      expression: " and puzzleDate BETWEEN :startDate AND :endDate",
      values: {
        ":startDate": startDate,
        ":endDate": endDate,
      },
    };
  }

  if (startDate) {
    return {
      expression: " and puzzleDate >= :startDate",
      values: { ":startDate": startDate },
    };
  }

  if (endDate) {
    return {
      expression: " and puzzleDate <= :endDate",
      values: { ":endDate": endDate },
    };
  }

  return { expression: "", values: {} };
}
export async function queryPosts(
  userId: string,
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  nextToken: string | null | undefined
): Promise<SimplePaginatedPosts> {
  const { expression, values } = handleSortKey(startDate, endDate);

  const { items: posts, nextToken: newNextToken } = await query<SimplePost>(
    {
      TableName: POSTS_TABLE,
      KeyConditionExpression: `userId = :userId${expression}`,
      ExpressionAttributeValues: { ":userId": userId, ...values },
    },
    MAX_LIMIT,
    nextToken
  );

  return { posts, nextToken: newNextToken };
}

export async function batchGetPosts({
  userIds,
  puzzleDate,
}: {
  userIds: string[];
  puzzleDate: string;
}): Promise<SimplePost[]> {
  if (!userIds.length) {
    return [];
  }

  return (
    await batchGet<SimplePost>({
      RequestItems: {
        [POSTS_TABLE]: {
          Keys: userIds.map((userId) => ({ userId, puzzleDate })),
        },
      },
    })
  )[POSTS_TABLE];
}
