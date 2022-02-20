import { CfnOutput, Stack } from "aws-cdk-lib";
import {
  AccountRecovery,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  UserPool,
  VerificationEmailStyle,
} from "aws-cdk-lib/aws-cognito";
import { FederatedPrincipal, Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { Stage } from "../types";

export interface CognitoConstructProps {
  stage: Stage;
}

const VERIFICATION_MESSAGE =
  "Thanks for signing up for Wordle Friends! Your verification code is {####}";

export class CognitoConstruct extends Construct {
  constructor(scope: Construct, id: string, props: CognitoConstructProps) {
    super(scope, id);

    const { stage } = props;

    const userPool = new UserPool(this, "UserPool", {
      userPoolName: `wordle-friends-userpool-${stage}`,
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: "Verify your email for Wordle Friends",
        emailBody: VERIFICATION_MESSAGE,
        emailStyle: VerificationEmailStyle.CODE,
        smsMessage: VERIFICATION_MESSAGE,
      },
      signInAliases: { email: true },
      autoVerify: { email: true },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      standardAttributes: {
        givenName: {
          required: true,
          mutable: true,
        },
        familyName: {
          required: true,
          mutable: true,
        },
      },
    });

    const userPoolWebClient = userPool.addClient("UserPoolWebClient", {
      userPoolClientName: `wordle-friends-userpool-webclient-${stage}`,
      authFlows: {
        userPassword: true,
        userSrp: true,
        custom: true,
      },
    });

    const identityPool = new CfnIdentityPool(this, "IdentityPool", {
      identityPoolName: `wordle-friends-identitypool-${stage}`,
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolWebClient.userPoolClientId,
          providerName: userPool.userPoolProviderName,
        },
      ],
    });

    const authenticatedRole = new Role(this, "AuthenticatedUserRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });

    new CfnIdentityPoolRoleAttachment(this, "IdentityPoolRoleAttachment", {
      identityPoolId: identityPool.ref,
      roles: { authenticated: authenticatedRole.roleArn },
      roleMappings: {
        mapping: {
          type: "Token",
          ambiguousRoleResolution: "AuthenticatedRole",
          identityProvider: `cognito-idp.${
            Stack.of(this).region
          }.amazonaws.com/${userPool.userPoolId}:${
            userPoolWebClient.userPoolClientId
          }`,
        },
      },
    });

    new CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });
    new CfnOutput(this, "UserPoolWebClientId", {
      value: userPoolWebClient.userPoolClientId,
    });
    new CfnOutput(this, "IdentityPoolId", {
      value: identityPool.ref,
    });
  }
}
