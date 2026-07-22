import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

export function getSecretsFromEnv() {
    const env = process.env;

    const get = (key: string): pulumi.Output<string> => pulumi.output(env[key] ?? "");

    const getRequired = (key: string, message: string): pulumi.Output<string> =>
        pulumi.output(env[key] ?? "").apply((v) => {
            if (!v || v.trim() === "") throw new Error(message);
            return v;
        });

    return {
        CLOUDFLARE_API_TOKEN: getRequired("CLOUDFLARE_API_TOKEN", "CLOUDFLARE_API_TOKEN not found in environment"),
        CLOUDFLARE_ACCOUNT_ID: getRequired("CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_ACCOUNT_ID not found in environment"),
        CLOUDFLARE_ZONE_ID: getRequired("CLOUDFLARE_ZONE_ID", "CLOUDFLARE_ZONE_ID not found in environment"),
        SENTRY_AUTH_TOKEN: getRequired("SENTRY_AUTH_TOKEN", "SENTRY_AUTH_TOKEN not found in environment"),
        SENTRY_ORG: getRequired("SENTRY_ORG", "SENTRY_ORG not found in environment"),
        SENTRY_DSN: get("SENTRY_DSN"),
        BETTER_AUTH_SECRET: get("BETTER_AUTH_SECRET"),
        GOOGLE_CLIENT_ID: get("GOOGLE_CLIENT_ID"),
        GOOGLE_CLIENT_SECRET: get("GOOGLE_CLIENT_SECRET"),
        API_BASE_URL: get("API_BASE_URL"),
        APP_VERSION: get("APP_VERSION"),
        BETTER_AUTH_URL: get("BETTER_AUTH_URL"),
        VITE_BASE_URL: get("VITE_BASE_URL"),
        VITE_GOOGLE_ANALYTICS_ENABLED: get("VITE_GOOGLE_ANALYTICS_ENABLED"),
        VITE_GOOGLE_TAG_MANAGER_ENABLED: get("VITE_GOOGLE_TAG_MANAGER_ENABLED"),
        VITE_SENTRY_ENVIRONMENT: get("VITE_SENTRY_ENVIRONMENT"),
        VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE: get("VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE"),
        VITE_SENTRY_REPLAY_SAMPLE_RATE: get("VITE_SENTRY_REPLAY_SAMPLE_RATE"),
        VITE_SENTRY_TRACES_SAMPLE_RATE: get("VITE_SENTRY_TRACES_SAMPLE_RATE"),
        VITE_XSTATE_INSPECTOR_ENABLED: get("VITE_XSTATE_INSPECTOR_ENABLED"),
    };
}

export function getProjectName(): string {
    return config.require("projectName");
}

export interface InfraConfig {
    environment: string;
    cloudflare: {
        apiToken: pulumi.Output<string>;
        accountId: pulumi.Output<string> | string;
        zoneId: pulumi.Output<string> | string;
        domain: string;
        protocol?: string;
    };
    sentry: {
        authToken: pulumi.Output<string>;
        org: pulumi.Output<string> | string;
    };
}

export type SecretsFromEnv = ReturnType<typeof getSecretsFromEnv>;

export function getConfig(secrets: SecretsFromEnv): InfraConfig {
    const environment = config.require("environment");

    return {
        environment,
        cloudflare: {
            apiToken: secrets.CLOUDFLARE_API_TOKEN,
            accountId: secrets.CLOUDFLARE_ACCOUNT_ID,
            zoneId: secrets.CLOUDFLARE_ZONE_ID,
            domain: config.require("domain"),
            protocol: config.get("protocol") || "https",
        },
        sentry: {
            authToken: secrets.SENTRY_AUTH_TOKEN,
            org: secrets.SENTRY_ORG,
        },
    };
}

export function getTags(resourceName: string): Record<string, string> {
    const environment = config.require("environment");
    return {
        Environment: environment,
        Project: config.require("projectName"),
        ManagedBy: "pulumi",
        Resource: resourceName,
    };
}
