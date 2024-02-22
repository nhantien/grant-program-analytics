import * as cdk from "aws-cdk-lib";
import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { VpcStack } from "./vpc-stack";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as iam from "aws-cdk-lib/aws-iam";
import * as glue from "aws-cdk-lib/aws-glue";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { triggers } from "aws-cdk-lib";
import { Effect } from "aws-cdk-lib/aws-iam";

export class DataPipelineStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    vpcStack: VpcStack,
    props?: StackProps
  ) {
    super(scope, id, props);

    // Data storage bucket
    const dataBucket = new s3.Bucket(this, "datapipeline-s3bucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // Glue deployment bucket
    const glueS3Bucket = new s3.Bucket(this, "glue-s3bucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    const triggerLambda = new triggers.TriggerFunction(
      this,
      "createFolders-lambda",
      {
        functionName: "createFolders",
        runtime: lambda.Runtime.PYTHON_3_9,
        handler: "createFolders.lambda_handler",
        timeout: cdk.Duration.seconds(300),
        memorySize: 512,
        environment: {
          BUCKET_NAME: dataBucket.bucketName,
        },
        vpc: vpcStack.vpc,
        code: lambda.Code.fromAsset("./lambda/createFolders"),
        layers: [],
        executeAfter: [dataBucket],
      }
    );

    triggerLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "s3:ListBucket",
          "s3:ListObjectsV2",
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:GetObject",
        ],
        resources: [
          `arn:aws:s3:::${dataBucket.bucketName}`,
          `arn:aws:s3:::${dataBucket.bucketName}/*`,
        ],
      })
    );
    triggerLambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          // CloudWatch Logs
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: ["arn:aws:logs:*:*:*"],
      })
    );

    // Create new Glue Role. DO NOT RENAME THE ROLE!!!
    const roleName = "AWSGlueServiceRole-datapipeline";
    const glueRole = new iam.Role(this, roleName, {
      assumedBy: new iam.ServicePrincipal("glue.amazonaws.com"),
      description: "Glue Service Role",
      roleName: roleName,
    });

    // Add different policies to glue-service-role
    const glueServiceRolePolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "service-role/AWSGlueServiceRole"
    );
    // const glueAmazonS3FullAccessPolicy =
    //   iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess");
    const glueComprehendPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "ComprehendFullAccess"
    );

    glueRole.addManagedPolicy(glueServiceRolePolicy);
    // glueRole.addManagedPolicy(glueAmazonS3FullAccessPolicy);
    glueRole.addManagedPolicy(glueComprehendPolicy);

    const PYTHON_VER = "3.9";
    const GLUE_VER = "3.0";
    const MAX_RETRIES = 0; // no retries, only execute once
    const MAX_CAPACITY = 0.0625; // 1/16 of a DPU, lowest setting
    const MAX_CONCURRENT_RUNS = 1; // 1 concurrent runs of the same job simultaneously
    const TIMEOUT = 20; // 20 min timeout duration

    const glueJob1Name = "clean-data";
    const glueJob1 = new glue.CfnJob(this, glueJob1Name, {
      name: glueJob1Name,
      role: glueRole.roleArn,
      command: {
        name: "pythonshell",
        pythonVersion: PYTHON_VER,
        scriptLocation:
          "s3://" + glueS3Bucket.bucketName + "/scripts/clean-data.py",
      },
      executionProperty: {
        maxConcurrentRuns: MAX_CONCURRENT_RUNS,
      },
      maxRetries: MAX_RETRIES,
      maxCapacity: MAX_CAPACITY,
      timeout: TIMEOUT,
      glueVersion: GLUE_VER,
      defaultArguments: {
        "--additional-python-modules": "openpyxl,fuzzywuzzy",
        "library-set": "analytics",
        "--BUCKET_NAME": dataBucket.bucketName,
        "--RAW_DATA_S3URI": "n/a",
        "--INSTITUTION_DATA_S3URI": "n/a",
        "--LOG_BUCKET_NAME": "n/a",
      },
    });

    // Deploy glue job to glue S3 bucket
    new s3deploy.BucketDeployment(this, "DeployGlueJobFiles1", {
      sources: [s3deploy.Source.asset("./glue/scripts")],
      destinationBucket: glueS3Bucket,
      destinationKeyPrefix: "scripts",
    });

    // Grant S3 read/write role to Glue
    glueS3Bucket.grantReadWrite(glueRole);
    dataBucket.grantReadWrite(glueRole);

    // Destroy Glue related resources when PatentDataStack is deleted
    glueJob1.applyRemovalPolicy(RemovalPolicy.DESTROY);
  }
}
