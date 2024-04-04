import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import * as amplify from "@aws-cdk/aws-amplify-alpha";
import { ApiStack } from "./api-stack";
import { Construct } from "constructs";
import { BuildSpec } from "aws-cdk-lib/aws-codebuild";
import * as yaml from 'yaml';

export class HostingStack extends Stack {

    constructor(scope: Construct, apiStack: ApiStack, id: string, props?: StackProps) {
        super(scope, id, props);

        const codeProvider = new amplify.GitHubSourceCodeProvider({
            owner: 'UBC-CIC',
            repository: 'tlef-analytics',
            oauthToken: SecretValue.secretsManager('arn:aws:secretsmanager:ca-central-1:683894903214:secret:github-personal-access-token-gxutqj', {
                jsonField: 'my-github-token'
            })
        });

        const fromYaml = yaml.parse(`
        version: 1
        applications:
          - frontend:
              phases:
                preBuild:
                  commands:
                    - npm ci
                build:
                  commands:
                    - npm run build
              artifacts:
                baseDirectory: build
                files:
                  - '**/*'
              cache:
                paths:
                  - node_modules/**/*
            appRoot: frontend
        `);

        const buildSpec = BuildSpec.fromObjectToYaml(fromYaml);

        const amplifyApp = new amplify.App(this, 'MyApp', {
            appName: 'tlef-analytics',
            sourceCodeProvider: codeProvider,
            autoBranchDeletion: true,
            environmentVariables: {
                'REACT_APP_APPSYNC_ENDPOINT': apiStack.getEndpointUrl(),
                'REACT_APP_AWS_REGION': this.region,
                'REACT_APP_COGNITO_IDENTITY_POOL_ID': apiStack.getIdentityPoolId()
            },
            buildSpec: buildSpec
        });

        amplifyApp.addBranch('main', {
            branchName: 'main',
            autoBuild: true,
            buildSpec: buildSpec
        });

    }
}