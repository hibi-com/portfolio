import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";
import * as doppler from "@pulumiverse/doppler";
import * as grafana from "@pulumiverse/grafana";
import * as sentry from "@pulumiverse/sentry";
import * as rediscloud from "@rediscloud/pulumi-rediscloud";
import { getConfig, getDopplerSecrets, getProjectName } from "./config.js";
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
import {
    createDopplerProject,
    createDopplerSecretsOnly,
    type DopplerProjectOutputs,
    getCloudflareEnvVars,
    getComposeSecretsDir,
    getEnvironmentYamlPath,
    getSecretsFromCreatedResources,
} from "./resources/secrets.js";
import { createPortfolioApiWorker } from "./resources/workers.js";

const pulumiConfig = new pulumi.Config();

const shouldCreateDopplerProject = pulumiConfig.getBoolean("createDopplerProject") ?? false;
const shouldSyncDopplerSecrets = pulumiConfig.getBoolean("syncDopplerSecrets") ?? false;

let dopplerProjectResources: ReturnType<typeof createDopplerProject> | undefined;
let dopplerSecretsResources: Record<string, doppler.Secret> | undefined;

if (shouldCreateDopplerProject) {
    const projectName = getProjectName();
    dopplerProjectResources = createDopplerProject(projectName, `${projectName} infrastructure project`);
} else if (shouldSyncDopplerSecrets) {
    dopplerSecretsResources = createDopplerSecretsOnly(getProjectName(), {
        composeSecretsDir: getComposeSecretsDir(),
        environmentYamlPath: getEnvironmentYamlPath(),
    });
}

export const dopplerProjectId = dopplerProjectResources?.project.id;
export const dopplerEnvironmentIds = dopplerProjectResources
    ? pulumi.output(
          Object.fromEntries(Object.entries(dopplerProjectResources.environments).map(([key, env]) => [key, env.id])),
      )
    : undefined;

let dopplerSecrets: ReturnType<typeof getDopplerSecrets>;
if (shouldCreateDopplerProject && dopplerProjectResources) {
    const pulumiConfigForEnv = new pulumi.Config();
    const configName = pulumiConfigForEnv.require("dopplerConfig");
    const createdSecrets = getSecretsFromCreatedResources(dopplerProjectResources, configName);
    dopplerSecrets = {
        DATABASE_URL: createdSecrets.DATABASE_URL ?? pulumi.output(""),
        REDIS_URL: createdSecrets.REDIS_URL ?? pulumi.output(""),
        CLOUDFLARE_API_TOKEN: createdSecrets.CLOUDFLARE_API_TOKEN ?? pulumi.output(""),
        CLOUDFLARE_ACCOUNT_ID: createdSecrets.CLOUDFLARE_ACCOUNT_ID ?? pulumi.output(""),
        CLOUDFLARE_ZONE_ID: createdSecrets.CLOUDFLARE_ZONE_ID ?? pulumi.output(""),
        GRAFANA_API_KEY: createdSecrets.GRAFANA_API_KEY ?? pulumi.output(""),
        GRAFANA_ORG_SLUG: createdSecrets.GRAFANA_ORG_SLUG ?? pulumi.output(""),
        SENTRY_AUTH_TOKEN: createdSecrets.SENTRY_AUTH_TOKEN ?? pulumi.output(""),
        SENTRY_ORG: createdSecrets.SENTRY_ORG ?? pulumi.output(""),
        SENTRY_DSN: createdSecrets.SENTRY_DSN ?? pulumi.output(""),
        REDISCLOUD_ACCESS_KEY: createdSecrets.REDISCLOUD_ACCESS_KEY ?? pulumi.output(""),
        REDISCLOUD_SECRET_KEY: createdSecrets.REDISCLOUD_SECRET_KEY ?? pulumi.output(""),
        REDISCLOUD_SUBSCRIPTION_ID: createdSecrets.REDISCLOUD_SUBSCRIPTION_ID ?? pulumi.output(""),
        REDISCLOUD_DATABASE_ID: createdSecrets.REDISCLOUD_DATABASE_ID ?? pulumi.output(""),
        BETTER_AUTH_SECRET: createdSecrets.BETTER_AUTH_SECRET ?? pulumi.output(""),
        GOOGLE_CLIENT_ID: createdSecrets.GOOGLE_CLIENT_ID ?? pulumi.output(""),
        GOOGLE_CLIENT_SECRET: createdSecrets.GOOGLE_CLIENT_SECRET ?? pulumi.output(""),
        TIDBCLOUD_PUBLIC_KEY: createdSecrets.TIDBCLOUD_PUBLIC_KEY ?? pulumi.output(""),
        TIDBCLOUD_PRIVATE_KEY: createdSecrets.TIDBCLOUD_PRIVATE_KEY ?? pulumi.output(""),
        API_BASE_URL: createdSecrets.API_BASE_URL ?? pulumi.output(""),
        APP_VERSION: createdSecrets.APP_VERSION ?? pulumi.output(""),
        BETTER_AUTH_URL: createdSecrets.BETTER_AUTH_URL ?? pulumi.output(""),
        VITE_BASE_URL: createdSecrets.VITE_BASE_URL ?? pulumi.output(""),
        VITE_GOOGLE_ANALYTICS_ENABLED: createdSecrets.VITE_GOOGLE_ANALYTICS_ENABLED ?? pulumi.output(""),
        VITE_GOOGLE_TAG_MANAGER_ENABLED: createdSecrets.VITE_GOOGLE_TAG_MANAGER_ENABLED ?? pulumi.output(""),
        VITE_SENTRY_ENVIRONMENT: createdSecrets.VITE_SENTRY_ENVIRONMENT ?? pulumi.output(""),
        VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE:
            createdSecrets.VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE ?? pulumi.output(""),
        VITE_SENTRY_REPLAY_SAMPLE_RATE: createdSecrets.VITE_SENTRY_REPLAY_SAMPLE_RATE ?? pulumi.output(""),
        VITE_SENTRY_TRACES_SAMPLE_RATE: createdSecrets.VITE_SENTRY_TRACES_SAMPLE_RATE ?? pulumi.output(""),
        VITE_XSTATE_INSPECTOR_ENABLED: createdSecrets.VITE_XSTATE_INSPECTOR_ENABLED ?? pulumi.output(""),
    };
} else if (shouldSyncDopplerSecrets && dopplerSecretsResources) {
    const pulumiConfigForEnv = new pulumi.Config();
    const configName = pulumiConfigForEnv.require("dopplerConfig");
    const createdSecrets = getSecretsFromCreatedResources(
        { secrets: dopplerSecretsResources } as DopplerProjectOutputs,
        configName,
    );
    dopplerSecrets = {
        DATABASE_URL: createdSecrets.DATABASE_URL ?? pulumi.output(""),
        REDIS_URL: createdSecrets.REDIS_URL ?? pulumi.output(""),
        CLOUDFLARE_API_TOKEN: createdSecrets.CLOUDFLARE_API_TOKEN ?? pulumi.output(""),
        CLOUDFLARE_ACCOUNT_ID: createdSecrets.CLOUDFLARE_ACCOUNT_ID ?? pulumi.output(""),
        CLOUDFLARE_ZONE_ID: createdSecrets.CLOUDFLARE_ZONE_ID ?? pulumi.output(""),
        GRAFANA_API_KEY: createdSecrets.GRAFANA_API_KEY ?? pulumi.output(""),
        GRAFANA_ORG_SLUG: createdSecrets.GRAFANA_ORG_SLUG ?? pulumi.output(""),
        SENTRY_AUTH_TOKEN: createdSecrets.SENTRY_AUTH_TOKEN ?? pulumi.output(""),
        SENTRY_ORG: createdSecrets.SENTRY_ORG ?? pulumi.output(""),
        SENTRY_DSN: createdSecrets.SENTRY_DSN ?? pulumi.output(""),
        REDISCLOUD_ACCESS_KEY: createdSecrets.REDISCLOUD_ACCESS_KEY ?? pulumi.output(""),
        REDISCLOUD_SECRET_KEY: createdSecrets.REDISCLOUD_SECRET_KEY ?? pulumi.output(""),
        REDISCLOUD_SUBSCRIPTION_ID: createdSecrets.REDISCLOUD_SUBSCRIPTION_ID ?? pulumi.output(""),
        REDISCLOUD_DATABASE_ID: createdSecrets.REDISCLOUD_DATABASE_ID ?? pulumi.output(""),
        BETTER_AUTH_SECRET: createdSecrets.BETTER_AUTH_SECRET ?? pulumi.output(""),
        GOOGLE_CLIENT_ID: createdSecrets.GOOGLE_CLIENT_ID ?? pulumi.output(""),
        GOOGLE_CLIENT_SECRET: createdSecrets.GOOGLE_CLIENT_SECRET ?? pulumi.output(""),
        TIDBCLOUD_PUBLIC_KEY: createdSecrets.TIDBCLOUD_PUBLIC_KEY ?? pulumi.output(""),
        TIDBCLOUD_PRIVATE_KEY: createdSecrets.TIDBCLOUD_PRIVATE_KEY ?? pulumi.output(""),
        API_BASE_URL: createdSecrets.API_BASE_URL ?? pulumi.output(""),
        APP_VERSION: createdSecrets.APP_VERSION ?? pulumi.output(""),
        BETTER_AUTH_URL: createdSecrets.BETTER_AUTH_URL ?? pulumi.output(""),
        VITE_BASE_URL: createdSecrets.VITE_BASE_URL ?? pulumi.output(""),
        VITE_GOOGLE_ANALYTICS_ENABLED: createdSecrets.VITE_GOOGLE_ANALYTICS_ENABLED ?? pulumi.output(""),
        VITE_GOOGLE_TAG_MANAGER_ENABLED: createdSecrets.VITE_GOOGLE_TAG_MANAGER_ENABLED ?? pulumi.output(""),
        VITE_SENTRY_ENVIRONMENT: createdSecrets.VITE_SENTRY_ENVIRONMENT ?? pulumi.output(""),
        VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE:
            createdSecrets.VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE ?? pulumi.output(""),
        VITE_SENTRY_REPLAY_SAMPLE_RATE: createdSecrets.VITE_SENTRY_REPLAY_SAMPLE_RATE ?? pulumi.output(""),
        VITE_SENTRY_TRACES_SAMPLE_RATE: createdSecrets.VITE_SENTRY_TRACES_SAMPLE_RATE ?? pulumi.output(""),
        VITE_XSTATE_INSPECTOR_ENABLED: createdSecrets.VITE_XSTATE_INSPECTOR_ENABLED ?? pulumi.output(""),
    };
} else {
    dopplerSecrets = getDopplerSecrets();
}

const config = getConfig(dopplerSecrets);

let cloudflareProviderDeps: doppler.Secret[] | undefined;
if (shouldCreateDopplerProject && dopplerProjectResources?.secrets) {
    cloudflareProviderDeps = Object.entries(dopplerProjectResources.secrets)
        .filter(([key]) => key.includes("CLOUDFLARE_API_TOKEN"))
        .map(([, secret]) => secret);
}

const cloudflareProvider = new cloudflare.Provider(
    "cloudflare-provider",
    {
        apiToken: config.cloudflare.apiToken,
    },
    cloudflareProviderDeps && cloudflareProviderDeps.length > 0 ? { dependsOn: cloudflareProviderDeps } : undefined,
);

let grafanaProviderDeps: doppler.Secret[] | undefined;
if (shouldCreateDopplerProject && dopplerProjectResources?.secrets) {
    grafanaProviderDeps = Object.entries(dopplerProjectResources.secrets)
        .filter(([key]) => key.includes("GRAFANA_API_KEY"))
        .map(([, secret]) => secret);
} else if (shouldSyncDopplerSecrets && dopplerSecretsResources) {
    grafanaProviderDeps = Object.entries(dopplerSecretsResources)
        .filter(([key]) => key.includes("GRAFANA_API_KEY"))
        .map(([, secret]) => secret);
}

const grafanaOrgSlug = config.grafana.orgSlug;
const grafanaUrlConfig = pulumiConfig.get("grafanaUrl");
let grafanaUrl: pulumi.Output<string> | string;
if (grafanaUrlConfig) {
    grafanaUrl = grafanaUrlConfig;
} else if (typeof grafanaOrgSlug === "string") {
    grafanaUrl = grafanaOrgSlug ? `https://${grafanaOrgSlug}.grafana.net` : "https://grafana.com";
} else {
    grafanaUrl = grafanaOrgSlug.apply((slug) => (slug ? `https://${slug}.grafana.net` : "https://grafana.com"));
}

const grafanaProvider = new grafana.Provider(
    "grafana-provider",
    {
        auth: config.grafana.apiKey,
        url: grafanaUrl,
    },
    grafanaProviderDeps && grafanaProviderDeps.length > 0 ? { dependsOn: grafanaProviderDeps } : undefined,
);

let sentryProviderDeps: doppler.Secret[] | undefined;
if (shouldCreateDopplerProject && dopplerProjectResources?.secrets) {
    sentryProviderDeps = Object.entries(dopplerProjectResources.secrets)
        .filter(([key]) => key.includes("SENTRY_AUTH_TOKEN"))
        .map(([, secret]) => secret);
} else if (shouldSyncDopplerSecrets && dopplerSecretsResources) {
    sentryProviderDeps = Object.entries(dopplerSecretsResources)
        .filter(([key]) => key.includes("SENTRY_AUTH_TOKEN"))
        .map(([, secret]) => secret);
}

const sentryProvider = new sentry.Provider(
    "sentry-provider",
    {
        token: config.sentry.authToken,
    },
    sentryProviderDeps && sentryProviderDeps.length > 0 ? { dependsOn: sentryProviderDeps } : undefined,
);

let redisCloudProviderDeps: doppler.Secret[] | undefined;
if (shouldCreateDopplerProject && dopplerProjectResources?.secrets) {
    redisCloudProviderDeps = Object.entries(dopplerProjectResources.secrets)
        .filter(([key]) => key.includes("REDISCLOUD_ACCESS_KEY") || key.includes("REDISCLOUD_SECRET_KEY"))
        .map(([, secret]) => secret);
} else if (shouldSyncDopplerSecrets && dopplerSecretsResources) {
    redisCloudProviderDeps = Object.entries(dopplerSecretsResources)
        .filter(([key]) => key.includes("REDISCLOUD_ACCESS_KEY") || key.includes("REDISCLOUD_SECRET_KEY"))
        .map(([, secret]) => secret);
}

const secrets = {
    DATABASE_URL: dopplerSecrets.DATABASE_URL,
    REDIS_URL: dopplerSecrets.REDIS_URL,
    CLOUDFLARE_API_TOKEN: dopplerSecrets.CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_ACCOUNT_ID: dopplerSecrets.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_ZONE_ID: dopplerSecrets.CLOUDFLARE_ZONE_ID,
    REDISCLOUD_SUBSCRIPTION_ID: dopplerSecrets.REDISCLOUD_SUBSCRIPTION_ID,
    REDISCLOUD_DATABASE_ID: dopplerSecrets.REDISCLOUD_DATABASE_ID,
    GRAFANA_API_KEY: dopplerSecrets.GRAFANA_API_KEY,
    GRAFANA_ORG_SLUG: dopplerSecrets.GRAFANA_ORG_SLUG,
    SENTRY_AUTH_TOKEN: dopplerSecrets.SENTRY_AUTH_TOKEN,
    SENTRY_ORG: dopplerSecrets.SENTRY_ORG,
    SENTRY_DSN: dopplerSecrets.SENTRY_DSN,
    REDISCLOUD_ACCESS_KEY: dopplerSecrets.REDISCLOUD_ACCESS_KEY,
    REDISCLOUD_SECRET_KEY: dopplerSecrets.REDISCLOUD_SECRET_KEY,
    BETTER_AUTH_SECRET: dopplerSecrets.BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: dopplerSecrets.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: dopplerSecrets.GOOGLE_CLIENT_SECRET,
    TIDBCLOUD_PUBLIC_KEY: dopplerSecrets.TIDBCLOUD_PUBLIC_KEY,
    TIDBCLOUD_PRIVATE_KEY: dopplerSecrets.TIDBCLOUD_PRIVATE_KEY,
    API_BASE_URL: dopplerSecrets.API_BASE_URL,
    APP_VERSION: dopplerSecrets.APP_VERSION,
    BETTER_AUTH_URL: dopplerSecrets.BETTER_AUTH_URL,
    VITE_BASE_URL: dopplerSecrets.VITE_BASE_URL,
    VITE_GOOGLE_ANALYTICS_ENABLED: dopplerSecrets.VITE_GOOGLE_ANALYTICS_ENABLED,
    VITE_GOOGLE_TAG_MANAGER_ENABLED: dopplerSecrets.VITE_GOOGLE_TAG_MANAGER_ENABLED,
    VITE_SENTRY_ENVIRONMENT: dopplerSecrets.VITE_SENTRY_ENVIRONMENT,
    VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE: dopplerSecrets.VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE,
    VITE_SENTRY_REPLAY_SAMPLE_RATE: dopplerSecrets.VITE_SENTRY_REPLAY_SAMPLE_RATE,
    VITE_SENTRY_TRACES_SAMPLE_RATE: dopplerSecrets.VITE_SENTRY_TRACES_SAMPLE_RATE,
    VITE_XSTATE_INSPECTOR_ENABLED: dopplerSecrets.VITE_XSTATE_INSPECTOR_ENABLED,
};

const tidb = createPortfolioTiDBConfig(secrets, {
    publicKey: dopplerSecrets.TIDBCLOUD_PUBLIC_KEY,
    privateKey: dopplerSecrets.TIDBCLOUD_PRIVATE_KEY,
});

const pulumiConfigForRedis = new pulumi.Config();
const skipRedisCloud = pulumiConfigForRedis.getBoolean("skipRedisCloud") ?? false;

let redisCloudProvider: rediscloud.Provider | undefined;
let redis: ReturnType<typeof createPortfolioRedisConfig>;

if (skipRedisCloud) {
    redis = createPortfolioRedisConfig(secrets);
} else {
    redisCloudProvider = new rediscloud.Provider(
        "rediscloud-provider",
        {
            apiKey: dopplerSecrets.REDISCLOUD_ACCESS_KEY,
            secretKey: dopplerSecrets.REDISCLOUD_SECRET_KEY,
        },
        redisCloudProviderDeps && redisCloudProviderDeps.length > 0 ? { dependsOn: redisCloudProviderDeps } : undefined,
    );

    redis = createPortfolioRedisConfig(secrets, redisCloudProvider);
}

const pulumiConfigForDoppler = new pulumi.Config();
const dopplerConfigName = pulumiConfigForDoppler.require("dopplerConfig");
const dopplerProjectName = getProjectName();

new doppler.Secret("doppler-secret-auto-redis-url", {
    project: dopplerProjectName,
    config: dopplerConfigName,
    name: "REDIS_URL",
    value: pulumi.all([redis.connectionString, secrets.REDIS_URL]).apply(([generatedUrl, existingUrl]) => {
        if ((!existingUrl || existingUrl.trim() === "") && generatedUrl && generatedUrl.trim() !== "") {
            return generatedUrl;
        }
        return existingUrl || "";
    }),
});

new doppler.Secret(
    "doppler-secret-auto-database-url",
    {
        project: dopplerProjectName,
        config: dopplerConfigName,
        name: "DATABASE_URL",
        value: pulumi
            .all([tidb.cluster?.connectionString, tidb.connectionString, secrets.DATABASE_URL])
            .apply(([clusterConnectionString, generatedUrl, existingUrl]) => {
                if (clusterConnectionString && clusterConnectionString.trim() !== "") {
                    return clusterConnectionString;
                }
                if (existingUrl && existingUrl.trim() !== "") {
                    return existingUrl;
                }
                if (generatedUrl && generatedUrl.trim() !== "") {
                    return generatedUrl;
                }
                return "";
            }),
    },
    tidb.cluster?.createCommand ? { dependsOn: [tidb.cluster.createCommand] } : undefined,
);

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

const domain = config.cloudflare.domain;
const protocol = config.cloudflare.protocol || "https";

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

new doppler.Secret("doppler-secret-auto-api-base-url", {
    project: dopplerProjectName,
    config: dopplerConfigName,
    name: "API_BASE_URL",
    value: pulumi.all([dnsRecords.records, dopplerSecrets.API_BASE_URL]).apply(([records, existingUrl]) => {
        const url = existingUrl || "";
        if (url && url.trim() !== "" && !url.toLowerCase().includes("localhost")) {
            return url;
        }
        const apiRecordKey = Object.keys(records).find((key) => key.includes("api"));
        if (apiRecordKey && records[apiRecordKey]) {
            const generatedUrl = `${protocol}://api.${domain}`;
            return generatedUrl;
        }
        return url || "";
    }),
});

new doppler.Secret("doppler-secret-auto-better-auth-url", {
    project: dopplerProjectName,
    config: dopplerConfigName,
    name: "BETTER_AUTH_URL",
    value: pulumi.all([dnsRecords.records, dopplerSecrets.BETTER_AUTH_URL]).apply(([records, existingUrl]) => {
        const url = existingUrl || "";
        if (url && url.trim() !== "" && !url.toLowerCase().includes("localhost")) {
            return url;
        }
        const wwwRecordKey = Object.keys(records).find((key) => key.includes("www"));
        if (wwwRecordKey && records[wwwRecordKey]) {
            const generatedUrl = `${protocol}://www.${domain}`;
            return generatedUrl;
        }
        if (Object.keys(records).length > 0) {
            const generatedUrl = `${protocol}://${domain}`;
            return generatedUrl;
        }
        return url || "";
    }),
});

new doppler.Secret("doppler-secret-auto-vite-base-url", {
    project: dopplerProjectName,
    config: dopplerConfigName,
    name: "VITE_BASE_URL",
    value: pulumi.all([dnsRecords.records, dopplerSecrets.VITE_BASE_URL]).apply(([records, existingUrl]) => {
        const url = existingUrl || "";
        if (url && url.trim() !== "" && !url.toLowerCase().includes("localhost")) {
            return url;
        }
        const wwwRecordKey = Object.keys(records).find((key) => key.includes("www"));
        if (wwwRecordKey && records[wwwRecordKey]) {
            const generatedUrl = `${protocol}://www.${domain}`;
            return generatedUrl;
        }
        return url || "";
    }),
});

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

const projectName = getProjectName();
export const dopplerInfo = {
    commands: {
        downloadEnv: "doppler secrets download --no-file --format env > .env",
        runDev: "doppler run -- bun run dev",
        runWithProject: `doppler run --project ${projectName} --config dev -- bun run dev`,
    },
};

export const cloudflareEnvVars = getCloudflareEnvVars(secrets);

export const summary = {
    environment: config.environment,
    domain: config.cloudflare.domain,
    secretsManagement: "Doppler",
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
