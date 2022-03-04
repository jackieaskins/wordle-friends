import {
  AppSyncIdentityCognito,
  AppSyncResolverEvent,
  Callback,
  Context,
} from "aws-lambda";
import { acceptFriendRequestHandler } from "./mutations/acceptFriendRequest";
import { createPostHandler } from "./mutations/createPost";
import { deleteFriendHandler } from "./mutations/deleteFriend";
import { sendFriendRequestHandler } from "./mutations/sendFriendRequest";
import { getCurrentUserPostHandler } from "./queries/getCurrentUserPost";
import { listFriendPostsHandler } from "./queries/listFriendPosts";
import { listFriendsHandler } from "./queries/listFriends";

export async function handler(
  event: AppSyncResolverEvent<any, any>,
  _context: Context,
  callback: Callback
): Promise<void> {
  const {
    info: { fieldName },
    identity,
  } = event;

  const userId = (identity as AppSyncIdentityCognito)?.sub;
  if (!userId) {
    throw new Error("Must be logged in to access API");
  }

  switch (fieldName) {
    case "listFriends":
      return callback(null, await listFriendsHandler(userId, event));
    case "deleteFriend":
      return callback(null, await deleteFriendHandler(userId, event));
    case "sendFriendRequest":
      return callback(null, await sendFriendRequestHandler(userId, event));
    case "acceptFriendRequest":
      return callback(null, await acceptFriendRequestHandler(userId, event));
    case "createPost":
      return callback(null, await createPostHandler(userId, event));
    case "getCurrentUserPost":
      return callback(null, await getCurrentUserPostHandler(userId, event));
    case "listFriendPosts":
      return callback(null, await listFriendPostsHandler(userId, event));
  }

  throw new Error("Unsupported operation");
}
