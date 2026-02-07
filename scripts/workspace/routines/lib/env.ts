#!/usr/bin/env bun

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import pc from "picocolors";

const COMPOSE_SECRETS_DIR = ".docker/secrets";

const COMPOSE_SECRET_DEFAULTS: Record<string, string> = {
    database_url: "mysql://user:password@tidb:4000/portfolio",
    redis_url: "redis://:password@cache:6379",
    better_auth_secret: "your-secret-key-here",
    better_auth_url: "http://localhost:3000",
    google_client_id: "",
    google_client_secret: "",
    cloudflare_account_id: "",
    cloudflare_api_token: "",
    node_env: "development",
    api_base_url: "http://localhost:8787",
    vite_base_url: "http://localhost:5173",
    sentry_dsn: "",
    sentry_org: "",
    sentry_project: "",
    sentry_auth_token: "",
    app_version: "1.0.0",
};

export const COMPOSE_ENV_ONLY_DEFAULTS: Record<string, string> = {
    VITE_GOOGLE_ANALYTICS_ENABLED: "false",
    VITE_GOOGLE_TAG_MANAGER_ENABLED: "false",
    VITE_XSTATE_INSPECTOR_ENABLED: "true",
    VITE_SENTRY_ENVIRONMENT: "development",
    VITE_SENTRY_TRACES_SAMPLE_RATE: "1",
    VITE_SENTRY_REPLAY_SAMPLE_RATE: "0",
    VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE: "0",
};

export function logSection(title: string): void {
    console.log();
    console.log(pc.bold(pc.cyan(`  ${title}`)));
    console.log(pc.dim(`  ${"─".repeat(50)}`));
}

export function logStep(
    icon: string,
    message: string,
    status: "info" | "success" | "warning" | "error" = "info",
): void {
    const colors = {
        info: pc.blue,
        success: pc.green,
        warning: pc.yellow,
        error: pc.red,
    };
    let statusIcon: string;
    if (status === "success") {
        statusIcon = "✓";
    } else if (status === "error") {
        statusIcon = "✗";
    } else if (status === "warning") {
        statusIcon = "⚠";
    } else {
        statusIcon = "→";
    }
    console.log(`  ${colors[status](statusIcon)} ${icon} ${message}`);
}

export function logSubStep(message: string, status: "info" | "success" | "warning" = "info"): void {
    const colors = {
        info: pc.dim,
        success: pc.green,
        warning: pc.yellow,
    };
    let statusIcon: string;
    if (status === "success") {
        statusIcon = "✓";
    } else if (status === "warning") {
        statusIcon = "⚠";
    } else {
        statusIcon = "  ";
    }
    console.log(`    ${colors[status](statusIcon)} ${message}`);
}

export class LoadingBar {
    private readonly message: string;
    private interval: ReturnType<typeof setInterval> | null = null;
    private readonly frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    private frameIndex = 0;
    private isActive = false;

    constructor(message: string) {
        this.message = message;
    }

    start(): void {
        if (this.isActive) return;
        this.isActive = true;
        this.frameIndex = 0;
        this.interval = setInterval(() => {
            const frame = this.frames[this.frameIndex % this.frames.length];
            process.stdout.write(`\r    ${pc.cyan(frame)} ${pc.dim(this.message)}`);
            this.frameIndex++;
        }, 100);
    }

    stop(success: boolean = true, finalMessage?: string): void {
        if (!this.isActive) return;
        this.isActive = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        process.stdout.write(`\r${" ".repeat(80)}\r`);
        if (finalMessage) {
            const messageStatus: "success" | "warning" = success ? "success" : "warning";
            logSubStep(finalMessage, messageStatus);
        }
    }
}

export async function setupComposeSecrets(rootDir: string): Promise<void> {
    logSection("📝 環境設定（compose secrets）");
    const secretsDir = join(rootDir, COMPOSE_SECRETS_DIR);

    if (!existsSync(secretsDir)) {
        logStep("📝", `${COMPOSE_SECRETS_DIR}/ を作成しています...`, "info");
        mkdirSync(secretsDir, { recursive: true });
    }

    let created = 0;
    for (const [name, defaultValue] of Object.entries(COMPOSE_SECRET_DEFAULTS)) {
        const filePath = join(secretsDir, name);
        if (existsSync(filePath)) {
            continue;
        }
        writeFileSync(filePath, defaultValue, "utf-8");
        logSubStep(`${name} を作成しました（開発用デフォルト）`, "info");
        created++;
    }

    if (created > 0) {
        logStep("", `${COMPOSE_SECRETS_DIR}/ に ${created} 件のシークレットファイルを作成しました`, "success");
    } else {
        logStep("", `${COMPOSE_SECRETS_DIR}/ は既に揃っています`, "success");
    }
}
