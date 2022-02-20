import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CognitoConstruct } from "./constructs/cognito-construct";
import { Stage } from "./types";

interface BackendStackProps extends StackProps {
  stage: Stage;
}

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const { stage } = props;
    new CognitoConstruct(this, "Cognito", { stage });
  }
}
