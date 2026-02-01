import * as pulumi from "@pulumi/pulumi";
import * as doppler from "@pulumiverse/doppler";

const config = new pulumi.Config();

export interface DopplerSettings {
    project: string;
    config: string;
}

export function getDopplerSettings(): DopplerSettings {
    return {
        project: config.require("dopplerProject"),
        config: config.require("dopplerConfig"),
    };
}

export function getProjectName(): string {
    return config.require("dopplerProject");
}

export function getDopplerSecrets() {
    const settings = getDopplerSettings();

    const secrets = doppler.getSecretsOutput({
        project: settings.project,
        config: settings.config,
    });

    return {
        DATABASE_URL: secrets.apply((s) => {
            if (!s.map.DATABASE_URL) {
                return "";
            }
            const value = s.map.DATABASE_URL;
            if (value.toLowerCase().includes("localhost")) {
                throw new Error("DATABASE_URLにlocalhostが含まれています。本番環境では使用できません。");
            }
            return value;
        }),
        REDIS_URL: secrets.apply((s) => {
            if (!s.map.REDIS_URL) {
                return "";
            }
            const value = s.map.REDIS_URL;
            if (value.toLowerCase().includes("localhost")) {
                throw new Error("REDIS_URLにlocalhostが含まれています。本番環境では使用できません。");
            }
            return value;
        }),
        REDISCLOUD_SUBSCRIPTION_ID: secrets.apply((s) => {
            return s.map.REDISCLOUD_SUBSCRIPTION_ID || "";
        }),
        REDISCLOUD_DATABASE_ID: secrets.apply((s) => {
            return s.map.REDISCLOUD_DATABASE_ID || "";
        }),
        CLOUDFLARE_API_TOKEN: secrets.apply((s) => {
            if (!s.map.CLOUDFLARE_API_TOKEN) throw new Error("CLOUDFLARE_API_TOKEN not found in Doppler");
            return s.map.CLOUDFLARE_API_TOKEN;
        }),
        CLOUDFLARE_ACCOUNT_ID: secrets.apply((s) => {
            if (!s.map.CLOUDFLARE_ACCOUNT_ID) throw new Error("CLOUDFLARE_ACCOUNT_ID not found in Doppler");
            return s.map.CLOUDFLARE_ACCOUNT_ID;
        }),
        CLOUDFLARE_ZONE_ID: secrets.apply((s) => {
            if (!s.map.CLOUDFLARE_ZONE_ID) throw new Error("CLOUDFLARE_ZONE_ID not found in Doppler");
            return s.map.CLOUDFLARE_ZONE_ID;
        }),
        GRAFANA_API_KEY: secrets.apply((s) => {
            if (!s.map.GRAFANA_API_KEY) throw new Error("GRAFANA_API_KEY not found in Doppler");
            return s.map.GRAFANA_API_KEY;
        }),
        GRAFANA_ORG_SLUG: secrets.apply((s) => {
            if (!s.map.GRAFANA_ORG_SLUG) throw new Error("GRAFANA_ORG_SLUG not found in Doppler");
            return s.map.GRAFANA_ORG_SLUG;
        }),
        SENTRY_AUTH_TOKEN: secrets.apply((s) => {
            if (!s.map.SENTRY_AUTH_TOKEN) throw new Error("SENTRY_AUTH_TOKEN not found in Doppler");
            return s.map.SENTRY_AUTH_TOKEN;
        }),
        SENTRY_ORG: secrets.apply((s) => {
            if (!s.map.SENTRY_ORG) throw new Error("SENTRY_ORG not found in Doppler");
            return s.map.SENTRY_ORG;
        }),
        SENTRY_DSN: secrets.apply((s) => {
            if (!s.map.SENTRY_DSN) throw new Error("SENTRY_DSN not found in Doppler");
            return s.map.SENTRY_DSN;
        }),
        BETTER_AUTH_SECRET: secrets.apply((s) => {
            if (!s.map.BETTER_AUTH_SECRET) throw new Error("BETTER_AUTH_SECRET not found in Doppler");
            return s.map.BETTER_AUTH_SECRET;
        }),
        GOOGLE_CLIENT_ID: secrets.apply((s) => {
            if (!s.map.GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID not found in Doppler");
            return s.map.GOOGLE_CLIENT_ID;
        }),
        GOOGLE_CLIENT_SECRET: secrets.apply((s) => {
            if (!s.map.GOOGLE_CLIENT_SECRET) throw new Error("GOOGLE_CLIENT_SECRET not found in Doppler");
            return s.map.GOOGLE_CLIENT_SECRET;
        }),
        REDISCLOUD_ACCESS_KEY: secrets.apply((s) => {
            if (!s.map.REDISCLOUD_ACCESS_KEY) throw new Error("REDISCLOUD_ACCESS_KEY not found in Doppler");
            return s.map.REDISCLOUD_ACCESS_KEY;
        }),
        REDISCLOUD_SECRET_KEY: secrets.apply((s) => {
            if (!s.map.REDISCLOUD_SECRET_KEY) throw new Error("REDISCLOUD_SECRET_KEY not found in Doppler");
            return s.map.REDISCLOUD_SECRET_KEY;
        }),
        TIDBCLOUD_PUBLIC_KEY: secrets.apply((s) => {
            return s.map.TIDBCLOUD_PUBLIC_KEY || "";
        }),
        TIDBCLOUD_PRIVATE_KEY: secrets.apply((s) => {
            return s.map.TIDBCLOUD_PRIVATE_KEY || "";
        }),
        API_BASE_URL: secrets.apply((s) => {
            return s.map.API_BASE_URL || "";
        }),
        APP_VERSION: secrets.apply((s) => {
            return s.map.APP_VERSION || "";
        }),
        BETTER_AUTH_URL: secrets.apply((s) => {
            return s.map.BETTER_AUTH_URL || "";
        }),
        VITE_BASE_URL: secrets.apply((s) => {
            return s.map.VITE_BASE_URL || "";
        }),
        VITE_GOOGLE_ANALYTICS_ENABLED: secrets.apply((s) => {
            return s.map.VITE_GOOGLE_ANALYTICS_ENABLED || "";
        }),
        VITE_GOOGLE_TAG_MANAGER_ENABLED: secrets.apply((s) => {
            return s.map.VITE_GOOGLE_TAG_MANAGER_ENABLED || "";
        }),
        VITE_SENTRY_ENVIRONMENT: secrets.apply((s) => {
            return s.map.VITE_SENTRY_ENVIRONMENT || "";
        }),
        VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE: secrets.apply((s) => {
            return s.map.VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE || "";
        }),
        VITE_SENTRY_REPLAY_SAMPLE_RATE: secrets.apply((s) => {
            return s.map.VITE_SENTRY_REPLAY_SAMPLE_RATE || "";
        }),
        VITE_SENTRY_TRACES_SAMPLE_RATE: secrets.apply((s) => {
            return s.map.VITE_SENTRY_TRACES_SAMPLE_RATE || "";
        }),
        VITE_XSTATE_INSPECTOR_ENABLED: secrets.apply((s) => {
            return s.map.VITE_XSTATE_INSPECTOR_ENABLED || "";
        }),
    };
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
    grafana: {
        apiKey: pulumi.Output<string>;
        orgSlug: pulumi.Output<string> | string;
        stackSlug: string;
    };
    sentry: {
        authToken: pulumi.Output<string>;
        org: pulumi.Output<string> | string;
    };
}

export function getConfig(customSecrets?: ReturnType<typeof getDopplerSecrets>): InfraConfig {
    const environment = config.require("environment");
    const secrets = customSecrets ?? getDopplerSecrets();

    return {
        environment,
        cloudflare: {
            apiToken: secrets.CLOUDFLARE_API_TOKEN,
            accountId: secrets.CLOUDFLARE_ACCOUNT_ID,
            zoneId: secrets.CLOUDFLARE_ZONE_ID,
            domain: config.require("domain"),
            protocol: config.get("protocol") || "https",
        },
        grafana: {
            apiKey: secrets.GRAFANA_API_KEY,
            orgSlug: secrets.GRAFANA_ORG_SLUG,
            stackSlug: config.require("slug"),
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
        Project: config.require("dopplerProject"),
        ManagedBy: "pulumi",
        Resource: resourceName,
    };
}
