import { Stack, StackProps } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class VpcStack extends Stack {

    public readonly vpc: ec2.Vpc;
    public readonly cidr: string;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.cidr = "10.0.0.0/16";
        this.vpc = new ec2.Vpc(this, "Vpc", {
            ipAddresses: ec2.IpAddresses.cidr(this.cidr),
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: "public-subnet-1",
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    name: "isolated-subnet-1",
                    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
                }
            ],
            gatewayEndpoints: {
                S3: {
                    service: ec2.GatewayVpcEndpointAwsService.S3,
                },
            },
        });
        this.vpc.addFlowLog("vpcFlowLog");

        const defaultSecutiryGroup = ec2.SecurityGroup.fromSecurityGroupId(
            this,
            id,
            this.vpc.vpcDefaultSecurityGroup
        );

        this.vpc.addInterfaceEndpoint("ECR Endpoint", {
            service: ec2.InterfaceVpcEndpointAwsService.ECR,
            subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        });

        this.vpc.addInterfaceEndpoint("ECR Docker Endpoint", {
            service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
            subnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        });
    }
}