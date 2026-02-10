import * as command from "@pulumi/command";
import * as pulumi from "@pulumi/pulumi";

export interface TiDBCloudServerlessClusterOutputs {
    createCommand: command.local.Command;
    clusterId: pulumi.Output<string>;
    connectionString: pulumi.Output<string>;
    host: pulumi.Output<string>;
    status: pulumi.Output<string>;
}

export function createTiDBCloudServerlessCluster(
    name: string,
    args: {
        displayName: string;
        region: string;
        spendingLimitMonthly?: number;
        publicKey: pulumi.Input<string>;
        privateKey: pulumi.Input<string>;
    },
    opts?: pulumi.CustomResourceOptions,
): TiDBCloudServerlessClusterOutputs {
    const baseUrl = "https://serverless.tidbapi.com";

    const createClusterCommand = new command.local.Command(
        `${name}-create`,
        {
            create: pulumi.all([args.publicKey, args.privateKey]).apply(([publicKey, privateKey]) => {
                const payload = JSON.stringify({
                    displayName: args.displayName,
                    region: {
                        name: `regions/aws-${args.region}`,
                    },
                    spendingLimit: {
                        monthly: args.spendingLimitMonthly ?? 0,
                    },
                });

                return String.raw`curl -s --digest -u "${publicKey}:${privateKey}" \
                        -X POST "${baseUrl}/v1beta1/clusters" \
                        -H "Content-Type: application/json" \
                        -d '${payload}'`;
            }),
        },
        opts,
    );

    const clusterId: pulumi.Output<string> = createClusterCommand.stdout.apply((stdout): string => {
        try {
            const response = JSON.parse(stdout);
            return (response.clusterId as string) ?? "";
        } catch {
            return "";
        }
    });

    const host: pulumi.Output<string> = createClusterCommand.stdout.apply((stdout): string => {
        try {
            const response = JSON.parse(stdout);
            const publicHost = response.endpoints?.public?.host as string | undefined;
            if (publicHost) {
                return publicHost;
            }
            return `gateway01.${args.region}.prod.aws.tidbcloud.com`;
        } catch {
            return `gateway01.${args.region}.prod.aws.tidbcloud.com`;
        }
    });

    const connectionString: pulumi.Output<string> = pulumi
        .all([createClusterCommand.stdout, host])
        .apply(([stdout, hostValue]): string => {
            try {
                const response = JSON.parse(stdout);
                const userPrefix = response.userPrefix as string | undefined;
                const port = response.endpoints?.public?.port ?? 4000;
                if (userPrefix && hostValue) {
                    return `mysql://${userPrefix}:<password>@${hostValue}:${port}/?ssl-mode=VERIFY_IDENTITY`;
                }
                return "";
            } catch {
                return "";
            }
        });

    const status: pulumi.Output<string> = createClusterCommand.stdout.apply((stdout): string => {
        try {
            const response = JSON.parse(stdout);
            return (response.state as string) ?? "UNKNOWN";
        } catch {
            return "UNKNOWN";
        }
    });

    return {
        createCommand: createClusterCommand,
        clusterId,
        connectionString,
        host,
        status,
    };
}
