import {
  AuthorizationType,
  DynamoDbDataSource,
  FieldLogLevel,
  GraphqlApi,
  LambdaDataSource,
  MappingTemplate,
  Schema,
} from "@aws-cdk/aws-appsync-alpha";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import path from "path";
import { CognitoConstruct } from "./constructs/cognito-construct";
import { DynamoConstruct } from "./constructs/dynamo-construct";
import { CommentsTableIndex, FriendsTableIndex, Stage } from "./types";
import { getCloudWatchAlarmTopic } from "./utils";
import { getUserRequest } from "./vtl";

interface BackendStackProps extends StackProps {
  stage: Stage;
}

const RESOLVERS = {
  Query: [
    "listPostComments",
    "listFriends",
    "getCurrentUserPost",
    "listFriendPosts",
  ],
  Mutation: [
    "acceptFriendRequest",
    "deleteFriend",
    "sendFriendRequest",
    "createComment",
    "createPost",
  ],
};
const USER_MAPPINGS = [
  { typeName: "Post", fieldName: "user", sourceKey: "userId" },
  { typeName: "Friend", fieldName: "friend", sourceKey: "friendId" },
  { typeName: "Comment", fieldName: "user", sourceKey: "userId" },
];

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const { stage } = props;

    const cloudWatchAlarmTopic = getCloudWatchAlarmTopic(
      this,
      "CloudWatchAlarmTopic"
    );

    const { commentsTable, friendsTable, postsTable, usersTable } =
      new DynamoConstruct(this, "Dynamo", { stage });
    const { userPool } = new CognitoConstruct(this, "Cognito", {
      cloudWatchAlarmTopic,
      usersTable,
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
      code: Code.fromAsset(path.join(__dirname, "../../api/api.zip")),
      functionName: `wordle-friends-api-${stage}`,
      handler: "dist/index.handler",
      runtime: Runtime.NODEJS_14_X,
      timeout: Duration.seconds(10),
      environment: {
        COMMENTS_TABLE: commentsTable.tableName,
        POST_ID_CREATED_AT_INDEX: CommentsTableIndex.PostIdCreatedAt,
        FRIENDS_TABLE: friendsTable.tableName,
        USER_ID_STATUS_INDEX: FriendsTableIndex.UserIdStatus,
        POSTS_TABLE: postsTable.tableName,
      },
    });
    commentsTable.grantReadWriteData(apiHandler);
    friendsTable.grantReadWriteData(apiHandler);
    postsTable.grantReadWriteData(apiHandler);

    const usersTableDS = new DynamoDbDataSource(this, "UsersDynamoDataSource", {
      api,
      table: usersTable,
    });
    USER_MAPPINGS.map(({ typeName, fieldName, sourceKey }) => {
      usersTableDS.createResolver({
        typeName,
        fieldName,
        requestMappingTemplate: MappingTemplate.fromString(
          getUserRequest(sourceKey)
        ),
        responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
      });
    });

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
