import {
  AppSyncIdentityCognito,
  AppSyncResolverEvent,
  Callback,
  Context,
} from "aws-lambda";
import { acceptFriendRequest } from "./mutations/acceptFriendRequest";
import { deleteFriend } from "./mutations/deleteFriend";
import { sendFriendRequest } from "./mutations/sendFriendRequest";
import { listFriends } from "./queries/listFriends";

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
      return callback(null, await listFriends(userId, event));
    case "deleteFriend":
      return callback(null, await deleteFriend(userId, event));
    case "sendFriendRequest":
      return callback(null, await sendFriendRequest(userId, event));
    case "acceptFriendRequest":
      return callback(null, await acceptFriendRequest(userId, event));
  }

  throw new Error("Unsupported operation");
}
