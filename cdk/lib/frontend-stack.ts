import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { DnsValidatedCertificate } from "aws-cdk-lib/aws-certificatemanager";
import {
  CloudFrontAllowedMethods,
  CloudFrontWebDistribution,
  OriginAccessIdentity,
  SecurityPolicyProtocol,
  SSLMethod,
  ViewerCertificate,
} from "aws-cdk-lib/aws-cloudfront";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import path from "path";
import { DOMAIN_NAME } from "./constants";

export class FrontendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = HostedZone.fromLookup(this, "HostedZone", {
      domainName: DOMAIN_NAME,
    });
    const certificate = new DnsValidatedCertificate(this, "SiteCertificate", {
      domainName: DOMAIN_NAME,
      hostedZone,
      region: "us-east-1",
    });
    const viewerCertificate = ViewerCertificate.fromAcmCertificate(
      certificate,
      {
        sslMethod: SSLMethod.SNI,
        securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2018,
        aliases: [DOMAIN_NAME],
      }
    );

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "CloudFrontOriginAccessIdentity"
    );
    const assetsBucket = new Bucket(this, "AssetsBucket", {
      bucketName: DOMAIN_NAME,
      websiteErrorDocument: "index.html",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });
    assetsBucket.grantRead(originAccessIdentity);

    const distribution = new CloudFrontWebDistribution(
      this,
      "CloudFrontWebDistribution",
      {
        viewerCertificate,
        errorConfigurations: [
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: "/index.html",
          },
        ],
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

    new ARecord(this, "SiteARecord", {
      recordName: DOMAIN_NAME,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone: hostedZone,
    });

    new BucketDeployment(this, "AssetsBucketDeployment", {
      destinationBucket: assetsBucket,
      distribution,
      distributionPaths: ["/*"],
      sources: [Source.asset(path.join(__dirname, "../../frontend/build"))],
    });

    new CfnOutput(this, "DomainName", { value: `https://${DOMAIN_NAME}` });
  }
}
