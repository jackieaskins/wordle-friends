import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CognitoConstruct } from "./constructs/cognito-construct";

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new CognitoConstruct(this, "Cognito");
  }
}
