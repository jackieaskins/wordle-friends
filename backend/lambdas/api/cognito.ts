import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  GetUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { REGION } from "./constants";

const client = new CognitoIdentityProviderClient({ region: REGION });

export async function getUser(
  accessToken: string | undefined
): Promise<GetUserCommandOutput> {
  return await client.send(
    new GetUserCommand({
      AccessToken: accessToken,
    })
  );
}
