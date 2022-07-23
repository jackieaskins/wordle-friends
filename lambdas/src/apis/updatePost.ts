import { AppSyncResolverEvent } from "aws-lambda";
import { UpdatePostMutationVariables } from "wordle-friends-graphql";
import { SimplePost, updatePost } from "../tables/posts";

export async function updatePostHandler(
  _userId: string,
  { arguments: { input } }: AppSyncResolverEvent<UpdatePostMutationVariables>
): Promise<SimplePost> {
  return await updatePost(input);
}
