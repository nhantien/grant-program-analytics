import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { VpcStack } from "./vpc-stack";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";

export class HostingStack extends Stack {

    constructor (scope: Stack, id: string, vpcStack: VpcStack, props?: StackProps) {
        super(scope, id, props);

        const vpc = vpcStack.vpc;

        const cluster = new ecs.Cluster(this, "EcsCluster", {
            clusterName: "ecs-cluster",
            vpc: vpc,
        });

        cluster.addCapacity("DefaultAutoScalingGroupCapacity", {
            instanceType: new ec2.InstanceType("t4g.small"),
            desiredCapacity: 2,
            machineImageType: ecs.MachineImageType.BOTTLEROCKET,
        });

        const taskDefinition = new ecs.Ec2TaskDefinition(this, "EcsTaskDefinition");

        const taskDefHealthCheck = {
            command: [ "CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1" ],
            startPeriod: Duration.seconds(30),
        }

        const container = taskDefinition.addContainer("EcsContainer", {
            containerName: "ecs-container",
            // TODO: update image
            image: ecs.ContainerImage.fromRegistry("nginx"),
            healthCheck: taskDefHealthCheck,
            memoryLimitMiB: 1024,
        });

        container.addPortMappings({
            containerPort: 3000,
            protocol: ecs.Protocol.TCP,
        });

        const service = new ecs.Ec2Service(this, "EcsService", {
            serviceName: "ecs-service",
            cluster: cluster,
            taskDefinition: taskDefinition,
        });

        const alb = new elbv2.ApplicationLoadBalancer(this, "Alb", {
            vpc: vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            internetFacing: true,
        });

        const listener = alb.addListener("AlbListener", {
            port: 3000,
            open: true,
        });

        listener.addTargets("EcsTarget", {
            port: 3000,
            targets: [
                service.loadBalancerTarget({
                    containerName: "alb-target",
                    containerPort: 3000,

                })
            ],
            healthCheck: {
                path: "/"
            }
        });


    }
}