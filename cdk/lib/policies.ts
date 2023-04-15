import { Arn, Stack } from "aws-cdk-lib";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { SES_VERIFIED_IDENTITY } from "./constants";

export function getUserPoolPolicyStatement(
  userPool: UserPool
): PolicyStatement {
  return new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["cognito-idp:AdminGetUser"],
    resources: [userPool.userPoolArn],
  });
}

export function getSESPolicyStatement(
  scope: Construct,
  actions: string[]
): PolicyStatement {
  return new PolicyStatement({
    effect: Effect.ALLOW,
    actions,
    resources: [
      Arn.format({
        partition: Stack.of(scope).partition,
        region: Stack.of(scope).region,
        account: Stack.of(scope).account,
        service: "ses",
        resource: "identity",
        resourceName: SES_VERIFIED_IDENTITY,
      }),
    ],
  });
}
