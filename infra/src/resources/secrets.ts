import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as pulumi from "@pulumi/pulumi";
import type { SecretsFromEnv } from "../config.js";

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

function stripQuotes(value: string): string {
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1);
    }
    return value;
}

export const INFRA_ONLY_ENV_KEYS = [
    "CLOUDFLARE_ACCOUNT_ID",
    "CLOUDFLARE_API_TOKEN",
    "CLOUDFLARE_ZONE_ID",
    "GRAFANA_API_KEY",
    "GRAFANA_ORG_SLUG",
    "REDISCLOUD_ACCESS_KEY",
    "REDISCLOUD_DATABASE_ID",
    "REDISCLOUD_SECRET_KEY",
    "REDISCLOUD_SUBSCRIPTION_ID",
    "SENTRY_AUTH_TOKEN",
    "TIDBCLOUD_PRIVATE_KEY",
    "TIDBCLOUD_PUBLIC_KEY",
] as const;

export function getEnvironmentYamlPath(): string {
    return path.join(findProjectRoot(), "infra", "env.yaml");
}

const ENV_KEY_VALUE_REGEX = /^([A-Z][A-Z0-9_]*):\s*(.*)$/;

export function parseEnvironmentYaml(environmentYamlPath?: string): Record<string, string> {
    const filePath = environmentYamlPath ?? getEnvironmentYamlPath();
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        return {};
    }
    const content = fs.readFileSync(filePath, "utf-8");
    const result: Record<string, string> = {};
    const keySet = new Set<string>(INFRA_ONLY_ENV_KEYS);
    for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const match = ENV_KEY_VALUE_REGEX.exec(trimmed);
        const key = match?.[1];
        if (!key || !keySet.has(key)) continue;
        result[key] = stripQuotes((match[2] ?? "").trim());
    }
    return result;
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
        envVars[key] = stripQuotes(trimmedLine.slice(equalIndex + 1).trim());
    }
    return envVars;
}
