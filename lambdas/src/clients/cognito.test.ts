import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { mockClient } from "aws-sdk-client-mock";
import { adminGetUser, getUser } from "./cognito";

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

  describe("adminGetUser", () => {
    it("gets user with user id", async () => {
      expect.assertions(1);

      const userId = "userId";
      await adminGetUser(userId);

      expect(
        cognitoClient.commandCalls(AdminGetUserCommand, {
          Username: userId,
          UserPoolId: "USER_POOL_ID",
        })
      ).toHaveLength(1);
    });

    it("returns a map with user values", async () => {
      expect.assertions(1);

      cognitoClient.on(AdminGetUserCommand).resolves({
        UserAttributes: [{ Name: "key", Value: "value" }],
      });

      await expect(adminGetUser("")).resolves.toEqual({ key: "value" });
    });

    it("returns an empty object if no userAttributes", async () => {
      expect.assertions(1);

      cognitoClient.on(AdminGetUserCommand).resolves({});

      await expect(adminGetUser("")).resolves.toEqual({});
    });
  });
});
