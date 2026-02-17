import * as cloudflare from "@pulumi/cloudflare";
import * as command from "@pulumi/command";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
import type { InfraConfig } from "../config.js";
import { getProjectName } from "../config.js";
import { getAdminEnvVars, getE2eEnvVars, getWebEnvVars, getWikiEnvVars } from "./secrets.js";

type EnvVarConfig = cloudflare.types.input.PagesProjectDeploymentConfigsProductionEnvVars;

export interface ServiceBindingConfig {
    service: pulumi.Input<string>;
    entrypoint?: string;
    environment?: string;
}

export type ServiceBindingConfigOutput = pulumi.Output<ServiceBindingConfig | undefined>;

export interface PagesProjectConfig {
    name: pulumi.Input<string>;
    productionBranch: string;
    buildCommand?: string;
    destinationDir?: string;
    rootDir?: string;
    environmentVariables?: Record<string, pulumi.Input<string>>;
    secrets?: Record<string, pulumi.Output<string>>;
    compatibilityDate?: string;
    customDomain?: string;
    serviceBinding?: ServiceBindingConfig | ServiceBindingConfigOutput;
}

export interface PagesOutputs {
    projects: Record<string, cloudflare.PagesProject>;
    domains: Record<string, cloudflare.PagesDomain>;
    subdomains: Record<string, pulumi.Output<string>>;
    serviceBindingCommands?: Record<string, command.local.Command>;
}

function generateRandomSuffix(resourceName: string): random.RandomString {
    return new random.RandomString(`${resourceName}-random-suffix`, {
        length: 6,
        special: false,
        upper: false,
        lower: true,
        numeric: true,
    });
}

function buildEnvVars(
    environmentVariables?: Record<string, pulumi.Input<string>>,
    secrets?: Record<string, pulumi.Output<string>>,
): Record<string, pulumi.Input<EnvVarConfig>> | undefined {
    const envVars: Record<string, pulumi.Input<EnvVarConfig>> = {};
    let hasEnvVars = false;

    if (environmentVariables) {
        for (const [key, value] of Object.entries(environmentVariables)) {
            envVars[key] = pulumi.output(value).apply((v) => ({ type: "plain_text" as const, value: v }));
            hasEnvVars = true;
        }
    }

    if (secrets) {
        for (const [key, value] of Object.entries(secrets)) {
            envVars[key] = value.apply((v) => ({ type: "secret_text" as const, value: v }));
            hasEnvVars = true;
        }
    }

    return hasEnvVars ? envVars : undefined;
}

export function createPagesProjects(
    config: InfraConfig,
    projects: PagesProjectConfig[],
    provider?: cloudflare.Provider,
): PagesOutputs {
    const { accountId, domain, apiToken } = config.cloudflare;
    const createdProjects: Record<string, cloudflare.PagesProject> = {};
    const createdDomains: Record<string, cloudflare.PagesDomain> = {};
    const createdSubdomains: Record<string, pulumi.Output<string>> = {};
    const serviceBindingCommands: Record<string, command.local.Command> = {};

    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        if (!project) continue;

        const resourceNameBase = `pages-project-${i}`;

        const productionEnvVars = buildEnvVars(project.environmentVariables, project.secrets);
        const previewEnvVars = buildEnvVars(
            { ...project.environmentVariables, NODE_ENV: "development" },
            project.secrets,
        );

        const pagesProject = new cloudflare.PagesProject(
            resourceNameBase,
            {
                accountId,
                name: project.name,
                productionBranch: project.productionBranch,
                buildConfig: {
                    buildCommand: project.buildCommand,
                    destinationDir: project.destinationDir || "dist",
                    rootDir: project.rootDir,
                },
                deploymentConfigs: {
                    production: {
                        envVars: productionEnvVars,
                        compatibilityDate: project.compatibilityDate || "2025-01-01",
                        compatibilityFlags: ["nodejs_compat"],
                    },
                    preview: {
                        envVars: previewEnvVars,
                        compatibilityDate: project.compatibilityDate || "2025-01-01",
                        compatibilityFlags: ["nodejs_compat"],
                    },
                },
            },
            {
                provider,
            },
        );

        createdProjects[resourceNameBase] = pagesProject;

        if (project.serviceBinding) {
            const serviceBindingOutput = pulumi.output(project.serviceBinding);

            const serviceBindingCommand = new command.local.Command(
                `${resourceNameBase}-service-binding`,
                {
                    create: pulumi
                        .all([pagesProject.name, serviceBindingOutput, accountId])
                        .apply(([projectName, binding, accId]) => {
                            if (!binding?.service) {
                                return 'echo "No service binding configured"';
                            }
                            const serviceName = binding.service;
                            const environment = binding.environment || "production";

                            const payload = JSON.stringify({
                                deployment_configs: {
                                    production: {
                                        services: {
                                            API_SERVICE: {
                                                service: serviceName,
                                                environment: environment,
                                            },
                                        },
                                    },
                                    preview: {
                                        services: {
                                            API_SERVICE: {
                                                service: serviceName,
                                                environment: environment,
                                            },
                                        },
                                    },
                                },
                            });

                            return `curl -s -X PATCH "https://api.cloudflare.com/client/v4/accounts/${accId}/pages/projects/${projectName}" \
                                -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                                -H "Content-Type: application/json" \
                                -d '${payload}'`;
                        }),
                    environment: {
                        CLOUDFLARE_API_TOKEN: apiToken,
                    },
                    triggers: [pagesProject.name, serviceBindingOutput],
                },
                {
                    dependsOn: [pagesProject],
                },
            );

            serviceBindingCommands[`${resourceNameBase}-service-binding`] = serviceBindingCommand;
        }

        const subdomain = pagesProject.name.apply((name) => `${name}.pages.dev`);
        const subdomainKey = project.customDomain || `project-${i}`;
        createdSubdomains[subdomainKey] = subdomain;

        if (project.customDomain) {
            const customDomainValue = project.customDomain;
            const domainResourceName = `${resourceNameBase}-domain`;
            createdDomains[domainResourceName] = new cloudflare.PagesDomain(
                domainResourceName,
                {
                    accountId,
                    projectName: pagesProject.name,
                    name: `${customDomainValue}.${domain}`,
                },
                {
                    dependsOn: [pagesProject],
                    provider,
                    deleteBeforeReplace: true,
                },
            );
        }
    }

    return {
        projects: createdProjects,
        domains: createdDomains,
        subdomains: createdSubdomains,
        serviceBindingCommands,
    };
}

export function createPortfolioPagesProjects(
    config: InfraConfig,
    _secrets: {
        databaseUrl: pulumi.Output<string>;
        redisUrl?: pulumi.Output<string>;
    },
    provider?: cloudflare.Provider,
    apiWorkerScriptName?: pulumi.Output<string>,
): PagesOutputs {
    const projectName = getProjectName();

    const webRandomSuffix = generateRandomSuffix(`${projectName}-web-random`);
    const adminRandomSuffix = generateRandomSuffix(`${projectName}-admin-random`);
    const wikiRandomSuffix = generateRandomSuffix(`${projectName}-wiki-random`);
    const e2eRandomSuffix = generateRandomSuffix(`${projectName}-e2e-random`);

    const webConfig = getWebEnvVars();
    const adminConfig = getAdminEnvVars();
    const wikiConfig = getWikiEnvVars();
    const e2eConfig = getE2eEnvVars();

    if (!apiWorkerScriptName) {
        throw new Error(
            "apiWorkerScriptName is required for Service Binding. Service Binding must be configured for admin and web Pages projects.",
        );
    }

    const webServiceBinding: pulumi.Output<ServiceBindingConfig> = apiWorkerScriptName.apply((scriptName) => {
        if (!scriptName || scriptName.trim() === "") {
            throw new Error("API Worker script name is empty. Service Binding cannot be configured.");
        }
        return {
            service: scriptName,
            environment: "production",
        };
    });

    const adminServiceBinding: pulumi.Output<ServiceBindingConfig> = apiWorkerScriptName.apply((scriptName) => {
        if (!scriptName || scriptName.trim() === "") {
            throw new Error("API Worker script name is empty. Service Binding cannot be configured.");
        }
        return {
            service: scriptName,
            environment: "production",
        };
    });

    const projects: PagesProjectConfig[] = [
        {
            name: pulumi.all([projectName, webRandomSuffix.result]).apply(([name, suffix]) => `${name}-web-${suffix}`),
            productionBranch: "master",
            buildCommand: "bun run build",
            destinationDir: "build/client",
            rootDir: "apps/web",
            customDomain: "www",
            environmentVariables: webConfig.envVars,
            secrets: webConfig.secrets,
            serviceBinding: webServiceBinding,
        },
        {
            name: pulumi
                .all([projectName, adminRandomSuffix.result])
                .apply(([name, suffix]) => `${name}-admin-${suffix}`),
            productionBranch: "master",
            buildCommand: "bun run build",
            destinationDir: "build",
            rootDir: "apps/admin",
            customDomain: "admin",
            environmentVariables: adminConfig.envVars,
            secrets: adminConfig.secrets,
            serviceBinding: adminServiceBinding,
        },
        {
            name: pulumi.all([projectName, e2eRandomSuffix.result]).apply(([name, suffix]) => `${name}-e2e-${suffix}`),
            productionBranch: "master",
            buildCommand: "bun run build",
            destinationDir: "build/client",
            rootDir: "apps/e2e",
            customDomain: "portal",
            environmentVariables: e2eConfig.envVars,
            secrets: e2eConfig.secrets,
        },
        {
            name: pulumi
                .all([projectName, wikiRandomSuffix.result])
                .apply(([name, suffix]) => `${name}-wiki-${suffix}`),
            productionBranch: "master",
            buildCommand: "bun run build",
            destinationDir: "build",
            rootDir: "apps/wiki",
            customDomain: "wiki",
            environmentVariables: wikiConfig.envVars,
        },
    ];

    return createPagesProjects(config, projects, provider);
}
