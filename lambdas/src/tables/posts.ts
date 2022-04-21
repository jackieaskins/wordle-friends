import dayjs from "dayjs";
import { PaginatedPosts, Post, PostInput } from "wordle-friends-graphql";
import { batchGet, get, put } from "../clients/dynamo";
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

export async function getPost(key: PostKey): Promise<SimplePost | undefined> {
  return await get<PostKey, SimplePost>({ TableName: POSTS_TABLE, Key: key });
}

export async function getPostById(id: string): Promise<SimplePost | undefined> {
  return await getPost(parsePostId(id));
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
