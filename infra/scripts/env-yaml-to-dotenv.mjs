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

const doc = parse(readFileSync(envYamlPath, "utf8")) ?? {};
const infra = doc.infra ?? {};
const cloudflare = infra.cloudflare ?? {};
const sentryInfra = infra.sentry ?? {};
const secrets = doc.secrets ?? {};
const auth = secrets.auth ?? {};
const sentrySecrets = secrets.sentry ?? {};
const apps = doc.apps ?? {};
const general = doc.general ?? {};

const lines = [
    `# Generated from env.yaml — do not commit`,
    `CLOUDFLARE_API_TOKEN=${cloudflare.apiToken ?? ""}`,
    `CLOUDFLARE_ACCOUNT_ID=${cloudflare.accountId ?? ""}`,
    `CLOUDFLARE_ZONE_ID=${cloudflare.zoneId ?? ""}`,
    `SENTRY_AUTH_TOKEN=${sentryInfra.authToken ?? ""}`,
    `SENTRY_ORG=${sentryInfra.org ?? ""}`,
    `SENTRY_DSN=${sentrySecrets.dsn ?? ""}`,
    `BETTER_AUTH_SECRET=${auth.betterAuthSecret ?? ""}`,
    `GOOGLE_CLIENT_ID=${auth.googleClientId ?? ""}`,
    `GOOGLE_CLIENT_SECRET=${auth.googleClientSecret ?? ""}`,
    `API_BASE_URL=${apps.api?.baseUrl ?? ""}`,
    `BETTER_AUTH_URL=${apps.admin?.betterAuthUrl ?? ""}`,
    `VITE_BASE_URL=${apps.web?.vite?.baseUrl ?? ""}`,
    `APP_VERSION=${general.appVersion ?? ""}`,
];

writeFileSync(envPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${envPath}`);
