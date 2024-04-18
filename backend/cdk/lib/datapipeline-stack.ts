import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { VpcStack } from "./vpc-stack";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as iam from "aws-cdk-lib/aws-iam";
import * as glue from "aws-cdk-lib/aws-glue";
import * as lambda from "aws-cdk-lib/aws-lambda";

export class DataPipelineStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    vpcStack: VpcStack,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // files storage bucket
    const dataBucket = new s3.Bucket(this, "data-s3bucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: false,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // bucket for embeddings
    const embeddingsBucket = new s3.Bucket(this, "embeddings-s3bucket", {
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

    // const triggerLambda = new cdk.triggers.TriggerFunction(
    //   this,
    //   "createFolders-lambda",
    //   {
    //     functionName: "createFolders",
    //     runtime: lambda.Runtime.PYTHON_3_9,
    //     handler: "createFolders.lambda_handler",
    //     timeout: cdk.Duration.seconds(300),
    //     memorySize: 512,
    //     environment: {
    //       BUCKET_NAME: dataBucket.bucketName,
    //     },
    //     vpc: vpcStack.vpc,
    //     code: lambda.Code.fromAsset("./lambda/createFolders"),
    //     layers: [],
    //     executeAfter: [dataBucket],
    //   }
    // );

    // triggerLambda.addToRolePolicy(
    //   new iam.PolicyStatement({
    //     effect: iam.Effect.ALLOW,
    //     actions: [
    //       "s3:ListBucket",
    //       "s3:ListObjectsV2",
    //       "s3:PutObject",
    //       "s3:PutObjectAcl",
    //       "s3:GetObject",
    //     ],
    //     resources: [
    //       `arn:aws:s3:::${dataBucket.bucketName}`,
    //       `arn:aws:s3:::${dataBucket.bucketName}/*`,
    //     ],
    //   })
    // );
    // triggerLambda.addToRolePolicy(
    //   new iam.PolicyStatement({
    //     effect: iam.Effect.ALLOW,
    //     actions: [
    //       // CloudWatch Logs
    //       "logs:CreateLogGroup",
    //       "logs:CreateLogStream",
    //       "logs:PutLogEvents",
    //     ],
    //     resources: ["arn:aws:logs:*:*:*"],
    //   })
    // );

    // Create new Glue Role. DO NOT RENAME THE ROLE!!!
    const roleName = "AWSGlueServiceRole-gluedatapipeline";
    const glueRole = new iam.Role(this, roleName, {
      assumedBy: new iam.ServicePrincipal("glue.amazonaws.com"),
      description: "Glue Service Role",
      roleName: roleName,
    });

    // Add different policies to glue-service-role
    const glueServiceRolePolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "service-role/AWSGlueServiceRole"
    );
    const glueComprehendPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "ComprehendFullAccess"
    );
    const glueS3policy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "AmazonS3FullAccess"
    );
    const glueEventBridgePolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "AmazonEventBridgeFullAccess"
    )
    const glueSNSPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "AmazonSNSFullAccess"
    )
    const glueCloudwatchEventsPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(
      "CloudWatchEventsFullAccess"
    )


    glueRole.addManagedPolicy(glueServiceRolePolicy);
    glueRole.addManagedPolicy(glueS3policy);
    glueRole.addManagedPolicy(glueComprehendPolicy);
    glueRole.addManagedPolicy(glueEventBridgePolicy);
    glueRole.addManagedPolicy(glueSNSPolicy);
    glueRole.addManagedPolicy(glueCloudwatchEventsPolicy);

    /* THESE ARE THE CONFIGURATION FOR GLUE */
    const PYTHON_VER = "3.9";
    const GLUE_VER = "3.0";
    const MAX_RETRIES = 0; // no retries, only execute once
    const MAX_CAPACITY = 1 // or 0.0625; // 1 DPU
    const MAX_CONCURRENT_RUNS = 1; // 1 concurrent runs of the same job simultaneously
    const TIMEOUT = 120; // 120 min timeout duration
    
    // clean-survey-monkey-data
    const glueJob1Name = "tlef-clean-survey-monkey-data";
    const glueJob1 = new glue.CfnJob(this, glueJob1Name, {
      name: glueJob1Name,
      role: glueRole.roleArn,
      command: {
        name: "pythonshell",
        pythonVersion: PYTHON_VER,
        scriptLocation:
          "s3://" + glueS3Bucket.bucketName + "/scripts/clean-survey-monkey-data.py",
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
        "--SURVEY_MONKEY_S3URI": "n/a", // placeholder, to be copy paste by client on the console
        "--INSTITUTION_DATA_S3URI": `s3://${dataBucket}/INSTITUTION_DATA/institution_data.csv`, // hardcoded folder name and file name
      },
    });

    // generate-new-grant-ids
    const glueJob2Name = "tlef-generate-new-grant-ids";
    const glueJob2 = new glue.CfnJob(this, glueJob2Name, {
      name: glueJob2Name,
      role: glueRole.roleArn,
      command: {
        name: "pythonshell",
        pythonVersion: PYTHON_VER,
        scriptLocation:
          "s3://" + glueS3Bucket.bucketName + "/scripts/generate-new-grant-ids.py",
      },
      executionProperty: {
        maxConcurrentRuns: MAX_CONCURRENT_RUNS,
      },
      maxRetries: MAX_RETRIES,
      maxCapacity: MAX_CAPACITY,
      timeout: TIMEOUT,
      glueVersion: GLUE_VER,
      defaultArguments: {
        "library-set": "analytics",
        "--BUCKET_NAME": dataBucket.bucketName,
        "--PROJECT_DETAILS_S3URI": "n/a", // placeholder, to be copy paste by client on the console
      },
    });

    // 
    const glueJob3Name = "tlef-generate-embeddings-and-similar-projects.py";
    const glueJob3 = new glue.CfnJob(this, glueJob3Name, {
      name: glueJob3Name,
      role: glueRole.roleArn,
      command: {
        name: "pythonshell",
        pythonVersion: PYTHON_VER,
        scriptLocation:
          "s3://" + glueS3Bucket.bucketName + "/scripts/generate-embeddings-and-similar-projects.py",
      },
      executionProperty: {
        maxConcurrentRuns: MAX_CONCURRENT_RUNS,
      },
      maxRetries: MAX_RETRIES,
      maxCapacity: MAX_CAPACITY,
      timeout: TIMEOUT,
      glueVersion: GLUE_VER,
      defaultArguments: {
        "--additional-python-modules": "sentence-transformers",
        "library-set": "analytics",
        "--BUCKET_NAME": dataBucket.bucketName,
        "--EMBEDDINGS_BUCKET": embeddingsBucket.bucketName,
        "--PROJECT_DETAILS_WITH_NEW_GRANT_IDS_S3URI": "n/a", // will be filled by the 2nd glue job
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
    glueJob1.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    glueJob2.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    glueJob3.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  }
}
