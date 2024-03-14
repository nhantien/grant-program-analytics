import { Stack, StackProps } from "aws-cdk-lib";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from '@aws-cdk/aws-glue-alpha';
import * as athena from 'aws-cdk-lib/aws-athena';


export class DatabaseStack extends Stack {

    private readonly s3Bucket: s3.Bucket;
    private readonly db: glue.Database;

    getS3BucketArn() {
        return this.s3Bucket.bucketArn;
    }

    getDbName() {
        return this.db.databaseName;
    }

    constructor(scope: Stack, id: string, props?: StackProps) {
        super(scope, id, props);

        // s3 bucket
        const s3Bucket = new s3.Bucket(this, 'TlefAnalyticsS3Bucket', {
            bucketName: 'tlef-analytics',
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            encryption: s3.BucketEncryption.S3_MANAGED,
        });

        const db = new glue.Database(this, 'TlefAnalyticsDatabase', {
            databaseName: 'tlef_analytics'
        });

        this.s3Bucket = s3Bucket;
        this.db = db;

        /* ---- TABLES ---- */
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
                    name: 'grant_id',
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
                    type: glue.Schema.STRING
                }
            ],
            dataFormat: glue.DataFormat.PARQUET,
            bucket: s3Bucket,
            s3Prefix: '/src/project-details'
        });

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
            bucket: s3Bucket,
            s3Prefix: '/src/faculty-engagement'
        });

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
            bucket: s3Bucket,
            s3Prefix: '/src/student-reach'
        });

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
            bucket: s3Bucket,
            s3Prefix: '/src/focus-area'
        });

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
            bucket: s3Bucket,
            s3Prefix: '/src/co-curricular-reach'
        });

    }
}