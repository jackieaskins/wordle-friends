import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { mockClient } from "aws-sdk-client-mock";
import { getUser } from "./cognito";

const cognitoClient = mockClient(CognitoIdentityProviderClient);

describe("cognito", () => {
  beforeEach(() => {
    cognitoClient.reset();
  });

  describe("getUser", () => {
    it("gets user with ", async () => {
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
