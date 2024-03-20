import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import * as amplify from "@aws-cdk/aws-amplify-alpha";
import { ApiStack } from "./api-stack";
import { Construct } from "constructs";
import { BuildSpec } from "aws-cdk-lib/aws-codebuild";

export class HostingStack extends Stack {

    constructor (scope: Construct, apiStack: ApiStack, id: string, props?: StackProps) {
        super(scope, id, props);

        const codeProvider = new amplify.GitHubSourceCodeProvider({
            owner: 'UBC-CIC',
            repository: 'tlef-analytics',
            oauthToken: SecretValue.secretsManager('arn:aws:secretsmanager:ca-central-1:683894903214:secret:github-personal-access-token-gxutqj', {
                jsonField: 'my-github-token'
            })
        });

        const buildSpec = BuildSpec.fromSourceFilename("/backend/cdk/amplify/Amplify.yml");

        const amplifyApp = new amplify.App(this, 'MyApp', {
            appName: 'tlef-analytics',
            sourceCodeProvider: codeProvider,
            autoBranchDeletion: true,
            environmentVariables: {
                'REACT_APP_APPSYNC_ENDPOINT': apiStack.getEndpointUrl(),
                'REACT_APP_AWS_REGION': this.region,
                'REACT_APP_COGNITO_IDENTITY_POOL_ID': apiStack.getIdentityPoolId()
            }
        });

        amplifyApp.addBranch('main', {
            branchName: 'main',
            autoBuild: true,
            buildSpec: buildSpec
        });

    }
}