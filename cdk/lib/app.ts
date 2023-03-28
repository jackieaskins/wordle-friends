#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import * as dotenv from "dotenv";
import { BackendStack } from "./backend-stack";
import { FrontendStack } from "./frontend-stack";

dotenv.config();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();
new FrontendStack(app, "WordleFriendsFrontendStack", { env });
new BackendStack(app, "WordleFriendsBackendStack-Alpha", {
  env,
  stage: "alpha",
});
new BackendStack(app, "WordleFriendsBackendStack", { env, stage: "prod" });
