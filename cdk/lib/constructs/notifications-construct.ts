import { Duration } from "aws-cdk-lib";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import {
  Code,
  Function,
  Runtime,
  StartingPosition,
} from "aws-cdk-lib/aws-lambda";
import {
  DynamoEventSource,
  SqsDlq,
} from "aws-cdk-lib/aws-lambda-event-sources";
import { CfnTemplate } from "aws-cdk-lib/aws-ses";
import { ITopic } from "aws-cdk-lib/aws-sns";
import { Queue, QueueEncryption } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import path from "path";
import { FROM_EMAIL_ADDRESS } from "../constants";
import { getSESPolicyStatement, getUserPoolPolicyStatement } from "../policies";
import { CommentsTableIndex, FriendsTableIndex, Stage } from "../types";
import { generateTemplateText } from "../utils";

export interface NotificationsConstructProps {
  cloudWatchAlarmTopic: ITopic | null;
  commentsTable: Table;
  friendsTable: Table;
  postsTable: Table;
  stage: Stage;
  userPool: UserPool;
  usersTable: Table;
}

export class NotificationsConstruct extends Construct {
  constructor(
    scope: Construct,
    id: string,
    {
      cloudWatchAlarmTopic,
      commentsTable,
      friendsTable,
      postsTable,
      stage,
      userPool,
      usersTable,
    }: NotificationsConstructProps
  ) {
    super(scope, id);

    const notificationsDLQ = new Queue(this, "NotificationsDLQ", {
      queueName: `wordle-friends-notifications-dlq-${stage}`,
      encryption: QueueEncryption.KMS_MANAGED,
    });
    const dlqAlarm = notificationsDLQ
      .metricApproximateNumberOfMessagesVisible()
      .createAlarm(this, "NotificationsDLQVisibleMessagesAlarm", {
        threshold: 1,
        evaluationPeriods: 1,
        alarmName: `Notifications DLQ Alarm ${stage
          .charAt(0)
          .toUpperCase()}${stage.slice(1)}`,
      });

    if (cloudWatchAlarmTopic) {
      dlqAlarm.addAlarmAction(new SnsAction(cloudWatchAlarmTopic));
    }

    const friendPostTemplateName = `friend-post-template-${stage}`;
    new CfnTemplate(this, "FriendPostEmailTemplate", {
      template: {
        templateName: friendPostTemplateName,
        subjectPart: "A friend shared their {{puzzleDate}} Wordle result",
        textPart: generateTemplateText([
          "{{friendName}} just shared their Wordle result for {{puzzleDate}}:",
          "{{result}}",
        ]),
      },
    });

    const postCommentTemplateName = `post-comment-template-${stage}`;
    new CfnTemplate(this, "PostCommentEmailTemplate", {
      template: {
        templateName: postCommentTemplateName,
        subjectPart: "A friend commented on your {{puzzleDate}} Wordle result",
        textPart: generateTemplateText([
          "{{friendName}} just commented on your Wordle result from {{puzzleDate}}:",
          "{{comment}}",
        ]),
      },
    });

    const commentReplyTemplateName = `comment-reply-template-${stage}`;
    new CfnTemplate(this, "CommentReplyEmailTemplate", {
      template: {
        templateName: commentReplyTemplateName,
        subjectPart:
          "Someone replied to a {{puzzleDate}} Wordle result you commented on",
        textPart: generateTemplateText([
          "{{commenterName}} just commented on {{posterName}}'s Wordle result from {{puzzleDate}}:",
          "{{comment}}",
        ]),
      },
    });

    const streamTables = [commentsTable, postsTable];
    const notificationsHandler = new Function(this, "NotificationsHandler", {
      functionName: `wordle-friends-notifications-${stage}`,
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(
        path.join(__dirname, "../../../lambdas/dist/notifications")
      ),
      handler: "index.handler",
      timeout: Duration.minutes(5),
      environment: {
        // Table names
        COMMENTS_TABLE: commentsTable.tableName,
        FRIENDS_TABLE: friendsTable.tableName,
        POSTS_TABLE: postsTable.tableName,
        USERS_TABLE: usersTable.tableName,
        // Table index names
        POST_ID_CREATED_AT_INDEX: CommentsTableIndex.PostIdCreatedAt,
        USER_ID_STATUS_INDEX: FriendsTableIndex.UserIdStatus,
        // Stream arns
        COMMENTS_TABLE_STREAM_ARN: commentsTable.tableStreamArn ?? "",
        POSTS_TABLE_STREAM_ARN: postsTable.tableStreamArn ?? "",
        // Template names
        COMMENT_REPLY_TEMPLATE_NAME: commentReplyTemplateName,
        FRIEND_POST_TEMPLATE_NAME: friendPostTemplateName,
        POST_COMMENT_TEMPLATE_NAME: postCommentTemplateName,
        // User pool
        USER_POOL_ID: userPool.userPoolId,
        // Email address
        FROM_EMAIL_ADDRESS,
      },
      retryAttempts: 0,
      deadLetterQueueEnabled: true,
      deadLetterQueue: notificationsDLQ,
      events: streamTables.map(
        (table) =>
          new DynamoEventSource(table, {
            startingPosition: StartingPosition.TRIM_HORIZON,
            batchSize: 1,
            onFailure: new SqsDlq(notificationsDLQ),
            retryAttempts: 0,
          })
      ),
    });

    notificationsHandler.addToRolePolicy(getUserPoolPolicyStatement(userPool));
    notificationsHandler.addToRolePolicy(
      getSESPolicyStatement(this, ["ses:SendBulkTemplatedEmail"])
    );

    commentsTable.grantReadData(notificationsHandler);
    friendsTable.grantReadData(notificationsHandler);
    postsTable.grantReadData(notificationsHandler);
    usersTable.grantReadData(notificationsHandler);

    streamTables.forEach((table) =>
      table.grantStreamRead(notificationsHandler)
    );
  }
}
