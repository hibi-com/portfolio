import * as command from "@pulumi/command";
import * as pulumi from "@pulumi/pulumi";
import type { InfraConfig } from "../config.js";
import { getBackblazeConfig } from "./secrets.js";

export interface BackblazeConfig {
    applicationKeyId: string;
    applicationKey: pulumi.Output<string>;
    bucketName: string;
    endpoint: string;
}

export interface StorageOutputs {
    bucketName: string;
    endpoint: string;
    region: string;
}

export function createBackblazeBucket(_config: InfraConfig): StorageOutputs {
    const backblazeConfig = getBackblazeConfig();

    const region = backblazeConfig.endpoint.split(".")[1] || "us-west-002";

    new command.local.Command(
        "backblaze-bucket-info",
        {
            create: pulumi.interpolate`echo "Backblaze bucket: ${backblazeConfig.bucketName}"`,
        },
        {
            deleteBeforeReplace: true,
        },
    );

    return {
        bucketName: backblazeConfig.bucketName,
        endpoint: backblazeConfig.endpoint,
        region: region,
    };
}

export function getBackblazeEnvVars(): Record<string, pulumi.Output<string>> {
    const config = getBackblazeConfig();

    return {
        BACKBLAZE_APPLICATION_KEY_ID: pulumi.output(config.applicationKeyId),
        BACKBLAZE_APPLICATION_KEY: config.applicationKey,
        BACKBLAZE_BUCKET_NAME: pulumi.output(config.bucketName),
        BACKBLAZE_ENDPOINT: pulumi.output(config.endpoint),
    };
}
