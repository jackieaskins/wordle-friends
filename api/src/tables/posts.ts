import dayjs from "dayjs";
import { PaginatedPosts, Post, PostInput } from "wordle-friends-graphql";
import { POSTS_TABLE } from "../constants";
import { batchGet, get, put } from "../dynamo";

export type PostKey = {
  userId: string;
  puzzleDate: string;
};
export type SimplePost = Omit<Post, "__typename" | "user">;
export type SimplePaginatedPosts = Omit<
  PaginatedPosts,
  "__typename" | "posts"
> & { posts: SimplePost[] };

function generateId(userId: string, puzzleDate: string): string {
  return `${userId}:${puzzleDate}`;
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

export async function getPost(key: PostKey): Promise<Post | undefined> {
  return await get<PostKey, Post>({ TableName: POSTS_TABLE, Key: key });
}

export async function listPosts({
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
