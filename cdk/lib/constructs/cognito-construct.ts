import { CfnOutput, Duration, Stack } from "aws-cdk-lib";
import {
  AccountRecovery,
  BooleanAttribute,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  UserPool,
  VerificationEmailStyle,
} from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { FederatedPrincipal, Role } from "aws-cdk-lib/aws-iam";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import path from "path";
import { Stage } from "../types";

export interface CognitoConstructProps {
  stage: Stage;
  userAttributesTable: Table;
}

const VERIFICATION_MESSAGE =
  "Thanks for signing up for Wordle with Friends! Your verification code is {####}";

export class CognitoConstruct extends Construct {
  userPool: UserPool;

  constructor(
    scope: Construct,
    id: string,
    { stage, userAttributesTable }: CognitoConstructProps
  ) {
    super(scope, id);

    const postConfirmationHandler = new Function(
      this,
      "PostConfirmationHandler",
      {
        code: Code.fromAsset(
          path.join(__dirname, "../../../backend/lambdas/postConfirmation.zip")
        ),
        functionName: `wordle-friends-post-confirmation-${stage}`,
        handler: "index.handler",
        runtime: Runtime.NODEJS_14_X,
        timeout: Duration.seconds(30),
        environment: {
          USER_ATTRIBUTES_TABLE: userAttributesTable.tableName,
        },
      }
    );
    userAttributesTable.grantWriteData(postConfirmationHandler);

    this.userPool = new UserPool(this, "UserPool", {
      userPoolName: `wordle-friends-userpool-${stage}`,
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: "Verify your email for Wordle with Friends",
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
      lambdaTriggers: { postConfirmation: postConfirmationHandler },
      customAttributes: {
        showSquares: new BooleanAttribute({ mutable: true }),
      },
    });

    const userPoolWebClient = this.userPool.addClient("UserPoolWebClient", {
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
          providerName: this.userPool.userPoolProviderName,
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
          }.amazonaws.com/${this.userPool.userPoolId}:${
            userPoolWebClient.userPoolClientId
          }`,
        },
      },
    });

    new CfnOutput(this, "UserPoolId", {
      value: this.userPool.userPoolId,
    });
    new CfnOutput(this, "UserPoolWebClientId", {
      value: userPoolWebClient.userPoolClientId,
    });
    new CfnOutput(this, "IdentityPoolId", {
      value: identityPool.ref,
    });
  }
}
