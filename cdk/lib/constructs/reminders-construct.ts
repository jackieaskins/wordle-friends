import { Duration } from "aws-cdk-lib";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { EventBus } from "aws-cdk-lib/aws-events";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { CfnTemplate } from "aws-cdk-lib/aws-ses";
import { Construct } from "constructs";
import path from "path";
import { getSESPolicyStatement, getUserPoolPolicyStatement } from "../policies";
import { Stage } from "../types";
import { generateTemplateText } from "../utils";

export interface RemindersConstructProps {
  postsTable: Table;
  stage: Stage;
  userPool: UserPool;
}

export class RemindersConstruct extends Construct {
  constructor(
    scope: Construct,
    id: string,
    { postsTable, stage, userPool }: RemindersConstructProps
  ) {
    super(scope, id);

    new EventBus(this, "RemindersEventBus", {
      eventBusName: `wordle-friends-reminders-${stage}`,
    });

    const reminderTemplateName = `reminder-template-${stage}`;
    new CfnTemplate(this, "ReminderTemplate", {
      template: {
        templateName: reminderTemplateName,
        subjectPart: "Reminder: Share your Wordle result",
        textPart: generateTemplateText([
          "Don't forget to share your Wordle result!",
        ]),
      },
    });

    const remindersHandler = new Function(this, "RemindersHandler", {
      functionName: `wordle-friends-reminders-${stage}`,
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset(
        path.join(__dirname, "../../../lambdas/dist/reminders")
      ),
      handler: "index.handler",
      timeout: Duration.minutes(5),
      environment: {
        POSTS_TABLE: postsTable.tableName,
        USER_POOL_ID: userPool.userPoolId,
        REMINDER_TEMPLATE_NAME: reminderTemplateName,
      },
    });

    remindersHandler.addToRolePolicy(getUserPoolPolicyStatement(userPool));
    remindersHandler.addToRolePolicy(
      getSESPolicyStatement(userPool, ["ses:SendTemplatedEmail"])
    );

    postsTable.grantReadData(remindersHandler);
  }
}
