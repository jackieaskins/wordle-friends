import {
  AdminGetUserCommand,
  AttributeType,
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { REGION, USER_POOL_ID } from "../constants";

type BooleanString = "true" | "false";
type UserAttributes = {
  email: string;
  given_name: string;
  family_name: string;
  ["custom:notifyOnFriendPost"]?: BooleanString;
  ["custom:notifyOnPostComment"]?: BooleanString;
  ["custom:notifyOnCommentReply"]?: BooleanString;
  ["custom:showSquares"]?: BooleanString;
};

const client = new CognitoIdentityProviderClient({ region: REGION });

function mapUserAttributes(
  userAttributes: AttributeType[] | undefined
): UserAttributes {
  return Object.fromEntries(
    userAttributes?.map(({ Name: name, Value: value }) => [name, value]) ?? []
  );
}

export async function getUser(
  accessToken: string | undefined
): Promise<UserAttributes> {
  const { UserAttributes: userAttributes } = await client.send(
    new GetUserCommand({
      AccessToken: accessToken,
    })
  );
  return mapUserAttributes(userAttributes);
}

export async function adminGetUser(userId: string): Promise<UserAttributes> {
  const { UserAttributes: userAttributes } = await client.send(
    new AdminGetUserCommand({ Username: userId, UserPoolId: USER_POOL_ID })
  );
  return mapUserAttributes(userAttributes);
}
