import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as glue from '@aws-cdk/aws-glue-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { S3EventSourceV2 } from "aws-cdk-lib/aws-lambda-event-sources";
import { CfnCrawler } from "aws-cdk-lib/aws-glue";
import { Construct } from "constructs";

import * as schemas from '../glue/schema';


export class DatabaseStack extends Stack {

    private readonly s3Bucket: s3.Bucket;
    private readonly imageBucket: s3.Bucket;
    private readonly prodDB: glue.Database;
    private readonly stagingDB: glue.Database;
    private readonly tables: { [id: string] : glue.S3Table; };
    private readonly dist: cf.Distribution;

    public getS3Bucket() {
        return this.s3Bucket;
    }
 
    public getS3BucketName() {
        return this.s3Bucket.bucketName;
    }

    public getS3BucketArn() {
        return this.s3Bucket.bucketArn;
    }

    public getImageBucketName() {
        return this.imageBucket.bucketName;
    }

    public getProdDbName() {
        return this.prodDB.databaseName;
    }

    public getStagingDbName() {
        return this.stagingDB.databaseName;
    }

    public getTableName(key: string) {
        return this.tables[key].tableName;
    }

    public getDomainName() {
        return this.dist.domainName;
    }

    private createCrawler(table: glue.S3Table, id: string, name: string) {

        const crawlerPolicy = new iam.PolicyDocument({
            statements: [new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                    "s3:GetObject",
                    "s3:PutObject"
                ],
                resources: [
                    `${this.s3Bucket.bucketArn}/${table.s3Prefix}/*`
                ]
            })]
        });

        const crawlerRole = new iam.Role(this, `${id}CrawlerRole`, {
            assumedBy: new iam.ServicePrincipal("glue.amazonaws.com"),
            roleName: `${name}_crawler_role`,
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole')
            ],
            inlinePolicies: {
                "projectDetailsPolicy": crawlerPolicy
            }
        });

        const crawlerConfiguration = {
            "Version": 1.0,
            "CrawlerOutput": {
                "Partitions": {
                    "AddOrUpdateBehavior": "InheritFromTable"
                },
                "Tables": {
                    "AddOrUpdateBehavior": "MergeNewColumns"
                }
            }
        };

        const crawler = new CfnCrawler(this, `${id}Crawler`, {
            role: crawlerRole.roleArn,
            name: `${name}_crawler`,
            databaseName: this.prodDB.databaseName,
            targets:{
                s3Targets: [{
                    path: `s3://${this.getS3BucketName()}/${table.s3Prefix}/`
                  }],
            },
            schemaChangePolicy: {
                deleteBehavior: 'LOG',
                updateBehavior: 'LOG'
            },
            configuration: JSON.stringify(crawlerConfiguration)
        });

        return;
    }

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        
        /**
         * S3 dataset bucket & deployments
         */
        const s3DataBucket = new s3.Bucket(this, 'tlef-analytics', {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            removalPolicy: RemovalPolicy.RETAIN,
            versioned: true, 
            enforceSSL: true
        });

        const ProductionFolderDeployment = new s3Deploy.BucketDeployment(this, 'ProductionFolderDeployment', {
            sources: [s3Deploy.Source.asset("./bucket_config")],
            destinationBucket: s3DataBucket,
            destinationKeyPrefix: 'production/'
        });

        const StagingFolderDeployment = new s3Deploy.BucketDeployment(this, 'StagingParquetFolderDeployment', {
            sources: [s3Deploy.Source.asset("./bucket_config")],
            destinationBucket: s3DataBucket,
            destinationKeyPrefix: 'staging/'
        });

        const RawFolderDeployment = new s3Deploy.BucketDeployment(this, 'RawFolderDeployment', {
            sources: [s3Deploy.Source.asset("./bucket_config_raw")],
            destinationBucket: s3DataBucket,
            destinationKeyPrefix: 'raw/'
        });

        const InstitutionDataDeployment = new s3Deploy.BucketDeployment(this, 'InstitutionDataDeployment', {
            sources: [s3Deploy.Source.asset("./INSTITUTION_DATA")],
            destinationBucket: s3DataBucket,
            destinationKeyPrefix: 'INSTITUTION_DATA/'
        });

        /**
         * Lambda function for excel-to-parquet conversion
         */

        const rawFolderUploadEvent = new S3EventSourceV2(s3DataBucket, {
            events: [ s3.EventType.OBJECT_CREATED ],
            filters: [{ prefix: 'raw/' }]
        });

        const excelToParquetConverter = new lambda.Function(this, 'RawToStagingConverter', {
            functionName: 'excel-to-parquet-converter',
            runtime: lambda.Runtime.PYTHON_3_11,
            memorySize: 512,
            code: lambda.Code.fromAsset('./lambda/xlsx-to-parquet'),
            handler: 'lambda_function.lambda_handler',
            architecture: lambda.Architecture.X86_64,
            timeout: Duration.minutes(1),
            environment: {
                'S3_BUCKET_NAME': s3DataBucket.bucketName
            }
        });

        // const converterLogGroup = new logs.LogGroup(this, 'converterLogGroup', {
        //     logGroupName: `/aws/lambda/${excelToParquetConverter.functionName}`,
        // });

        const s3AccessPolicy = new iam.PolicyStatement({
            actions: [
                "s3:*",
                "s3-object-lambda:*"
            ],
            resources: [`${s3DataBucket.bucketArn}/*`]
        });

        excelToParquetConverter.addToRolePolicy(s3AccessPolicy);
        excelToParquetConverter.addLayers(lambda.LayerVersion.fromLayerVersionArn(this, 'AwsPandasLayer', `arn:aws:lambda:${this.region}:336392948345:layer:AWSSDKPandas-Python311:12`));
        excelToParquetConverter.addEventSource(rawFolderUploadEvent);


        /**
         * S3 image bucket & deployment
         */
        const s3ImageBucket = new s3.Bucket(this, 'tlef-analytics-image', {
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            removalPolicy: RemovalPolicy.RETAIN,
            versioned: true, 
            enforceSSL: true
        });

        const ImageBucketDeployment = new s3Deploy.BucketDeployment(this, 'ImageBucketDeployment', {
            sources: [s3Deploy.Source.asset("./bucket_config_img")],
            destinationBucket: s3ImageBucket
        });

        /**
         * CloudFront distribution to access image contents in the bucket
         */
        const distribution = new cf.Distribution(this, 'TlefAnalyticsImageDistribution', {
            defaultBehavior: {
                origin: new origins.S3Origin(s3ImageBucket)
            }
        });

        /**
         * Glue Database definition
         */
        const prodDB = new glue.Database(this, 'TlefAnalyticsDatabase', {
            databaseName: 'tlef_analytics_production'
        });

        const stagingDB = new glue.Database(this, 'TlefAnalyticsStagingDatabase', {
            databaseName: 'tlef_analytics_staging'
        });

        this.s3Bucket = s3DataBucket;
        this.imageBucket = s3ImageBucket;
        this.prodDB = prodDB;
        this.stagingDB = stagingDB;
        this.tables = {};
        this.dist = distribution;

        /**
         * Table definitions
         */
        const projectDetailsProdTable = new glue.S3Table(this, 'projectDetailsProdTable', {
            database: prodDB,
            tableName: "project_details",
            columns: schemas.PROJECT_DETAILS_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/project_details'
        });

        const projectDetailsStagingTable = new glue.S3Table(this, 'projectDetailsStagingTable', {
            database: stagingDB,
            tableName: "project_details",
            columns: schemas.PROJECT_DETAILS_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'staging/project_details'
        });

        const facultyEngagementProdTable = new glue.S3Table(this, 'facultyEngagementProdTable', {
            database: prodDB,
            tableName: 'faculty_engagement',
            columns: schemas.FACULTY_ENGAGEMENT_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/faculty_engagement'
        });

        const facultyEngagementStagingTable = new glue.S3Table(this, 'facultyEngagementStagingTable', {
            database: stagingDB,
            tableName: 'faculty_engagement',
            columns: schemas.FACULTY_ENGAGEMENT_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'staging/faculty_engagement'
        });

        const studentReachProdTable = new glue.S3Table(this, 'studentReachProdTable', {
            database: prodDB,
            tableName: 'student_reach',
            columns: schemas.STUDENT_REACH_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/student_reach'
        });

        const studentReachStagingTable = new glue.S3Table(this, 'studentReachStagingTable', {
            database: stagingDB,
            tableName: 'student_reach',
            columns: schemas.STUDENT_REACH_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'staging/student_reach'
        });
        
        const focusAreaProdTable = new glue.S3Table(this, 'focusAreaProdTable', {
            database: prodDB,
            tableName: 'focus_area',
            columns: schemas.FOCUS_AREA_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/focus_area'
        });

        const focusAreaStagingTable = new glue.S3Table(this, 'focusAreaStagingTable', {
            database: stagingDB,
            tableName: 'focus_area',
            columns: schemas.FOCUS_AREA_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'staging/focus_area'
        });

        const coCurricularReachProdTable = new glue.S3Table(this, 'coCurricularReachProdTable', {
            database: prodDB,
            tableName: 'co_curricular_reach',
            columns: schemas.CO_CURRICULAR_REACH_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/co_curricular_reach'
        });

        const coCurricularReachStagingTable = new glue.S3Table(this, 'coCurricularReachStagingTable', {
            database: stagingDB,
            tableName: 'co_curricular_reach',
            columns: schemas.CO_CURRICULAR_REACH_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'staging/co_curricular_reach'
        });

        const uniqueStudentProdTable = new glue.S3Table(this, 'UniqueStudentProdTable', {
            database: prodDB,
            tableName: 'unique_student',
            columns: schemas.UNIQUE_STUDENT_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/unique_student'
        });

        const uniqueStudentStagingTable = new glue.S3Table(this, 'UniqueStudentStagingTable', {
            database: stagingDB,
            tableName: 'unique_student',
            columns: schemas.UNIQUE_STUDENT_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'staging/unique_student'
        });

        const facultyOptionProdTable = new glue.S3Table(this, 'FacultyOptionProdTable', {
            database: prodDB,
            tableName: 'faculty_options',
            columns: schemas.FACULTY_OPTIONS_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/options/faculties'
        });

        const facultyOptionStagingTable = new glue.S3Table(this, 'FacultyOptionStagingTable', {
            database: stagingDB,
            tableName: 'faculty_options',
            columns: schemas.FACULTY_OPTIONS_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'staging/options/faculties'
        });
        
        const focusAreaOptionProdTable = new glue.S3Table(this, 'FocusAreaOptionsProdTable', {
            database: prodDB,
            tableName: 'focus_area_options',
            columns: schemas.FOCUS_AREA_OPTIONS_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/options/focus_area'
        });

        const focusAreaOptionStagingTable = new glue.S3Table(this, 'FocusAreaOptionsStagingTable', {
            database: stagingDB,
            tableName: 'focus_area_options',
            columns: schemas.FOCUS_AREA_OPTIONS_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'staging/options/focus_area'
        });

        const unsuccessfulProjectsProdTable = new glue.S3Table(this, 'UnsuccessfulProjectsProdTable', {
            database: prodDB,
            tableName: 'unsuccessful_projects',
            columns: schemas.UNSUCCESSFUL_PROJECTS_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/unsuccessful_projects'
        });

        const unsuccessfulProjectsStagingTable = new glue.S3Table(this, 'UnsuccessfulProjectsStagingTable', {
            database: stagingDB,
            tableName: 'unsuccessful_projects',
            columns: schemas.UNSUCCESSFUL_PROJECTS_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'staging/unsuccessful_projects'
        });

        const similarProjectsProdTable = new glue.S3Table(this, 'SimilarProjectsProdTable', {
            database: prodDB,
            tableName: 'similar_projects',
            columns: schemas.SIMILAR_PROJECTS_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/similar_projects'
        });

        const similarProjectsStagingTable = new glue.S3Table(this, 'SimilarProjectsStagingTable', {
            database: stagingDB,
            tableName: 'similar_projects',
            columns: schemas.SIMILAR_PROJECTS_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'staging/similar_projects'
        });

        const projectOutcomesProdTable = new glue.S3Table(this, 'ProjectOutcomesProdTable', {
            database: prodDB,
            tableName: 'project_outcomes',
            columns: schemas.PROJECT_OUTCOMES_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/project_outcomes'
        });

        const projectOutcomesStagingTable = new glue.S3Table(this, 'ProjectOutcomesStagingTable', {
            database: stagingDB,
            tableName: 'project_outcomes',
            columns: schemas.PROJECT_OUTCOMES_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'staging/project_outcomes'
        });

        const studentEngagementProdTable = new glue.S3Table(this, 'StudentEngagementProdTable', {
            database: prodDB,
            tableName: 'student_engagement',
            columns: schemas.STUDENT_ENGAGEMENT_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/student_engagement'
        });

        const studentEngagementStagingTable = new glue.S3Table(this, 'StudentEngagementStagingTable', {
            database: stagingDB,
            tableName: 'student_engagement',
            columns: schemas.STUDENT_ENGAGEMENT_SCHEMA,
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'staging/student_engagement'
        });

        this.tables['project_details'] = projectDetailsProdTable;
        this.tables['faculty_engagement'] = facultyEngagementProdTable;
        this.tables['student_reach'] = studentReachProdTable;
        this.tables['focus_area'] = focusAreaProdTable;
        this.tables['co_curricular_reach'] = coCurricularReachProdTable;
        this.tables['unique_student'] = uniqueStudentProdTable;
        this.tables['faculty_option'] = facultyOptionProdTable;
        this.tables['focus_area_option'] = focusAreaOptionProdTable;
        this.tables['unsuccessful_projects'] = unsuccessfulProjectsProdTable;
        this.tables['similar_projects'] = similarProjectsProdTable;
        this.tables['project_outcomes'] = projectOutcomesProdTable;
        this.tables['student_engagement'] = studentEngagementProdTable;
    }
}