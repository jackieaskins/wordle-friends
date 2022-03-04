import {
  AuthorizationType,
  FieldLogLevel,
  GraphqlApi,
  LambdaDataSource,
  Schema,
} from "@aws-cdk/aws-appsync-alpha";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import path from "path";
import { CognitoConstruct } from "./constructs/cognito-construct";
import { DynamoConstruct } from "./constructs/dynamo-construct";
import { FriendsTableIndex, Stage } from "./types";
import { getCloudWatchAlarmTopic } from "./utils";

interface BackendStackProps extends StackProps {
  stage: Stage;
}

const RESOLVERS = {
  Query: ["listFriends", "getCurrentUserPost", "listFriendPosts"],
  Mutation: [
    "acceptFriendRequest",
    "deleteFriend",
    "sendFriendRequest",
    "createPost",
  ],
};

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const { stage } = props;

    const cloudWatchAlarmTopic = getCloudWatchAlarmTopic(
      this,
      "CloudWatchAlarmTopic"
    );

    const { friendsTable, postsTable, userAttributesTable } =
      new DynamoConstruct(this, "Dynamo", { stage });
    const { userPool } = new CognitoConstruct(this, "Cognito", {
      cloudWatchAlarmTopic,
      userAttributesTable,
      stage,
    });

    const api = new GraphqlApi(this, "GraphqlApi", {
      name: `wordle-friends-${stage}`,
      schema: Schema.fromAsset(
        path.join(__dirname, "../../graphql/schema.graphql")
      ),
      logConfig: { fieldLogLevel: FieldLogLevel.ERROR },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: { userPool },
        },
      },
    });

    const apiHandler = new Function(this, "ApiLambda", {
      code: Code.fromAsset(
        path.join(__dirname, "../../backend/lambdas/api.zip")
      ),
      functionName: `wordle-friends-api-${stage}`,
      handler: "index.handler",
      runtime: Runtime.NODEJS_14_X,
      timeout: Duration.seconds(10),
      environment: {
        USER_ATTRIBUTES_TABLE: userAttributesTable.tableName,
        USER_ID_STATUS_INDEX: FriendsTableIndex.UserIdStatus,
        FRIENDS_TABLE: friendsTable.tableName,
        POSTS_TABLE: postsTable.tableName,
      },
    });
    userAttributesTable.grantReadWriteData(apiHandler);
    friendsTable.grantReadWriteData(apiHandler);
    postsTable.grantReadWriteData(apiHandler);

    const apiLambdaDS = new LambdaDataSource(this, "ApiLambdaDataSource", {
      api,
      lambdaFunction: apiHandler,
    });

    Object.entries(RESOLVERS).forEach(([typeName, fieldNames]) => {
      fieldNames.forEach((fieldName) => {
        apiLambdaDS.createResolver({ typeName, fieldName });
      });
    });
  }
}
