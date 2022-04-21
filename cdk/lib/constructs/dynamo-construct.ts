import {
  AttributeType,
  BillingMode,
  ProjectionType,
  StreamViewType,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { CommentsTableIndex, FriendsTableIndex, Stage } from "../types";

export interface DynamoConstructProps {
  stage: Stage;
}

export class DynamoConstruct extends Construct {
  friendsTable: Table;
  postsTable: Table;
  usersTable: Table;
  commentsTable: Table;
  reactionsTable: Table;

  constructor(scope: Construct, id: string, { stage }: DynamoConstructProps) {
    super(scope, id);

    this.friendsTable = new Table(this, "FriendsTable", {
      tableName: `wordle-friends-friends-${stage}`,
      partitionKey: { name: "userId", type: AttributeType.STRING },
      sortKey: { name: "friendId", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
    this.friendsTable.addGlobalSecondaryIndex({
      indexName: FriendsTableIndex.UserIdStatus,
      partitionKey: { name: "userId", type: AttributeType.STRING },
      sortKey: { name: "status", type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.usersTable = new Table(this, "UsersTable", {
      tableName: `wordle-friends-users-${stage}`,
      partitionKey: { name: "id", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    this.postsTable = new Table(this, "PostsTable", {
      tableName: `wordle-friends-posts-${stage}`,
      partitionKey: { name: "userId", type: AttributeType.STRING },
      sortKey: { name: "puzzleDate", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      stream: StreamViewType.NEW_IMAGE,
    });

    this.commentsTable = new Table(this, "CommentsTable", {
      tableName: `wordle-friends-comments-${stage}`,
      partitionKey: { name: "id", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      stream: StreamViewType.NEW_IMAGE,
    });
    this.commentsTable.addGlobalSecondaryIndex({
      indexName: CommentsTableIndex.PostIdCreatedAt,
      partitionKey: { name: "postId", type: AttributeType.STRING },
      sortKey: { name: "createdAt", type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.reactionsTable = new Table(this, "ReactionsTable", {
      tableName: `wordle-friends-reactions-${stage}`,
      partitionKey: { name: "id", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
  }
}
