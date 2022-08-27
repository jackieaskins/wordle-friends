import { ITopic, Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";

export function getCloudWatchAlarmTopic(scope: Construct, id: string): ITopic {
  return Topic.fromTopicArn(
    scope,
    id,
    "arn:aws:sns:us-east-1:689215361230:CloudWatchAlarmsTopic"
  );
}
