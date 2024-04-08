import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as glue from '@aws-cdk/aws-glue-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { CfnCrawler } from "aws-cdk-lib/aws-glue";
import { Construct } from "constructs";


export class DatabaseStack extends Stack {

    private readonly s3Bucket: s3.Bucket;
    private readonly db: glue.Database;
    private readonly tables: { [id: string] : glue.S3Table; };
    private readonly dist: cf.Distribution;

    public getS3BucketName() {
        return this.s3Bucket.bucketName;
    }

    public getDbName() {
        return this.db.databaseName;
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
            databaseName: this.db.databaseName,
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
        const s3DataBucket = new s3.Bucket(this, 'TlefAnalyticsS3Bucket', {
            bucketName: 'tlef-analytics',
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            removalPolicy: RemovalPolicy.DESTROY,
            versioned: true
        });

        const ProductionFolderDeployment = new s3Deploy.BucketDeployment(this, 'ProductionFolderDeployment', {
            sources: [s3Deploy.Source.asset("./bucket_config")],
            destinationBucket: s3DataBucket,
            destinationKeyPrefix: 'production/'
        });

        const StagingCSVFolderDeployment = new s3Deploy.BucketDeployment(this, 'StagingCSVFolderDeployment', {
            sources: [s3Deploy.Source.asset("./bucket_config")],
            destinationBucket: s3DataBucket,
            destinationKeyPrefix: 'staging/csv/'
        });

        const StagingParquetFolderDeployment = new s3Deploy.BucketDeployment(this, 'StagingParquetFolderDeployment', {
            sources: [s3Deploy.Source.asset("./bucket_config")],
            destinationBucket: s3DataBucket,
            destinationKeyPrefix: 'staging/parquet/'
        });

        const RawFolderDeployment = new s3Deploy.BucketDeployment(this, 'RawFolderDeployment', {
            sources: [s3Deploy.Source.asset("./bucket_config")],
            destinationBucket: s3DataBucket,
            destinationKeyPrefix: 'raw/'
        });

        /**
         * S3 image bucket & deployment
         */
        const s3ImageBucket = new s3.Bucket(this, 'TlefAnalyticsS3ImageBucket', {
            bucketName: 'tlef-analytics-image',
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
            removalPolicy: RemovalPolicy.DESTROY,
            versioned: true
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
        const db = new glue.Database(this, 'TlefAnalyticsDatabase', {
            databaseName: 'tlef_analytics'
        });

        this.s3Bucket = s3DataBucket;
        this.db = db;
        this.tables = {};
        this.dist = distribution;

        /**
         * Table definitions
         */
        const projectDetailsTable = new glue.S3Table(this, 'projectDetailsTable', {
            database: db,
            tableName: "project_details",
            columns: [
                {
                    name: 'funding_year',
                    type: glue.Schema.BIG_INT
                },
                {
                    name: 'project_type',
                    type: glue.Schema.STRING
                },
                {
                    name: 'project_id',
                    type: glue.Schema.STRING
                },
                {
                    name: 'project_faculty',
                    type: glue.Schema.STRING
                },
                {
                    name: 'pi_name',
                    type: glue.Schema.STRING
                },
                {
                    name: 'pi_unit',
                    type: glue.Schema.STRING
                },
                {
                    name: 'funding_amount',
                    type: glue.Schema.BIG_INT
                },
                {
                    name: 'title',
                    type: glue.Schema.STRING
                },
                {
                    name: 'summary',
                    type: glue.Schema.STRING
                },
                {
                    name: 'co_applicants',
                    type: glue.Schema.STRING
                },
                {
                    name: 'project_year',
                    type: glue.Schema.BIG_INT
                },
                {
                    name: 'grant_id',
                    type: glue.Schema.STRING
                }
            ],
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/project_details'
        });
        this.tables['project_details'] = projectDetailsTable;

        const facultyEngagementTable = new glue.S3Table(this, 'facultyEngagementTable', {
            database: db,
            tableName: 'faculty_engagement',
            columns: [
                {
                    name: 'funding_year',
                    type: glue.Schema.BIG_INT
                },
                {
                    name: 'project_type',
                    type: glue.Schema.STRING
                },
                {
                    name: 'project_id',
                    type: glue.Schema.STRING
                },
                {
                    name: 'grant_id',
                    type: glue.Schema.STRING
                },
                {
                    name: 'project_faculty',
                    type: glue.Schema.STRING
                },
                {
                    name: 'member_name',
                    type: glue.Schema.STRING
                },
                {
                    name: 'member_title',
                    type: glue.Schema.STRING
                },
                {
                    name: 'member_stream',
                    type: glue.Schema.STRING
                },
                {
                    name: 'member_campus',
                    type: glue.Schema.STRING
                },
                {
                    name: 'member_faculty',
                    type: glue.Schema.STRING
                },
                {
                    name: 'member_unit',
                    type: glue.Schema.STRING
                },
                {
                    name: 'member_other',
                    type: glue.Schema.STRING
                }
            ],
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/faculty_engagement'
        });
        this.tables['faculty_engagement'] = facultyEngagementTable;

        const studentReachTable = new glue.S3Table(this, 'studentReachTable', {
            database: db,
            tableName: 'student_reach',
            columns: [
                {
                    name: 'funding_year',
                    type: glue.Schema.BIG_INT
                },
                {
                    name: 'project_type',
                    type: glue.Schema.STRING
                },
                {
                    name: 'project_id',
                    type: glue.Schema.STRING
                },
                {
                    name: 'grant_id',
                    type: glue.Schema.STRING
                },
                {
                    name: 'project_faculty',
                    type: glue.Schema.STRING
                },
                {
                    name: 'course_type',
                    type: glue.Schema.STRING
                },
                {
                    name: 'session',
                    type: glue.Schema.STRING
                },
                {
                    name: 'term',
                    type: glue.Schema.STRING
                },
                {
                    name: 'course_faculty',
                    type: glue.Schema.STRING
                },
                {
                    name: 'course_name',
                    type: glue.Schema.STRING
                },
                {
                    name: 'section',
                    type: glue.Schema.STRING
                },
                {
                    name: 'credits',
                    type: glue.Schema.DOUBLE
                },
                {
                    name: 'reach',
                    type: glue.Schema.BIG_INT
                },
                {
                    name: 'fte',
                    type: glue.Schema.DOUBLE
                }
            ],
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/student_reach'
        });
        this.tables['student_reach'] = studentReachTable;
        
        const focusAreaTable = new glue.S3Table(this, 'focusAreaTable', {
            database: db,
            tableName: 'focus_area',
            columns: [
                {
                    name: 'funding_year',
                    type: glue.Schema.BIG_INT
                },
                {
                    name: 'project_type',
                    type: glue.Schema.STRING
                },
                {
                    name: 'grant_id',
                    type: glue.Schema.STRING
                },
                {
                    name: 'title',
                    type: glue.Schema.STRING
                },
                {
                    name: 'pi_name',
                    type: glue.Schema.STRING
                },
                {
                    name: 'project_faculty',
                    type: glue.Schema.STRING
                },
                {
                    name: 'funding_amount',
                    type: glue.Schema.STRING
                },
                {
                    name: 'funding_status',
                    type: glue.Schema.STRING
                },
                {
                    name: 'project_id',
                    type: glue.Schema.STRING
                },
                {
                    name: 'resource_development',
                    type: glue.Schema.BOOLEAN
                },
                {
                    name: 'infrastructure_development',
                    type: glue.Schema.BOOLEAN
                },
                {
                    name: 'student_engagement',
                    type: glue.Schema.BOOLEAN
                },
                {
                    name: 'innovative_assessments',
                    type: glue.Schema.BOOLEAN
                },
                {
                    name: 'teaching_roles_and_training',
                    type: glue.Schema.BOOLEAN
                },
                {
                    name: 'curriculum',
                    type: glue.Schema.BOOLEAN
                },
                {
                    name: 'student_experience',
                    type: glue.Schema.BOOLEAN
                },
                {
                    name: 'work_integrated_learning',
                    type: glue.Schema.BOOLEAN
                },
                {
                    name: 'indigenous_focused_curricula',
                    type: glue.Schema.BOOLEAN
                },
                {
                    name: 'diversity_and_inclusion',
                    type: glue.Schema.BOOLEAN
                },
                {
                    name: 'open_educational_resources',
                    type: glue.Schema.BOOLEAN
                }
            ],
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/focus_area'
        });
        this.tables['focus_area'] = focusAreaTable;

        const coCurricularReachTable = new glue.S3Table(this, 'coCurricularReachTable', {
            database: db,
            tableName: 'co_curricular_reach',
            columns: [
                {
                    name: 'funding_year',
                    type: glue.Schema.BIG_INT
                },
                {
                    name: 'grant_id',
                    type: glue.Schema.STRING
                },
                {
                    name: 'estimated_reach',
                    type: glue.Schema.STRING
                },
                {
                    name: 'description',
                    type: glue.Schema.STRING
                }
            ],
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/co_curricular_reach'
        });
        this.tables['co_curricular_reach'] = coCurricularReachTable;

        const uniqueStudentTable = new glue.S3Table(this, 'UniqueStudentTable', {
            database: db,
            tableName: 'unique_student',
            columns: [
                {
                    name: 'funding_year',
                    type: glue.Schema.BIG_INT
                },
                {
                    name: 'unique_student',
                    type: glue.Schema.DOUBLE
                },
                {
                    name: 'funding_amount',
                    type: glue.Schema.DOUBLE
                }
            ],
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/unique_student'
        });
        this.tables['unique_student'] = uniqueStudentTable;

        const facultyOptionTable = new glue.S3Table(this, 'FacultyOptionTable', {
            database: db,
            tableName: 'faculty_options',
            columns: [
                {
                    name: 'faculty_name',
                    type: glue.Schema.STRING
                },
                {
                    name: 'faculty_code',
                    type: glue.Schema.STRING
                }
            ],
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/options/faculties'
        });
        this.tables['faculty_option'] = facultyOptionTable;
        
        const focusAreaOptionTable = new glue.S3Table(this, 'FocusAreaTable', {
            database: db,
            tableName: 'focus_area_options',
            columns: [
                {
                    name: 'label',
                    type: glue.Schema.STRING
                },
                {
                    name: 'value',
                    type: glue.Schema.STRING
                }
            ],
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/options/focus_area'
        });
        this.tables['focus_area_option'] = focusAreaOptionTable;

        const unsuccessfulProjectsTable = new glue.S3Table(this, 'UnsuccessfulProjectsTable', {
            database: db,
            tableName: 'unsuccessful_projects',
            columns: [
                {
                    name: 'funding_year',
                    type: glue.Schema.BIG_INT
                },
                {
                    name: 'project_type',
                    type: glue.Schema.STRING
                },
                {
                    name: 'grant_id',
                    type: glue.Schema.STRING
                },
                {
                    name: 'title',
                    type: glue.Schema.STRING
                },
                {
                    name: 'project_faculty',
                    type: glue.Schema.STRING
                },
                {
                    name: 'pi_name',
                    type: glue.Schema.STRING
                },
                {
                    name: 'project_department',
                    type: glue.Schema.STRING
                }
            ],
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/unsuccessful_projects'
        });
        this.tables['unsuccessful_projects'] = unsuccessfulProjectsTable;

        const similarProjectsTable = new glue.S3Table(this, 'SimilarProjectsTable', {
            database: db,
            tableName: 'similar_projects',
            columns: [
                {
                    name: 'project_key',
                    type: glue.Schema.STRING
                },
                {
                    name: 'similar_projects',
                    type: glue.Schema.STRING
                }
            ],
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3DataBucket,
            s3Prefix: 'production/similar_projects'
        });
        this.tables['similar_projects'] = similarProjectsTable;
    }
}