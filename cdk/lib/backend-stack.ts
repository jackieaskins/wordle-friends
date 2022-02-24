import {
  AuthorizationType,
  FieldLogLevel,
  GraphqlApi,
  MappingTemplate,
  Schema,
} from "@aws-cdk/aws-appsync-alpha";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import fs from "fs";
import path from "path";
import { CognitoConstruct } from "./constructs/cognito-construct";
import { DynamoConstruct } from "./constructs/dynamo-construct";
import { FriendsTableIndex, Stage } from "./types";

interface BackendStackProps extends StackProps {
  stage: Stage;
}

function getMappingTemplateFromFile(
  mappingPath: string,
  replaceStrings?: Record<string, string>
): MappingTemplate {
  const fileContents = fs
    .readFileSync(path.join(__dirname, "../../api/resolvers", mappingPath))
    .toString();
  const templateStr = Object.entries(replaceStrings ?? {}).reduce(
    (prev, [pattern, value]) => prev.split(pattern).join(value),
    fileContents
  );
  return MappingTemplate.fromString(templateStr);
}

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const { stage } = props;

    const { userPool } = new CognitoConstruct(this, "Cognito", { stage });
    const { friendsTable } = new DynamoConstruct(this, "Dynamo", { stage });

    const api = new GraphqlApi(this, "GraphqlApi", {
      name: `wordle-friends-${stage}`,
      schema: Schema.fromAsset(path.join(__dirname, "../../schema.graphql")),
      logConfig: { fieldLogLevel: FieldLogLevel.ALL },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: { userPool },
        },
      },
    });

    const friendsDS = api.addDynamoDbDataSource(
      "FriendsDataSource",
      friendsTable
    );

    friendsDS.createResolver({
      typeName: "Query",
      fieldName: "listFriends",
      requestMappingTemplate: getMappingTemplateFromFile(
        "friends/listFriendsRequest.vm",
        { "#USER_ID_STATUS_INDEX#": FriendsTableIndex.UserIdStatus }
      ),
      responseMappingTemplate: getMappingTemplateFromFile(
        "friends/listFriendsResponse.vm"
      ),
    });

    friendsDS.createResolver({
      typeName: "Mutation",
      fieldName: "sendFriendRequest",
      requestMappingTemplate: getMappingTemplateFromFile(
        "friends/sendFriendRequestRequest.vm",
        { "#FRIENDS_TABLE#": friendsTable.tableName }
      ),
      responseMappingTemplate: getMappingTemplateFromFile(
        "friends/sendFriendRequestResponse.vm"
      ),
    });
  }
}
