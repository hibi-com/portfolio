import * as fs from "node:fs";
import * as path from "node:path";
import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
import type { InfraConfig } from "../config.js";
import { getProjectName } from "../config.js";

export interface WorkerConfig {
    name: string;
    scriptPath?: string;
    scriptContent?: string;
    compatibilityDate?: string;
    compatibilityFlags?: string[];
    bindings?: {
        vars?: Record<string, string>;
        secrets?: Record<string, pulumi.Output<string>>;
        kvNamespaces?: Array<{ name: string; namespaceId: string }>;
        r2Buckets?: Array<{ name: string; bucketName: string }>;
        d1Databases?: Array<{ name: string; databaseId: string }>;
    };
    routes?: Array<{
        pattern: string;
        zoneId?: string;
    }>;
    customDomain?: string;
}

export interface WorkersOutputs {
    scripts: Record<string, cloudflare.WorkersScript>;
    routes: Record<string, cloudflare.WorkersRoute>;
    domains: Record<string, cloudflare.WorkersCustomDomain>;
    subdomains: Record<string, pulumi.Output<string>>;
}

type WorkerBinding = cloudflare.types.input.WorkersScriptBinding;

function generateRandomSuffix(resourceName: string): random.RandomString {
    return new random.RandomString(`${resourceName}-random-suffix`, {
        length: 6,
        special: false,
        upper: false,
        lower: true,
        numeric: true,
    });
}

function getScriptContent(worker: WorkerConfig): string {
    if (worker.scriptContent) {
        return worker.scriptContent;
    }
    if (worker.scriptPath) {
        return fs.readFileSync(path.resolve(process.cwd(), worker.scriptPath), "utf-8");
    }
    throw new Error(`Worker ${worker.name}: either scriptPath or scriptContent must be provided`);
}

function buildVarBindings(vars: Record<string, string>): WorkerBinding[] {
    const bindings: WorkerBinding[] = [];
    for (const [name, text] of Object.entries(vars)) {
        bindings.push({ name, text, type: "plain_text" });
    }
    return bindings;
}

function buildSecretBindings(secrets: Record<string, pulumi.Output<string>>): WorkerBinding[] {
    const bindings: WorkerBinding[] = [];
    for (const [name, text] of Object.entries(secrets)) {
        bindings.push({ name, text, type: "secret_text" });
    }
    return bindings;
}

function buildKvNamespaceBindings(kvNamespaces: Array<{ name: string; namespaceId: string }>): WorkerBinding[] {
    const bindings: WorkerBinding[] = [];
    for (const kv of kvNamespaces) {
        bindings.push({
            name: kv.name,
            namespaceId: kv.namespaceId,
            type: "kv_namespace",
        });
    }
    return bindings;
}

function buildR2BucketBindings(r2Buckets: Array<{ name: string; bucketName: string }>): WorkerBinding[] {
    const bindings: WorkerBinding[] = [];
    for (const r2 of r2Buckets) {
        bindings.push({
            name: r2.name,
            bucketName: r2.bucketName,
            type: "r2_bucket",
        });
    }
    return bindings;
}

function buildD1DatabaseBindings(d1Databases: Array<{ name: string; databaseId: string }>): WorkerBinding[] {
    const bindings: WorkerBinding[] = [];
    for (const d1 of d1Databases) {
        bindings.push({
            name: d1.name,
            id: d1.databaseId,
            type: "d1",
        });
    }
    return bindings;
}

function buildWorkerBindings(worker: WorkerConfig): WorkerBinding[] {
    const bindings: WorkerBinding[] = [];

    if (!worker.bindings) {
        return bindings;
    }

    if (worker.bindings.vars) {
        bindings.push(...buildVarBindings(worker.bindings.vars));
    }

    if (worker.bindings.secrets) {
        bindings.push(...buildSecretBindings(worker.bindings.secrets));
    }

    if (worker.bindings.kvNamespaces) {
        bindings.push(...buildKvNamespaceBindings(worker.bindings.kvNamespaces));
    }

    if (worker.bindings.r2Buckets) {
        bindings.push(...buildR2BucketBindings(worker.bindings.r2Buckets));
    }

    if (worker.bindings.d1Databases) {
        bindings.push(...buildD1DatabaseBindings(worker.bindings.d1Databases));
    }

    return bindings;
}

function createWorkerScript(
    worker: WorkerConfig,
    accountId: pulumi.Input<string>,
    resourceName: string,
    provider?: cloudflare.Provider,
): cloudflare.WorkersScript {
    const content = getScriptContent(worker);
    const bindings = buildWorkerBindings(worker);

    return new cloudflare.WorkersScript(
        resourceName,
        {
            accountId,
            scriptName: worker.name,
            content,
            mainModule: "worker.js",
            compatibilityDate: worker.compatibilityDate || "2025-01-01",
            compatibilityFlags: worker.compatibilityFlags || ["nodejs_compat"],
            bindings: bindings.length > 0 ? bindings : undefined,
        },
        {
            provider,
        },
    );
}

function createWorkerRoutes(
    worker: WorkerConfig,
    workerScript: cloudflare.WorkersScript,
    resourceName: string,
    zoneId: pulumi.Input<string>,
    provider?: cloudflare.Provider,
): Record<string, cloudflare.WorkersRoute> {
    const routes: Record<string, cloudflare.WorkersRoute> = {};

    if (!worker.routes) {
        return routes;
    }

    for (let i = 0; i < worker.routes.length; i++) {
        const route = worker.routes[i];
        if (route) {
            const routeResourceName = `${resourceName}-route-${i}`;
            routes[routeResourceName] = new cloudflare.WorkersRoute(
                routeResourceName,
                {
                    zoneId: route.zoneId || zoneId,
                    pattern: route.pattern,
                    script: workerScript.scriptName,
                },
                {
                    dependsOn: [workerScript],
                    provider,
                },
            );
        }
    }

    return routes;
}

function createWorkerDomain(
    worker: WorkerConfig,
    workerScript: cloudflare.WorkersScript,
    resourceName: string,
    accountId: pulumi.Input<string>,
    domain: string,
    zoneId: pulumi.Input<string>,
    provider?: cloudflare.Provider,
): cloudflare.WorkersCustomDomain | null {
    if (!worker.customDomain) {
        return null;
    }

    const domainResourceName = `${resourceName}-domain`;
    return new cloudflare.WorkersCustomDomain(
        domainResourceName,
        {
            accountId,
            hostname: `${worker.customDomain}.${domain}`,
            service: workerScript.scriptName,
            zoneId,
        },
        {
            dependsOn: [workerScript],
            provider,
        },
    );
}

export function createWorkers(
    config: InfraConfig,
    workers: WorkerConfig[],
    provider?: cloudflare.Provider,
): WorkersOutputs {
    const { accountId, zoneId, domain } = config.cloudflare;
    const createdScripts: Record<string, cloudflare.WorkersScript> = {};
    const createdRoutes: Record<string, cloudflare.WorkersRoute> = {};
    const createdDomains: Record<string, cloudflare.WorkersCustomDomain> = {};
    const createdSubdomains: Record<string, pulumi.Output<string>> = {};

    for (const worker of workers) {
        const resourceName = `worker-${worker.name}`;

        const workerScript = createWorkerScript(worker, accountId, resourceName, provider);
        createdScripts[resourceName] = workerScript;

        const subdomain = workerScript.scriptName.apply((name) => `${name}.workers.dev`);
        createdSubdomains[resourceName] = subdomain;

        const routes = createWorkerRoutes(worker, workerScript, resourceName, zoneId, provider);
        Object.assign(createdRoutes, routes);

        const workerDomain = createWorkerDomain(
            worker,
            workerScript,
            resourceName,
            accountId,
            domain,
            zoneId,
            provider,
        );
        if (workerDomain) {
            createdDomains[`${resourceName}-domain`] = workerDomain;
        }
    }

    return {
        scripts: createdScripts,
        routes: createdRoutes,
        domains: createdDomains,
        subdomains: createdSubdomains,
    };
}

export function createPortfolioApiWorker(
    config: InfraConfig,
    secrets: {
        databaseUrl: pulumi.Output<string>;
        redisUrl?: pulumi.Output<string>;
    },
    provider?: cloudflare.Provider,
): WorkersOutputs {
    const projectName = getProjectName();
    const { accountId, zoneId, domain } = config.cloudflare;
    const resourceName = `worker-${projectName}-api`;

    const apiRandomSuffix = generateRandomSuffix(`${projectName}-api-random`);
    const workerScriptName = pulumi
        .all([projectName, apiRandomSuffix.result])
        .apply(([name, suffix]) => `${name}-api-${suffix}`);

    const staticBindings: WorkerBinding[] = [
        {
            name: "NODE_ENV",
            text: "production",
            type: "plain_text",
        },
    ];

    const secretBindings: WorkerBinding[] = [
        {
            name: "DATABASE_URL",
            text: secrets.databaseUrl,
            type: "secret_text",
        },
    ];

    if (secrets.redisUrl) {
        secretBindings.push({
            name: "CACHE_URL",
            text: secrets.redisUrl,
            type: "secret_text",
        });
    }

    const allBindings = [...staticBindings, ...secretBindings];

    const workerScript = new cloudflare.WorkersScript(
        resourceName,
        {
            accountId,
            scriptName: workerScriptName,
            content: `
export default {
  async fetch(request, env, ctx) {
    return new Response("Portfolio API - Deployed via CI/CD", {
      headers: { "content-type": "text/plain" },
    });
  },
};
`,
            mainModule: "worker.js",
            compatibilityDate: "2025-01-01",
            compatibilityFlags: ["nodejs_compat"],
            bindings: allBindings,
        },
        {
            provider,
        },
    );

    const createdScripts: Record<string, cloudflare.WorkersScript> = {};
    createdScripts[resourceName] = workerScript;

    const createdRoutes: Record<string, cloudflare.WorkersRoute> = {};

    const createdDomains: Record<string, cloudflare.WorkersCustomDomain> = {};
    const workerDomain = new cloudflare.WorkersCustomDomain(
        `${resourceName}-domain`,
        {
            accountId,
            hostname: `api.${domain}`,
            service: workerScript.scriptName,
            zoneId,
        },
        {
            dependsOn: [workerScript],
            provider,
        },
    );
    createdDomains[`${resourceName}-domain`] = workerDomain;

    const subdomain = workerScript.scriptName.apply((name) => `${name}.workers.dev`);
    const createdSubdomains: Record<string, pulumi.Output<string>> = {};
    createdSubdomains[resourceName] = subdomain;

    return {
        scripts: createdScripts,
        routes: createdRoutes,
        domains: createdDomains,
        subdomains: createdSubdomains,
    };
}
