#!/usr/bin/env bun
/**
 * infra/env.yaml から infra/.env を生成する（Pulumi が process.env / dotenv 経由で読むため）
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const infraDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const envYamlPath = join(infraDir, "env.yaml");
const envPath = join(infraDir, ".env");

const doc = parse(readFileSync(envYamlPath, "utf8")) as {
    infra?: {
        cloudflare?: { accountId?: string; apiToken?: string; zoneId?: string };
        sentry?: { authToken?: string; org?: string };
    };
    secrets?: {
        auth?: {
            betterAuthSecret?: string;
            googleClientId?: string;
            googleClientSecret?: string;
        };
        sentry?: { dsn?: string };
    };
    apps?: {
        api?: { baseUrl?: string };
        admin?: { betterAuthUrl?: string };
        web?: { vite?: { baseUrl?: string } };
    };
    general?: { appVersion?: string };
};

const lines: string[] = [
    `# Generated from env.yaml — do not commit`,
    `CLOUDFLARE_API_TOKEN=${doc.infra?.cloudflare?.apiToken ?? ""}`,
    `CLOUDFLARE_ACCOUNT_ID=${doc.infra?.cloudflare?.accountId ?? ""}`,
    `CLOUDFLARE_ZONE_ID=${doc.infra?.cloudflare?.zoneId ?? ""}`,
    `SENTRY_AUTH_TOKEN=${doc.infra?.sentry?.authToken ?? ""}`,
    `SENTRY_ORG=${doc.infra?.sentry?.org ?? ""}`,
    `SENTRY_DSN=${doc.secrets?.sentry?.dsn ?? ""}`,
    `BETTER_AUTH_SECRET=${doc.secrets?.auth?.betterAuthSecret ?? ""}`,
    `GOOGLE_CLIENT_ID=${doc.secrets?.auth?.googleClientId ?? ""}`,
    `GOOGLE_CLIENT_SECRET=${doc.secrets?.auth?.googleClientSecret ?? ""}`,
    `API_BASE_URL=${doc.apps?.api?.baseUrl ?? ""}`,
    `BETTER_AUTH_URL=${doc.apps?.admin?.betterAuthUrl ?? ""}`,
    `VITE_BASE_URL=${doc.apps?.web?.vite?.baseUrl ?? ""}`,
    `APP_VERSION=${doc.general?.appVersion ?? ""}`,
];

writeFileSync(envPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${envPath}`);
