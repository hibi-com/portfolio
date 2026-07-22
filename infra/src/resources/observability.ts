import * as pulumi from "@pulumi/pulumi";
import * as sentry from "@pulumiverse/sentry";
import type { InfraConfig } from "../config.js";
import { getProjectName } from "../config.js";

export interface SentryOutputs {
    team: sentry.SentryTeam;
    projects: Record<string, sentry.SentryProject>;
    dsn: pulumi.Output<string>;
}

export function createPortfolioSentryConfig(config: InfraConfig, provider?: sentry.Provider): SentryOutputs {
    const projectName = getProjectName();
    const projectDisplayName = projectName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const team = new sentry.SentryTeam(
        `${projectName}-team`,
        {
            organization: config.sentry.org,
            slug: projectName,
            name: projectDisplayName,
        },
        provider ? { provider } : undefined,
    );

    const projects: Record<string, sentry.SentryProject> = {};

    const webProject = new sentry.SentryProject(
        `${projectName}-web-project`,
        {
            organization: config.sentry.org,
            teams: [team.slug],
            name: `${projectDisplayName} Web`,
            slug: `${projectName}-web`,
            platform: "javascript-nextjs",
        },
        provider ? { provider } : undefined,
    );
    projects["web"] = webProject;

    const apiProject = new sentry.SentryProject(
        `${projectName}-api-project`,
        {
            organization: config.sentry.org,
            teams: [team.slug],
            name: `${projectDisplayName} API`,
            slug: `${projectName}-api`,
            platform: "node",
        },
        provider ? { provider } : undefined,
    );
    projects["api"] = apiProject;

    const adminProject = new sentry.SentryProject(
        `${projectName}-admin-project`,
        {
            organization: config.sentry.org,
            teams: [team.slug],
            name: `${projectDisplayName} Admin`,
            slug: `${projectName}-admin`,
            platform: "javascript-react",
        },
        provider ? { provider } : undefined,
    );
    projects["admin"] = adminProject;

    const dsn = pulumi.interpolate`https://${config.sentry.authToken}@${config.sentry.org}.ingest.sentry.io/${webProject.id}`;

    return {
        team,
        projects,
        dsn,
    };
}

export interface ObservabilityOutputs {
    sentry: SentryOutputs;
}

export function createObservability(config: InfraConfig, sentryProvider?: sentry.Provider): ObservabilityOutputs {
    return {
        sentry: createPortfolioSentryConfig(config, sentryProvider),
    };
}
