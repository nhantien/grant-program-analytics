import { Stack, StackProps } from "aws-cdk-lib";
import { VpcStack } from "./vpc-stack";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";

export class HostingStack extends Stack {

    constructor (scope: Stack, id: string, vpcStack: VpcStack, props?: StackProps) {
        super(scope, id, props);

        const vpc = vpcStack.vpc;

        const cluster = new ecs.Cluster(this, "EcsCluster", {
            clusterName: "ecs-cluster",
            vpc: vpc,
        });

        cluster.addCapacity("DefaultAutoScalingGroupCapacity", {
            instanceType: new ec2.InstanceType("t3.micro"),
            desiredCapacity: 2,
        });

        const taskDefinition = new ecs.Ec2TaskDefinition(this, "EcsTaskDefinition");

        const service = new ecs.Ec2Service(this, "EcsService", {
            cluster: cluster,
            taskDefinition: taskDefinition,
            serviceName: "ecs-service",
        });
    }
}