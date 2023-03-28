import { CfnOutput, Duration, Stack } from "aws-cdk-lib";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import {
  AccountRecovery,
  BooleanAttribute,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  StringAttribute,
  UserPool,
  VerificationEmailStyle,
} from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { FederatedPrincipal, Role } from "aws-cdk-lib/aws-iam";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { ITopic } from "aws-cdk-lib/aws-sns";
import { Queue, QueueEncryption } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import path from "path";
import { Stage } from "../types";

export interface CognitoConstructProps {
  cloudWatchAlarmTopic: ITopic | null;
  stage: Stage;
  usersTable: Table;
}

const VERIFICATION_MESSAGE =
  "Thanks for signing up for Wordle with Friends! Your verification code is {####}";

export class CognitoConstruct extends Construct {
  userPool: UserPool;

  constructor(
    scope: Construct,
    id: string,
    { cloudWatchAlarmTopic, stage, usersTable }: CognitoConstructProps
  ) {
    super(scope, id);

    const postConfirmationDLQ = new Queue(this, "PostConfirmationDLQ", {
      queueName: `wordle-friends-post-confirmation-dlq-${stage}`,
      encryption: QueueEncryption.KMS_MANAGED,
    });
    const dlqAlarm = postConfirmationDLQ
      .metricApproximateNumberOfMessagesVisible()
      .createAlarm(this, "PostConfirmationDLQVisibleMessagesAlarm", {
        threshold: 1,
        evaluationPeriods: 1,
        alarmName: `Post Confirmation DLQ Alarm ${stage
          .charAt(0)
          .toUpperCase()}${stage.slice(1)}`,
      });

    if (cloudWatchAlarmTopic) {
      dlqAlarm.addAlarmAction(new SnsAction(cloudWatchAlarmTopic));
    }

    const postConfirmationHandler = new Function(
      this,
      "PostConfirmationHandler",
      {
        code: Code.fromAsset(
          path.join(__dirname, "../../../lambdas/dist/postConfirmation")
        ),
        deadLetterQueueEnabled: true,
        deadLetterQueue: postConfirmationDLQ,
        functionName: `wordle-friends-post-confirmation-${stage}`,
        handler: "index.handler",
        runtime: Runtime.NODEJS_16_X,
        timeout: Duration.seconds(30),
        environment: {
          USERS_TABLE: usersTable.tableName,
        },
      }
    );
    usersTable.grantWriteData(postConfirmationHandler);

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
      // Custom attribute names must be <= 20 characters
      customAttributes: {
        showSquares: new BooleanAttribute({ mutable: true }),
        notifyOnFriendPost: new BooleanAttribute({ mutable: true }),
        notifyOnPostComment: new BooleanAttribute({ mutable: true }),
        notifyOnCommentReply: new BooleanAttribute({ mutable: true }),
        timezone: new StringAttribute({ mutable: true }),
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
