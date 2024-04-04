import { Stack, StackProps, Duration } from "aws-cdk-lib";
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IdentityPool } from "@aws-cdk/aws-cognito-identitypool-alpha";
import { DatabaseStack } from "./database-stack";
import { Construct } from "constructs";

export class ApiStack extends Stack {

    private readonly idPool: IdentityPool;
    private readonly api: appsync.GraphqlApi;
    private readonly resolverRole: iam.Role;

    getEndpointUrl() {
        return this.api.graphqlUrl;
    }

    getIdentityPoolId() {
        return this.idPool.identityPoolId;
    }

    private assignResolver(query: string, ds: appsync.LambdaDataSource) {
        new appsync.Resolver(this, 'TlefAnalyticsResolverFor' + query, {
            api: this.api,
            dataSource: ds,
            typeName: 'Query',
            fieldName: query,
            requestMappingTemplate: appsync.MappingTemplate.fromFile('./graphql/request.vtl'),
            responseMappingTemplate: appsync.MappingTemplate.fromFile('./graphql/response.vtl')
        });

        return;
    }

    private createResolver(folderName: string, queries: string[], env: {[key: string] : string} ) {

        const resolver = new lambda.Function(this, `${folderName}-resolver`, {
            functionName: `tlef-analytics-${folderName}-resolver`,
            runtime: lambda.Runtime.PYTHON_3_11,
            code: lambda.Code.fromAsset(`./lambda/${folderName}`),
            handler: 'resolver.lambda_handler',
            architecture: lambda.Architecture.X86_64,
            timeout: Duration.minutes(1),
            role: this.resolverRole,
            environment: env
        });

        const lambdaDSPolicy = new iam.PolicyDocument({
            statements: [new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                    "lambda:invokeFunction"
                ],
                resources: [
                    resolver.functionArn,
                    `${resolver.functionArn}:*`
                ]
            })]
        });

        const lambdaDSRole = new iam.Role(this, `lambda-${folderName}-ds-role`, {
            assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
            roleName: `lambda-${folderName}-data-source-role`,
            inlinePolicies: {
                "AppSyncDSLambdaPolicy": lambdaDSPolicy
            }
        });

        const lambdaDataSource = new appsync.LambdaDataSource(this, `${folderName}-lambda-data-source`, {
            api: this.api,
            lambdaFunction: resolver,
            name: `${folderName}-lambda-data-source`,
            // serviceRole: lambdaDSRole
        });

        queries.forEach(query => this.assignResolver(query, lambdaDataSource));
    }

    constructor(scope: Construct, databaseStack: DatabaseStack, id: string, props?: StackProps) {
        super(scope, id, props);

        const api = new appsync.GraphqlApi(this, 'TlefAnalyticsApi', {
            name: 'tlef-analytics-api',
            definition: appsync.Definition.fromFile('./graphql/schema.graphql'),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.IAM
                }
            }
        });

        this.api = api;

        const appSyncInvokePolicy = new iam.PolicyDocument({
            statements: [new iam.PolicyStatement({
                actions: [
                    "appsync:GraphQL",
                ],
                resources: [`${api.arn}/*`],
            })],
        });

        const unauthenticatedPolicy = new iam.PolicyDocument({
            statements: [new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: [
                    "cognito-identity:GetCredentialsForIdentity"
                ],
                resources: ["*"]
            })]
        });

        const guestRole = new iam.Role(this, 'TlefGuestAccessRole', {
            assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com'),
            roleName: 'tlef-analytics-guest-role',
            inlinePolicies: {
                "AppSyncInvokePolicy": appSyncInvokePolicy,
                "UnauthenticatedPolicy": unauthenticatedPolicy
            }
        });

        const identityPool = new IdentityPool(this, 'TlefIdPool', {
            identityPoolName: 'tlef-identity-pool',
            allowUnauthenticatedIdentities: true,
            unauthenticatedRole: guestRole
        });

        this.idPool = identityPool;

        const resolverRole = new iam.Role(this, 'TlefAnalyticsResolverRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            roleName: 'tlef-analytics-resolver-role',
            managedPolicies: [
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonAthenaFullAccess'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AwsAppSyncAdministrator'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AwsAppSyncInvokeFullAccess'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AwsGlueConsoleFullAccess'),
            ],
            description: 'IAM role for the lambda resolver function'
        });

        this.resolverRole = resolverRole;

        const env = {
            'DB_NAME': databaseStack.getDbName(),
            'OUTPUT_LOCATION': `s3://${databaseStack.getS3BucketName()}/result/`,
            'PROJECT_DETAILS': databaseStack.getTableName('project_details'),
            'FACULTY_OPTION': databaseStack.getTableName('faculty_option'),
            'FOCUS_AREA_OPTION': databaseStack.getTableName('focus_area_option'),
            'UNSUCCESSFUL_PROJECTS': databaseStack.getTableName('unsuccessful_projects'),
            'FOCUS_AREA': databaseStack.getTableName('focus_area'),
            'CO_CURRICULAR_REACH': databaseStack.getTableName('co_curricular_reach'),
            'FACULTY_ENGAGEMENT': databaseStack.getTableName('faculty_engagement'),
            'STUDENT_REACH': databaseStack.getTableName('student_reach'),
            'SIMILAR_PROJECTS': databaseStack.getTableName('similar_projects'),
            'UNIQUE_STUDENT': databaseStack.getTableName('unique_student')
        };

        this.createResolver('homepage', ['getFilteredProposals'], env);
        this.createResolver('options', ['loadFaculty', 'loadFocusArea'], env);
        this.createResolver('success-rate', ['countDeclinedProjects'], env);
        this.createResolver('projects-and-grants', ['countProjectsAndGrants'], env);
        this.createResolver('summary', ['getIndividualSummaryInfo', 'getTeamMembersByGrantId', 'getStudentReachByGrantId', 'getSimilarProjects'], env);
        this.createResolver('faculty-engagement', ['countFacultyMembersByStream', 'getUniqueStudent'], env);
        this.createResolver('student-reach', ['countTotalReachByFaculty', 'getStudentReachInfo'], env);

    }
}