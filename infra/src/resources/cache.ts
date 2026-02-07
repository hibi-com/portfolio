import * as pulumi from "@pulumi/pulumi";
import * as rediscloud from "@rediscloud/pulumi-rediscloud";
import type { SecretsFromEnv } from "../config.js";
import { getProjectName } from "../config.js";

export interface RedisOutputs {
    subscription?: rediscloud.Subscription;
    database?: rediscloud.SubscriptionDatabase;
    connectionString: pulumi.Output<string>;
}

export function createPortfolioRedisConfig(secrets?: SecretsFromEnv, provider?: rediscloud.Provider): RedisOutputs {
    const projectName = getProjectName();
    const region = "ap-northeast-1";
    const pulumiConfig = new pulumi.Config();

    const skipRedisCloud = pulumiConfig.getBoolean("skipRedisCloud") ?? false;

    if (skipRedisCloud) {
        const connectionString =
            secrets?.CACHE_URL?.apply((url: string) => {
                if (url && url.trim() !== "") {
                    return url;
                }
                return "";
            }) ?? pulumi.output("");

        return {
            connectionString,
        };
    }

    const paymentMethodIdFromConfig = pulumiConfig.get("rediscloudPaymentMethodId");

    const subscriptionArgs: rediscloud.SubscriptionArgs = {
        name: `${projectName}-subscription`,
        cloudProvider: {
            provider: "AWS",
            regions: [
                {
                    region: region,
                    multipleAvailabilityZones: false,
                    networkingDeploymentCidr: "10.0.0.0/24",
                },
            ],
        },
        memoryStorage: "ram",
        creationPlan: {
            memoryLimitInGb: 0.03,
            quantity: 1,
            replication: false,
            throughputMeasurementBy: "operations-per-second",
            throughputMeasurementValue: 1000,
        },
    };

    if (paymentMethodIdFromConfig) {
        subscriptionArgs.paymentMethod = "credit-card";
        subscriptionArgs.paymentMethodId = paymentMethodIdFromConfig;
    } else {
        subscriptionArgs.paymentMethod = "marketplace";
    }

    const subscription = new rediscloud.Subscription(
        `${projectName}-redis-subscription`,
        subscriptionArgs,
        provider ? { provider } : undefined,
    );

    const database = new rediscloud.SubscriptionDatabase(
        `${projectName}-redis-db`,
        {
            subscriptionId: subscription.id,
            name: `${projectName}-cache`,
            protocol: "redis",
            memoryLimitInGb: 0.03,
            dataPersistence: "none",
            throughputMeasurementBy: "operations-per-second",
            throughputMeasurementValue: 1000,
            replication: false,
        },
        provider ? { provider } : undefined,
    );

    const connectionString =
        secrets?.CACHE_URL?.apply((url: string) => {
            if (url && url.trim() !== "") {
                return url;
            }
            return "";
        }) ?? pulumi.output("");

    const generatedConnectionString = pulumi
        .all([database.publicEndpoint, database.password])
        .apply(([endpoint, password]) => {
            if (!endpoint) {
                return "";
            }
            const [host, port] = endpoint.includes(":") ? endpoint.split(":") : [endpoint, "6379"];
            if (password) {
                return `redis://:${password}@${host}:${port}`;
            }
            return `redis://${host}:${port}`;
        });
    const finalConnectionString = pulumi
        .all([connectionString, generatedConnectionString])
        .apply(([existingUrl, generatedUrl]) => {
            if (existingUrl && existingUrl.trim() !== "") {
                return existingUrl;
            }
            return generatedUrl;
        });

    return {
        subscription,
        database,
        connectionString: finalConnectionString,
    };
}
