import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: resolve(process.cwd(), ".env") });

import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";
import * as grafana from "@pulumiverse/grafana";
import * as sentry from "@pulumiverse/sentry";
import * as rediscloud from "@rediscloud/pulumi-rediscloud";
import { getConfig, getSecretsFromEnv } from "./config.js";
import { createPreviewDeploymentAccess } from "./resources/access.js";
import { createPortfolioRedisConfig } from "./resources/cache.js";
import {
    createPortfolioTiDBConfig,
    TIDB_ALLOWED_REGIONS,
    TIDB_SERVERLESS_RECOMMENDATIONS,
} from "./resources/databases.js";
import { createPortfolioDnsRecords } from "./resources/dns.js";
import { createObservability } from "./resources/observability.js";
import { createPortfolioPagesProjects } from "./resources/pages.js";
import { getCloudflareEnvVars } from "./resources/secrets.js";
import { createPortfolioApiWorker } from "./resources/workers.js";

const secrets = getSecretsFromEnv();
const config = getConfig(secrets);

const cloudflareProvider = new cloudflare.Provider("cloudflare-provider", {
    apiToken: config.cloudflare.apiToken,
});

const grafanaOrgSlug = config.grafana.orgSlug;
const pulumiConfig = new pulumi.Config();
const grafanaUrlConfig = pulumiConfig.get("grafanaUrl");
let grafanaUrl: pulumi.Output<string> | string;
if (grafanaUrlConfig) {
    grafanaUrl = grafanaUrlConfig;
} else if (typeof grafanaOrgSlug === "string") {
    grafanaUrl = grafanaOrgSlug ? `https://${grafanaOrgSlug}.grafana.net` : "https://grafana.com";
} else {
    grafanaUrl = grafanaOrgSlug.apply((slug) => (slug ? `https://${slug}.grafana.net` : "https://grafana.com"));
}

const grafanaProvider = new grafana.Provider("grafana-provider", {
    auth: config.grafana.apiKey,
    url: grafanaUrl,
});

const sentryProvider = new sentry.Provider("sentry-provider", {
    token: config.sentry.authToken,
});

const pulumiConfigForRedis = new pulumi.Config();
const skipRedisCloud = pulumiConfigForRedis.getBoolean("skipRedisCloud") ?? false;

let redisCloudProvider: rediscloud.Provider | undefined;
let redis: ReturnType<typeof createPortfolioRedisConfig>;

if (skipRedisCloud) {
    redis = createPortfolioRedisConfig(secrets);
} else {
    redisCloudProvider = new rediscloud.Provider("rediscloud-provider", {
        apiKey: secrets.REDISCLOUD_ACCESS_KEY,
        secretKey: secrets.REDISCLOUD_SECRET_KEY,
    });
    redis = createPortfolioRedisConfig(secrets, redisCloudProvider);
}

const tidb = createPortfolioTiDBConfig(secrets, {
    publicKey: secrets.TIDBCLOUD_PUBLIC_KEY,
    privateKey: secrets.TIDBCLOUD_PRIVATE_KEY,
});

export const tidbConnectionString = tidb.connectionString;
export const tidbHost = tidb.host;
export const redisConnectionString = redis.connectionString;

export const tidbClusterInfo = {
    name: tidb.clusterConfig.name,
    cloudProvider: tidb.clusterConfig.cloudProvider,
    region: tidb.clusterConfig.region,
    database: tidb.clusterConfig.database,
    tier: "Serverless",
    allowedRegions: TIDB_ALLOWED_REGIONS,
    recommendations: TIDB_SERVERLESS_RECOMMENDATIONS,
};

const workers = createPortfolioApiWorker(
    config,
    {
        databaseUrl: tidb.connectionString,
        redisUrl: redis.connectionString,
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

const pagesProjects = createPortfolioPagesProjects(
    config,
    {
        databaseUrl: tidb.connectionString,
        redisUrl: redis.connectionString,
    },
    cloudflareProvider,
    apiWorkerScriptName,
);

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

const observability = createObservability(config, grafanaProvider, sentryProvider);

export const grafanaFolderUids = pulumi
    .output(observability.grafana.folders)
    .apply((folders) => Object.fromEntries(Object.entries(folders).map(([key, folder]) => [key, folder.uid])));

export const grafanaDashboardUids = pulumi
    .output(observability.grafana.dashboards)
    .apply((dashboards) =>
        Object.fromEntries(Object.entries(dashboards).map(([key, dashboard]) => [key, dashboard.uid])),
    );

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
        tidb: {
            type: "Serverless",
            cloudProvider: "AWS",
            region: "ap-northeast-1",
        },
        redis:
            redis.database && redis.subscription
                ? {
                      name: redis.database.name,
                      subscription: redis.subscription.name,
                  }
                : {
                      name: "external",
                      subscription: "external",
                  },
    },
    cloudflare: {
        accountId: config.cloudflare.accountId,
    },
};
