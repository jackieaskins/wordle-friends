import { AppSyncResolverEvent } from "aws-lambda";
import { ListFriendsQueryVariables } from "wordle-friends-graphql";
import { listFriends, SimplePaginatedFriends } from "../../tables/friends";

export async function listFriendsHandler(
  userId: string,
  { arguments: input }: AppSyncResolverEvent<ListFriendsQueryVariables>
): Promise<SimplePaginatedFriends> {
  return await listFriends({ ...input, userId });
}
