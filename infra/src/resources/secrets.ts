import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as pulumi from "@pulumi/pulumi";
import YAML from "yaml";
import type { SecretsFromEnv } from "../config.js";

export interface EnvYamlStructure {
    infra?: {
        cloudflare?: {
            accountId?: string;
            apiToken?: string;
            zoneId?: string;
        };
        grafana?: {
            apiKey?: string;
            orgSlug?: string;
        };
        sentry?: {
            authToken?: string;
            org?: string;
        };
        tidb?: {
            publicKey?: string;
            privateKey?: string;
        };
        redis?: {
            accessKey?: string;
            secretKey?: string;
            subscriptionId?: string;
            databaseId?: string;
        };
    };
    secrets?: {
        database?: {
            url?: string;
        };
        cache?: {
            url?: string;
            redisUrl?: string;
        };
        auth?: {
            betterAuthSecret?: string;
            googleClientId?: string;
            googleClientSecret?: string;
        };
        sentry?: {
            dsn?: string;
        };
    };
    apps?: {
        web?: {
            baseUrl?: string;
            vite?: {
                baseUrl?: string;
                sentry?: {
                    environment?: string;
                    tracesSampleRate?: string;
                    replaySampleRate?: string;
                    replayOnErrorSampleRate?: string;
                };
                analytics?: {
                    googleAnalyticsEnabled?: string;
                    googleTagManagerEnabled?: string;
                };
                debug?: {
                    xstateInspectorEnabled?: string;
                };
            };
        };
        admin?: {
            baseUrl?: string;
            betterAuthUrl?: string;
            vite?: {
                sentry?: {
                    environment?: string;
                    tracesSampleRate?: string;
                    replaySampleRate?: string;
                    replayOnErrorSampleRate?: string;
                };
            };
        };
        api?: {
            baseUrl?: string;
        };
        portal?: {
            baseUrl?: string;
        };
    };
    general?: {
        appVersion?: string;
        nodeEnv?: string;
    };
}

export function getCloudflareEnvVars(secrets: SecretsFromEnv): Record<string, pulumi.Output<string>> {
    return {
        DATABASE_URL: secrets.DATABASE_URL,
        CACHE_URL: secrets.CACHE_URL,
        NODE_ENV: pulumi.output("production"),
        SENTRY_DSN: secrets.SENTRY_DSN,
        BETTER_AUTH_SECRET: secrets.BETTER_AUTH_SECRET,
        GOOGLE_CLIENT_ID: secrets.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: secrets.GOOGLE_CLIENT_SECRET,
    };
}

function findProjectRoot(): string {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    let currentDir = path.resolve(__dirname);
    const root = path.resolve("/");

    while (currentDir !== root) {
        const packageJsonPath = path.join(currentDir, "package.json");
        const turboJsonPath = path.join(currentDir, "turbo.json");

        if (fs.existsSync(packageJsonPath) && fs.existsSync(turboJsonPath)) {
            return currentDir;
        }

        currentDir = path.resolve(currentDir, "..");
    }

    const fallbackRoot = path.resolve(__dirname, "../../../..");
    return fallbackRoot;
}

export function getEnvironmentYamlPath(): string {
    return path.join(findProjectRoot(), "infra", "env.yaml");
}

export function parseEnvironmentYaml(environmentYamlPath?: string): EnvYamlStructure {
    const filePath = environmentYamlPath ?? getEnvironmentYamlPath();
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        return {};
    }
    const content = fs.readFileSync(filePath, "utf-8");
    try {
        const parsed = YAML.parse(content) as EnvYamlStructure;
        return parsed || {};
    } catch (error) {
        console.warn(`Failed to parse env.yaml: ${error}`);
        return {};
    }
}

function getValueFromEnvOrYaml(envKey: string, yamlPath: string[], envYaml: EnvYamlStructure): string {
    const envValue = process.env[envKey];
    if (envValue) return envValue;

    let current: any = envYaml;
    for (const key of yamlPath) {
        if (current && typeof current === "object") {
            current = current[key];
        } else {
            return "";
        }
    }
    return current || "";
}

function getEnvValue(envKey: string, yamlPath: string[], envYaml: EnvYamlStructure): pulumi.Output<string> {
    const value = getValueFromEnvOrYaml(envKey, yamlPath, envYaml);
    return pulumi.output(value);
}

function getSecretValue(envKey: string, yamlPath: string[], envYaml: EnvYamlStructure): pulumi.Output<string> {
    const value = getValueFromEnvOrYaml(envKey, yamlPath, envYaml);
    return pulumi.secret(value);
}

export function getWebEnvVars(): {
    envVars: Record<string, pulumi.Input<string>>;
    secrets: Record<string, pulumi.Output<string>>;
} {
    const envYaml = parseEnvironmentYaml();

    return {
        envVars: {
            NODE_ENV: getEnvValue("NODE_ENV", ["general", "nodeEnv"], envYaml),
            BASE_URL: getEnvValue("BASE_URL", ["apps", "web", "baseUrl"], envYaml),
            VITE_BASE_URL: getEnvValue("VITE_BASE_URL", ["apps", "web", "vite", "baseUrl"], envYaml),
            VITE_SENTRY_ENVIRONMENT: getEnvValue(
                "VITE_SENTRY_ENVIRONMENT",
                ["apps", "web", "vite", "sentry", "environment"],
                envYaml,
            ),
            VITE_SENTRY_TRACES_SAMPLE_RATE: getEnvValue(
                "VITE_SENTRY_TRACES_SAMPLE_RATE",
                ["apps", "web", "vite", "sentry", "tracesSampleRate"],
                envYaml,
            ),
            VITE_SENTRY_REPLAY_SAMPLE_RATE: getEnvValue(
                "VITE_SENTRY_REPLAY_SAMPLE_RATE",
                ["apps", "web", "vite", "sentry", "replaySampleRate"],
                envYaml,
            ),
            VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE: getEnvValue(
                "VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE",
                ["apps", "web", "vite", "sentry", "replayOnErrorSampleRate"],
                envYaml,
            ),
            VITE_GOOGLE_ANALYTICS_ENABLED: getEnvValue(
                "VITE_GOOGLE_ANALYTICS_ENABLED",
                ["apps", "web", "vite", "analytics", "googleAnalyticsEnabled"],
                envYaml,
            ),
            VITE_GOOGLE_TAG_MANAGER_ENABLED: getEnvValue(
                "VITE_GOOGLE_TAG_MANAGER_ENABLED",
                ["apps", "web", "vite", "analytics", "googleTagManagerEnabled"],
                envYaml,
            ),
            VITE_XSTATE_INSPECTOR_ENABLED: getEnvValue(
                "VITE_XSTATE_INSPECTOR_ENABLED",
                ["apps", "web", "vite", "debug", "xstateInspectorEnabled"],
                envYaml,
            ),
        },
        secrets: {
            DATABASE_URL: getSecretValue("DATABASE_URL", ["secrets", "database", "url"], envYaml),
            CACHE_URL: getSecretValue("CACHE_URL", ["secrets", "cache", "url"], envYaml),
            SENTRY_DSN: getSecretValue("SENTRY_DSN", ["secrets", "sentry", "dsn"], envYaml),
        },
    };
}

export function getAdminEnvVars(): {
    envVars: Record<string, pulumi.Input<string>>;
    secrets: Record<string, pulumi.Output<string>>;
} {
    const envYaml = parseEnvironmentYaml();

    return {
        envVars: {
            NODE_ENV: getEnvValue("NODE_ENV", ["general", "nodeEnv"], envYaml),
            BASE_URL: getEnvValue("ADMIN_BASE_URL", ["apps", "admin", "baseUrl"], envYaml),
            BETTER_AUTH_URL: getEnvValue("BETTER_AUTH_URL", ["apps", "admin", "betterAuthUrl"], envYaml),
            VITE_SENTRY_ENVIRONMENT: getEnvValue(
                "VITE_SENTRY_ENVIRONMENT",
                ["apps", "admin", "vite", "sentry", "environment"],
                envYaml,
            ),
            VITE_SENTRY_TRACES_SAMPLE_RATE: getEnvValue(
                "VITE_SENTRY_TRACES_SAMPLE_RATE",
                ["apps", "admin", "vite", "sentry", "tracesSampleRate"],
                envYaml,
            ),
            VITE_SENTRY_REPLAY_SAMPLE_RATE: getEnvValue(
                "VITE_SENTRY_REPLAY_SAMPLE_RATE",
                ["apps", "admin", "vite", "sentry", "replaySampleRate"],
                envYaml,
            ),
            VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE: getEnvValue(
                "VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE",
                ["apps", "admin", "vite", "sentry", "replayOnErrorSampleRate"],
                envYaml,
            ),
        },
        secrets: {
            DATABASE_URL: getSecretValue("DATABASE_URL", ["secrets", "database", "url"], envYaml),
            CACHE_URL: getSecretValue("CACHE_URL", ["secrets", "cache", "url"], envYaml),
            SENTRY_DSN: getSecretValue("SENTRY_DSN", ["secrets", "sentry", "dsn"], envYaml),
            BETTER_AUTH_SECRET: getSecretValue("BETTER_AUTH_SECRET", ["secrets", "auth", "betterAuthSecret"], envYaml),
            GOOGLE_CLIENT_ID: getSecretValue("GOOGLE_CLIENT_ID", ["secrets", "auth", "googleClientId"], envYaml),
            GOOGLE_CLIENT_SECRET: getSecretValue(
                "GOOGLE_CLIENT_SECRET",
                ["secrets", "auth", "googleClientSecret"],
                envYaml,
            ),
        },
    };
}

export function getWikiEnvVars(): {
    envVars: Record<string, pulumi.Input<string>>;
} {
    const envYaml = parseEnvironmentYaml();

    return {
        envVars: {
            NODE_ENV: getEnvValue("NODE_ENV", ["general", "nodeEnv"], envYaml),
            BASE_URL: getEnvValue("WIKI_BASE_URL", ["apps", "wiki", "baseUrl"], envYaml),
            PRODUCTION_URL: getEnvValue("PORTAL_BASE_URL", ["apps", "wiki", "baseUrl"], envYaml),
        },
    };
}

export function getE2eEnvVars(): {
    envVars: Record<string, pulumi.Input<string>>;
    secrets: Record<string, pulumi.Output<string>>;
} {
    const envYaml = parseEnvironmentYaml();

    return {
        envVars: {
            NODE_ENV: getEnvValue("NODE_ENV", ["general", "nodeEnv"], envYaml),
            BASE_URL: getEnvValue("PORTAL_BASE_URL", ["apps", "portal", "baseUrl"], envYaml),
            PRODUCTION_URL: getEnvValue("PORTAL_BASE_URL", ["apps", "portal", "baseUrl"], envYaml),
        },
        secrets: {
            DATABASE_URL: getSecretValue("DATABASE_URL", ["secrets", "database", "url"], envYaml),
            AUTH_SECRET: getSecretValue("AUTH_SECRET", ["secrets", "auth", "betterAuthSecret"], envYaml),
            GOOGLE_CLIENT_ID: getSecretValue("GOOGLE_CLIENT_ID", ["secrets", "auth", "googleClientId"], envYaml),
            GOOGLE_CLIENT_SECRET: getSecretValue(
                "GOOGLE_CLIENT_SECRET",
                ["secrets", "auth", "googleClientSecret"],
                envYaml,
            ),
        },
    };
}

export function getApiEnvVars(): {
    vars: Record<string, string>;
    secrets: Record<string, pulumi.Output<string>>;
} {
    const envYaml = parseEnvironmentYaml();

    return {
        vars: {
            NODE_ENV: getValueFromEnvOrYaml("NODE_ENV", ["general", "nodeEnv"], envYaml) || "production",
            API_BASE_URL: getValueFromEnvOrYaml("API_BASE_URL", ["apps", "api", "baseUrl"], envYaml),
        },
        secrets: {
            DATABASE_URL: getSecretValue("DATABASE_URL", ["secrets", "database", "url"], envYaml),
            CACHE_URL: getSecretValue("CACHE_URL", ["secrets", "cache", "url"], envYaml),
            SENTRY_DSN: getSecretValue("SENTRY_DSN", ["secrets", "sentry", "dsn"], envYaml),
            BETTER_AUTH_SECRET: getSecretValue("BETTER_AUTH_SECRET", ["secrets", "auth", "betterAuthSecret"], envYaml),
            GOOGLE_CLIENT_ID: getSecretValue("GOOGLE_CLIENT_ID", ["secrets", "auth", "googleClientId"], envYaml),
            GOOGLE_CLIENT_SECRET: getSecretValue(
                "GOOGLE_CLIENT_SECRET",
                ["secrets", "auth", "googleClientSecret"],
                envYaml,
            ),
        },
    };
}

export function parseEnvFile(envFilePath?: string): Record<string, string> {
    const projectRoot = findProjectRoot();
    const defaultEnvPath = path.join(projectRoot, "infra", ".env");
    const filePath = envFilePath ?? defaultEnvPath;

    if (!fs.existsSync(filePath)) {
        return {};
    }

    const envContent = fs.readFileSync(filePath, "utf-8");
    const envVars: Record<string, string> = {};
    const lines = envContent.split("\n");

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith("#")) continue;
        const equalIndex = trimmedLine.indexOf("=");
        if (equalIndex === -1) continue;
        const key = trimmedLine.slice(0, equalIndex).trim();
        const value = trimmedLine.slice(equalIndex + 1).trim();
        envVars[key] = value.replace(/^["']|["']$/g, "");
    }
    return envVars;
}
