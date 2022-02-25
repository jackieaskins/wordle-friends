import {
  AttributeType,
  BillingMode,
  ProjectionType,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { FriendsTableIndex, Stage } from "../types";

export interface DynamoConstructProps {
  stage: Stage;
}

export class DynamoConstruct extends Construct {
  friendsTable: Table;
  userAttributesTable: Table;

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

    this.userAttributesTable = new Table(this, "UserArributsTable", {
      tableName: `wordle-friends-user-attributes-${stage}`,
      partitionKey: { name: "userId", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });
  }
}
