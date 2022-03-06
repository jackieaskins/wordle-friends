import {
  AppSyncIdentityCognito,
  AppSyncResolverEvent,
  Callback,
  Context,
} from "aws-lambda";
import handlers from "./handlers";

export async function handler(
  event: AppSyncResolverEvent<any, any>,
  _context: Context,
  callback: Callback
): Promise<void> {
  const {
    info: { parentTypeName, fieldName },
    identity,
  } = event;

  const userId = (identity as AppSyncIdentityCognito)?.sub;
  if (!userId) {
    throw new Error("Must be logged in to access API");
  }

  const handler = handlers[`${fieldName}Handler`];

  try {
    if (handler) {
      callback(null, await handler(userId, event));
    } else {
      throw new Error(`Unsupported operation: ${parentTypeName} ${fieldName}`);
    }
  } catch (e: any) {
    callback(e, null);
  }
}
