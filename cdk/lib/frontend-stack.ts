import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  CloudFrontAllowedMethods,
  CloudFrontWebDistribution,
  OriginAccessIdentity,
} from "aws-cdk-lib/aws-cloudfront";
import { CanonicalUserPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import path from "path";

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "CloudFrontOriginAccessIdentity"
    );

    const assetsBucket = new Bucket(this, "AssetsBucket", {
      websiteErrorDocument: "index.html",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    assetsBucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [assetsBucket.arnForObjects("*")],
        principals: [
          new CanonicalUserPrincipal(
            originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new CloudFrontWebDistribution(
      this,
      "CloudFrontWebDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: assetsBucket,
              originAccessIdentity,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                compress: true,
                allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
              },
            ],
          },
        ],
      }
    );

    new BucketDeployment(this, "AssetsBucketDeployment", {
      destinationBucket: assetsBucket,
      distribution,
      distributionPaths: ["/*"],
      sources: [Source.asset(path.join(__dirname, "../../frontend/build"))],
    });

    new CfnOutput(this, "DomainName", {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}
