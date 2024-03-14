import { SecretValue, Stack, StackProps } from "aws-cdk-lib";
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import { ApiStack } from "./api-stack";

export class HostingStack extends Stack {

    constructor (scope: Stack, id: string, apiStack: ApiStack, props?: StackProps) {
        super(scope, id, props);

        const amplifyApp = new amplify.App(this, 'TlefAmplifyApp', {
            appName: 'tlef-amplify-app',
            sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
                owner: 'UBC-CIC',
                repository: 'https://github.com/UBC-CIC/tlef-analytics',
                oauthToken: SecretValue.secretsManager('my-github-token')
            }),
            environmentVariables: {
                'REACT_APP_APPSYNC_ENDPOINT_URL': apiStack.getEndpointUrl(),
                'REACT_APP_AWS_REGION': this.region,
                'RREACT_APP_COGNITO_IDENTITY_POOL_ID': apiStack.getIdentityPoolId()
            }
        });

    }
}