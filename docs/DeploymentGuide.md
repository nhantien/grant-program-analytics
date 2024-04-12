# Deployment walkthrough

## Table of Contents
- [Requirements](#requirements)
- [Deployment](#deployment)
    - [Step 1: Clone The Repository](#step-1-clone-the-repository)
    - [Step 2: Upload Secrets](#step-2-upload-secrets)
    - [Step 3: CDK Deployment](#step-3-cdk-deployment)

## Requirements
Before you deploy, you must have the following installed on your device.
- [git](https://git-scm.com/downloads)
- [git lfs](https://git-lfs.com/)
- [AWS Account](https://aws.amazon.com/account/)
- [GitHub Account](https://github.com/)
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/cli.html)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Deployment
### Step 1: Clone The Repository
First, clone the GitHub repository onto your machine. To do this:
1. Create a folder on your computer to contain the project code.
2. For an Apple computer, open Terminal. If on a Windows machine, open Command Prompt or Windows Terminal. Enter into the folder you made using the command `cd path/to/folder`. To find the path to a folder on a Mac, right click on the folder and press `Get Info`, then select the whole text found under `Where:` and copy with ⌘C. On Windows (not WSL), enter into the folder on File Explorer and click on the path box (located to the left of the search bar), then copy the whole text that shows up.
3. Clone the GitHub repository by entering the following:
```
git clone https://github.com/UBC-CIC/tlef-analytics
```
The code should now be in the folder you created. Navigate into the root folder containing the entire codebase by running the command:
```
cd tlef-analytics
```

### Step 2: Upload Secrets
You would have to supply your GitHub OAuth token when dpeloying the solution. Run the following command and ensure you replace `<YOUR-GITHUB-TOKEN>` and `<YOUR-PROFILE-NAME>` with your actual GitHub token and the appropriate AWS profile name.
```
aws secretsmanager create-secret \
    --name github-personal-access-token \
    --secret-string "{\"my-github-token\":\"<YOUR-GITHUB-TOKEN>\"}"\
    --profile <YOUR-PROFILE-NAME>
```

### Step 3: CDK Deployment
It's time to set up everything that goes on behind the scenes! For more information on how the backend works, feel free to refer to the Architecture Deep Dive, but an understanding of the backend is not necessary for deployment.

Note this CDK deployment was tested in `ca-central-1` region only.

Open a terminal in the `/backend/cdk` directory.

**Download Requirements**: Install requirements with npm by running `npm install` command.

**Initialize the CDK stacks**(required only if you have not deployed any resources with CDK in this region before)
```
cdk synth --profile <your-profile-name>
cdk bootstrap aws://<YOUR_AWS_ACCOUNT_ID>/<YOUR_ACCOUNT_REGION> --profile <your-profile-name>
```

**Deploy CDK stacks**
You may run the following command to deploy the stacks all at once. Please replace `<profile-name>` with the appropriate AWS profile used earlier.
```
cdk deploy --all --profile <profile-name>
```


**Extra: Taking down the deployed stacks**
To take down the deployed stack for a fresh redeployment in the future, navigate to AWS Cloudformation, click on the stack(s) and hit Delete. Please wait for the stacks in each step to be properly deleted before deleting the stack downstream. The deletion order is as followed:

1. HostingStack
2. ApiStack
3. DatabaseStack