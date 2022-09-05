import { AppSyncResolverEvent } from "aws-lambda";
import { RefType } from "wordle-friends-graphql";
import { SimplePost } from "../../tables/posts";
import { getReactions, SimpleReaction } from "../../tables/reactions";

export async function reactionsHandler(
  _userId: string,
  {
    source: { id: postId },
    info: { parentTypeName },
  }: AppSyncResolverEvent<any, SimplePost>
): Promise<SimpleReaction[]> {
  return await getReactions({
    refType: RefType[parentTypeName as keyof typeof RefType],
    refId: postId,
  });
}
