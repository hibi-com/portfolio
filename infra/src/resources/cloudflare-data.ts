import * as cloudflare from "@pulumi/cloudflare";
import type { InfraConfig } from "../config.js";
import { getProjectName } from "../config.js";

export interface CloudflareDataOutputs {
    database: cloudflare.D1Database;
    cache: cloudflare.WorkersKvNamespace;
    images: cloudflare.R2Bucket;
}

/**
 * Cloudflare データストア（D1 / KV / R2）を作成する。
 * R2 はアプリ画像（WebView 表示用）専用。CI 成果物用途ではない。
 */
export function createPortfolioCloudflareData(
    config: InfraConfig,
    provider?: cloudflare.Provider,
): CloudflareDataOutputs {
    const projectName = getProjectName();
    const env = config.environment;
    const { accountId } = config.cloudflare;

    const database = new cloudflare.D1Database(
        `${projectName}-db`,
        {
            accountId,
            name: `${projectName}-${env}-db`,
        },
        { provider },
    );

    const cache = new cloudflare.WorkersKvNamespace(
        `${projectName}-cache`,
        {
            accountId,
            title: `${projectName}-${env}-cache`,
        },
        { provider },
    );

    const images = new cloudflare.R2Bucket(
        `${projectName}-images`,
        {
            accountId,
            name: `${projectName}-${env}-images`,
        },
        { provider },
    );

    return { database, cache, images };
}
