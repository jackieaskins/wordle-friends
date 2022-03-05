import { AppSyncResolverEvent } from "aws-lambda";
import { User } from "wordle-friends-graphql";
import { USERS_TABLE } from "../constants";
import { get } from "../dynamo";

export async function userHandler(
  _userId: string,
  event: AppSyncResolverEvent<any, any>
): Promise<User> {
  const { Item: user } = await get({
    TableName: USERS_TABLE,
    Key: { id: event.source.userId },
  });

  return user as User;
}
