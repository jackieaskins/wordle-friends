import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { mockClient } from "aws-sdk-client-mock";
import { getUser } from "./cognito";

jest.mock("../constants", () => ({
  REGION: "us-east-1",
  USER_POOL_ID: "USER_POOL_ID",
}));

const cognitoClient = mockClient(CognitoIdentityProviderClient);

describe("cognito", () => {
  beforeEach(() => {
    cognitoClient.reset();

    cognitoClient.on(AdminGetUserCommand).resolves({ UserAttributes: [] });
  });

  describe("getUser", () => {
    it("gets user with accessToken", async () => {
      expect.assertions(1);

      await getUser("accessToken");

      expect(
        cognitoClient.commandCalls(GetUserCommand, {
          AccessToken: "accessToken",
        })
      ).toHaveLength(1);
    });
  });
});
