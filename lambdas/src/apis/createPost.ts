import { AppSyncResolverEvent } from "aws-lambda";
import { CreatePostMutationVariables } from "wordle-friends-graphql";
import { createPost, SimplePost } from "../tables/posts";

export async function createPostHandler(
  userId: string,
  { arguments: { input } }: AppSyncResolverEvent<CreatePostMutationVariables>
): Promise<SimplePost> {
  return await createPost({ ...input, userId });
}
