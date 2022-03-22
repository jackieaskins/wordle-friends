import { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";
import apis from "../apis";

export async function handler(
  event: AppSyncResolverEvent<any, any>
): Promise<void> {
  const {
    info: { parentTypeName, fieldName },
    identity,
  } = event;

  const userId = (identity as AppSyncIdentityCognito)?.sub;
  if (!userId) {
    throw new Error("Must be logged in to access API");
  }

  const handler = apis[`${fieldName}Handler`];
  if (handler) {
    return await handler(userId, event);
  }

  throw new Error(`Unsupported operation: ${parentTypeName} ${fieldName}`);
}
