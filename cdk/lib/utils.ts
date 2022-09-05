import { ITopic, Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";
import { DOMAIN_NAME } from "./constants";

export function getCloudWatchAlarmTopic(scope: Construct, id: string): ITopic {
  return Topic.fromTopicArn(
    scope,
    id,
    "arn:aws:sns:us-east-1:689215361230:CloudWatchAlarmsTopic"
  );
}

export function generateTemplateText(body: string[]): string {
  const siteUrl = `https://${DOMAIN_NAME}`;

  return [
    "Hi {{firstName}},",
    ...body,
    `Visit Wordle with Friends: ${siteUrl}?date={{puzzleDate}}`,
    `To update subscription preferences: ${siteUrl}/preferences`,
  ].join("\r\n\r\n");
}
