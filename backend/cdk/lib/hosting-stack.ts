import { Duration, SecretValue, Stack, StackProps } from "aws-cdk-lib";
import { VpcStack } from "./vpc-stack";
import * as amplify from "@aws-cdk/aws-amplify-alpha";

export class HostingStack extends Stack {

    constructor (scope: Stack, id: string, props?: StackProps) {
        super(scope, id, props);

        const codeProvider = new amplify.GitHubSourceCodeProvider({
            owner: "UBC-CIC",
            repository: "https://github.com/UBC-CIC/tlef-analytics",
            oauthToken: SecretValue.secretsManager('arn:aws:secretsmanager:ca-central-1:683894903214:secret:github-personal-access-token-gxutqj')
        });

        const amplifyApp = new amplify.App(this, 'MyApp', {
            appName: 'tlef-analytics',
            sourceCodeProvider: codeProvider,
            autoBranchDeletion: true
        });

    }
}