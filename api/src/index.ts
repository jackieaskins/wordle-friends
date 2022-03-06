import {
  AppSyncIdentityCognito,
  AppSyncResolverEvent,
  Callback,
  Context,
} from "aws-lambda";
import { acceptFriendRequestHandler } from "./mutation/acceptFriendRequest";
import { createPostHandler } from "./mutation/createPost";
import { deleteFriendHandler } from "./mutation/deleteFriend";
import { sendFriendRequestHandler } from "./mutation/sendFriendRequest";
import { getCurrentUserPostHandler } from "./query/getCurrentUserPost";
import { listFriendPostsHandler } from "./query/listFriendPosts";
import { listFriendsHandler } from "./query/listFriends";

async function handleField(
  event: AppSyncResolverEvent<any, any>
): Promise<any> {
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
      return await listFriendsHandler(userId, event);
    case "deleteFriend":
      return await deleteFriendHandler(userId, event);
    case "sendFriendRequest":
      return await sendFriendRequestHandler(userId, event);
    case "acceptFriendRequest":
      return await acceptFriendRequestHandler(userId, event);
    case "createPost":
      return await createPostHandler(userId, event);
    case "getCurrentUserPost":
      return await getCurrentUserPostHandler(userId, event);
    case "listFriendPosts":
      return await listFriendPostsHandler(userId, event);
  }

  throw new Error("Unsupported operation");
}

export async function handler(
  event: AppSyncResolverEvent<any, any>,
  _context: Context,
  callback: Callback
): Promise<void> {
  try {
    callback(null, await handleField(event));
  } catch (e: any) {
    callback(e, null);
    throw e;
  }
}
