import { Stack, StackProps, Duration } from "aws-cdk-lib";
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

export class ApiStack extends Stack {
    constructor(scope: Stack, id: string, props?: StackProps) {
        super(scope, id, props);

        const api = new appsync.GraphqlApi(this, 'TlefAnalyticsApi', {
            name: 'tlef-analytics-api',
            definition: appsync.Definition.fromFile('./graphql/schema.graphql'),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.API_KEY
                }
            }
        });

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

        const resolver = new lambda.Function(this, 'TlefAnalyticsApiResolver', {
            functionName: 'tlef-analytics-api-resolver',
            runtime: lambda.Runtime.PYTHON_3_11,
            code: lambda.Code.fromAsset('./lambda/api-resolver'),
            handler: 'resolver.lambda_handler',
            architecture: lambda.Architecture.X86_64,
            timeout: Duration.minutes(1),
            role: resolverRole
        });

        const appsyncInvokePolicy = new iam.Policy(this, 'appsyncInvokePolicy', {
            policyName: 'appsyncInvokeAccess',
            statements: [
                new iam.PolicyStatement({
                    actions: [ 'lambda:invokeFunction' ],
                    resources: [ resolver.functionArn ]
                })
            ]
        });

        const lambdaDSRole = new iam.Role(this, 'lambdaDSRole', {
            assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
            roleName: 'lambda-data-source-role',
            
        })

        const lambdaDataSource = new appsync.LambdaDataSource(this, 'TlefAnalyticsLambdaDataSource', {
            api: api,
            lambdaFunction: resolver,
            name: 'tlef-analytics-lambda-data-source',
            // TODO: add IAM role
        });

        const queries = [
            'getFilteredProjects',
            'countDeclinedProjects',
            'countFacultyMembersByStream',
            'countTotalReachByFaculty',
            'getStudentReachInfo',
            'getCoCurricularReachById',
            'countProjectsAndGrants'
        ];

        const addResolver = (query: string) => {
            new appsync.Resolver(this, 'TlefAnalyticsResolverFor' + query, {
                api: api,
                dataSource: lambdaDataSource,
                typeName: 'Query',
                fieldName: query,
                requestMappingTemplate: appsync.MappingTemplate.fromFile('./graphql/request.vtl'),
                responseMappingTemplate: appsync.MappingTemplate.fromFile('./graphql/response.vtl')
            });

            return;
        };

        queries.forEach((query) => {
            addResolver(query);
        });
        
    }
}