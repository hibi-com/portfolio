import * as cloudflare from "@pulumi/cloudflare";
import * as pulumi from "@pulumi/pulumi";
import type { InfraConfig } from "../config.js";
import { getProjectName } from "../config.js";
import { dnsRecordName } from "../hostname.js";

export interface DnsRecordConfig {
    name: string;
    type: "A" | "AAAA" | "CNAME";
    content: string | pulumi.Output<string>;
    ttl?: number;
    proxied?: boolean;
    priority?: number;
    comment?: string;
}

export interface DnsOutputs {
    records: Record<string, cloudflare.DnsRecord>;
}

export function createDnsRecords(
    config: InfraConfig,
    records: DnsRecordConfig[],
    provider?: cloudflare.Provider,
): DnsOutputs {
    const { zoneId, domain } = config.cloudflare;
    const createdRecords: Record<string, cloudflare.DnsRecord> = {};

    for (const record of records) {
        const recordName = record.name === "@" ? domain : `${record.name}.${domain}`;
        const resourceName = `dns-${record.type.toLowerCase()}-${record.name.replaceAll(/[^a-z0-9]/gi, "-")}`;

        createdRecords[resourceName] = new cloudflare.DnsRecord(
            resourceName,
            {
                zoneId,
                name: recordName,
                type: record.type,
                content: record.content,
                ttl: record.proxied ? 1 : record.ttl || 3600,
                proxied: record.proxied ?? false,
                priority: record.priority,
                comment: record.comment || `Managed by Pulumi - ${resourceName}`,
            },
            {
                protect: true,
                provider,
            },
        );
    }

    return { records: createdRecords };
}

export function createSubdomainRecords(
    config: InfraConfig,
    subdomains: Array<{
        subdomain: string;
        target: string | pulumi.Output<string>;
        proxied?: boolean;
    }>,
    provider?: cloudflare.Provider,
): DnsOutputs {
    const records: DnsRecordConfig[] = subdomains.map((sub) => ({
        name: sub.subdomain,
        type: "CNAME" as const,
        content: sub.target,
        proxied: sub.proxied ?? true,
        comment: `Subdomain: ${sub.subdomain}`,
    }));

    return createDnsRecords(config, records, provider);
}

export function createPortfolioDnsRecords(
    config: InfraConfig,
    provider?: cloudflare.Provider,
    pagesSubdomains?: Record<string, pulumi.Output<string>>,
    workerSubdomains?: Record<string, pulumi.Output<string>>,
    workerCustomDomains?: Record<string, cloudflare.WorkersCustomDomain>,
): DnsOutputs {
    const projectName = getProjectName();
    const { environment } = config;

    const wwwName = dnsRecordName(environment, "www");
    const adminName = dnsRecordName(environment, "admin");
    const wikiName = dnsRecordName(environment, "wiki");
    const portalName = dnsRecordName(environment, "portal");
    const apiName = dnsRecordName(environment, "api");

    const defaultWebSubdomain = `${projectName}-web.pages.dev`;
    const defaultAdminSubdomain = `${projectName}-admin.pages.dev`;
    const defaultWikiSubdomain = `${projectName}-wiki.pages.dev`;
    const defaultPortalSubdomain = `${projectName}-e2e.pages.dev`;
    const defaultApiSubdomain = `${projectName}-api.workers.dev`;

    let webSubdomain: pulumi.Output<string>;
    let adminSubdomain: pulumi.Output<string>;
    let wikiSubdomain: pulumi.Output<string>;
    let portalSubdomain: pulumi.Output<string>;

    if (pagesSubdomains) {
        webSubdomain = pagesSubdomains[wwwName] ?? pulumi.output(defaultWebSubdomain);
        adminSubdomain = pagesSubdomains[adminName] ?? pulumi.output(defaultAdminSubdomain);
        wikiSubdomain = pagesSubdomains[wikiName] ?? pulumi.output(defaultWikiSubdomain);
        portalSubdomain = pagesSubdomains[portalName] ?? pulumi.output(defaultPortalSubdomain);
    } else {
        webSubdomain = pulumi.output(defaultWebSubdomain);
        adminSubdomain = pulumi.output(defaultAdminSubdomain);
        wikiSubdomain = pulumi.output(defaultWikiSubdomain);
        portalSubdomain = pulumi.output(defaultPortalSubdomain);
    }

    let apiSubdomain: pulumi.Output<string>;
    if (workerSubdomains) {
        const apiKey = Object.keys(workerSubdomains)[0];
        apiSubdomain =
            apiKey && workerSubdomains[apiKey] ? workerSubdomains[apiKey] : pulumi.output(defaultApiSubdomain);
    } else {
        apiSubdomain = pulumi.output(defaultApiSubdomain);
    }

    const records: DnsRecordConfig[] = [
        {
            name: wwwName,
            type: "CNAME",
            content: webSubdomain,
            proxied: true,
            comment: "Main web application",
        },
        {
            name: adminName,
            type: "CNAME",
            content: adminSubdomain,
            proxied: true,
            comment: "Admin dashboard",
        },
        {
            name: wikiName,
            type: "CNAME",
            content: wikiSubdomain,
            proxied: true,
            comment: "Documentation wiki",
        },
        {
            name: portalName,
            type: "CNAME",
            content: portalSubdomain,
            proxied: true,
            comment: "E2E portal",
        },
    ];

    const hasApiCustomDomain = workerCustomDomains && Object.keys(workerCustomDomains).length > 0;
    if (!hasApiCustomDomain) {
        records.push({
            name: apiName,
            type: "CNAME",
            content: apiSubdomain,
            proxied: true,
            comment: "API worker",
        });
    }

    return createDnsRecords(config, records, provider);
}
