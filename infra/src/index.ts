import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: resolve(process.cwd(), ".env") });

import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";
import * as sentry from "@pulumiverse/sentry";
import { getConfig, getProjectName, getSecretsFromEnv } from "./config.js";
import { createPreviewDeploymentAccess } from "./resources/access.js";
import { createPortfolioCloudflareData } from "./resources/cloudflare-data.js";
import { createPortfolioDnsRecords } from "./resources/dns.js";
import { createObservability } from "./resources/observability.js";
import { createPortfolioPagesProjects } from "./resources/pages.js";
import { getCloudflareEnvVars } from "./resources/secrets.js";
import { createPortfolioApiWorker } from "./resources/workers.js";

const secrets = getSecretsFromEnv();
const config = getConfig(secrets);
const projectName = getProjectName();

const cloudflareProvider = new cloudflare.Provider("cloudflare-provider", {
    apiToken: config.cloudflare.apiToken,
});

const sentryProvider = new sentry.Provider("sentry-provider", {
    token: config.sentry.authToken,
});

const cloudflareData = createPortfolioCloudflareData(config, cloudflareProvider);

export const d1DatabaseId = cloudflareData.database.id;
export const d1DatabaseName = cloudflareData.database.name;
export const kvNamespaceId = cloudflareData.cache.id;
export const kvNamespaceTitle = cloudflareData.cache.title;
export const r2BucketName = cloudflareData.images.name;

const workers = createPortfolioApiWorker(
    config,
    {
        d1DatabaseId: cloudflareData.database.id,
        kvNamespaceId: cloudflareData.cache.id,
        r2BucketName: cloudflareData.images.name,
    },
    cloudflareProvider,
);

const apiWorkerScriptName = (() => {
    const apiWorkerKey = Object.keys(workers.scripts).find((key) => key.includes("api"));
    if (!apiWorkerKey) {
        throw new Error("API Worker script not found. Service Binding requires an API Worker to be created first.");
    }
    const workerScript = workers.scripts[apiWorkerKey];
    if (!workerScript) {
        throw new Error(`API Worker script not found for key "${apiWorkerKey}". Service Binding cannot be configured.`);
    }
    const scriptName = workerScript.scriptName;

    return scriptName.apply((name) => {
        if (!name || name.trim() === "") {
            throw new Error(
                `API Worker script name is empty for key "${apiWorkerKey}". Service Binding cannot be configured.`,
            );
        }
        return name;
    });
})();

const pagesProjects = createPortfolioPagesProjects(config, cloudflareProvider, apiWorkerScriptName);

export const pagesProjectNames = pulumi
    .output(pagesProjects.projects)
    .apply((projects) => Object.fromEntries(Object.entries(projects).map(([key, project]) => [key, project.name])));

export const pagesDomainNames = pulumi
    .output(pagesProjects.domains)
    .apply((domains) => Object.fromEntries(Object.entries(domains).map(([key, domain]) => [key, domain.name])));

const dnsRecords = createPortfolioDnsRecords(
    config,
    cloudflareProvider,
    pagesProjects.subdomains,
    workers.subdomains,
    workers.domains,
);

export const dnsRecordIds = pulumi
    .output(dnsRecords.records)
    .apply((records) => Object.fromEntries(Object.entries(records).map(([key, record]) => [key, record.id])));

const previewAccess = createPreviewDeploymentAccess(
    config,
    pagesProjects,
    {
        scripts: workers.scripts,
        subdomains: workers.subdomains,
        domains: workers.domains,
    },
    cloudflareProvider,
);

export const accessApplicationIds = previewAccess
    ? pulumi
          .output(previewAccess.applications)
          .apply((apps) =>
              Object.fromEntries(
                  Object.entries(apps).map(([key, app]: [string, cloudflare.ZeroTrustAccessApplication]) => [
                      key,
                      app.id,
                  ]),
              ),
          )
    : undefined;

export const workerScriptNames = pulumi
    .output(workers.scripts)
    .apply((scripts) => Object.fromEntries(Object.entries(scripts).map(([key, script]) => [key, script.scriptName])));

export const workerDomainNames = pulumi
    .output(workers.domains)
    .apply((domains) => Object.fromEntries(Object.entries(domains).map(([key, domain]) => [key, domain.hostname])));

const observability = createObservability(config, sentryProvider);

export const sentryDsn = observability.sentry.dsn;
export const sentryTeamSlug = observability.sentry.team.slug;
export const sentryProjectSlugs = Object.fromEntries(
    Object.entries(observability.sentry.projects).map(([key, project]) => [key, project.slug]),
);

export const cloudflareInfo = {
    note: "環境変数は Cloudflare Dashboard の Workers / Pages の設定、または wrangler secret で管理します。",
    runDev: "bun run dev（ローカルは .env または compose の環境変数を使用）",
};

export const cloudflareEnvVars = getCloudflareEnvVars(secrets);

export const summary = {
    environment: config.environment,
    domain: config.cloudflare.domain,
    secretsManagement: "Cloudflare Pages/Workers",
    databases: {
        d1: {
            name: `${projectName}-${config.environment}-db`,
            type: "D1",
        },
        kv: {
            name: `${projectName}-${config.environment}-cache`,
            type: "Workers KV",
        },
        r2: {
            name: `${projectName}-${config.environment}-images`,
            type: "R2",
            purpose: "app images (WebView)",
        },
    },
    cloudflare: {
        accountId: config.cloudflare.accountId,
    },
};
