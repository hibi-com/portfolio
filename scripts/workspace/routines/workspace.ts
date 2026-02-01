#!/usr/bin/env bun

import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { $ } from "bun";
import pc from "picocolors";
import { checkAndInstallCommands } from "./check";
import { buildDockerImages } from "./docker";
import { logStep, setupComposeSecrets } from "./env";
import { installDependencies } from "./install";
import { runDatabaseMigrations } from "./migrate";
import { generatePrismaSchema } from "./schema";

export function findRootDir(startDir: string = process.cwd()): string {
    let currentDir = resolve(startDir);
    const root = resolve("/");

    while (currentDir !== root) {
        const packageJsonPath = join(currentDir, "package.json");
        const turboJsonPath = join(currentDir, "turbo.json");

        if (existsSync(packageJsonPath) && existsSync(turboJsonPath)) {
            return currentDir;
        }

        currentDir = resolve(currentDir, "..");
    }

    return process.cwd();
}

async function checkBunInstalled(): Promise<boolean> {
    if (process.versions?.bun !== undefined) {
        return true;
    }
    try {
        if ($ !== undefined) {
            await $`bun --version`.quiet();
            return true;
        }
    } catch {
        return false;
    }
    return false;
}

export interface SetupOptions {
    env?: boolean;
    install?: boolean;
    schema?: boolean;
    docker?: boolean;
    migrate?: boolean;
    parallel?: boolean;
}

interface ResolvedOptions {
    runEnv: boolean;
    runInstall: boolean;
    runSchema: boolean;
    runDocker: boolean;
    runMigrate: boolean;
    parallel: boolean;
}

function shouldRunAll(options: SetupOptions): boolean {
    return !options.env && !options.install && !options.schema && !options.docker && !options.migrate;
}

function resolveOptions(options: SetupOptions): ResolvedOptions {
    const runAll = shouldRunAll(options);
    return {
        runEnv: runAll || options.env !== false,
        runInstall: runAll || options.install !== false,
        runSchema: runAll || options.schema !== false,
        runDocker: runAll || options.docker !== false,
        runMigrate: runAll || options.migrate !== false,
        parallel: options.parallel ?? true,
    };
}

function printStartMessage(): void {
    console.log();
    console.log(pc.bold(pc.cyan("  ╭─────────────────────────────────────────────╮")));
    console.log(pc.bold(pc.cyan("  │  🚀 開発環境のセットアップを開始します      │")));
    console.log(pc.bold(pc.cyan("  ╰─────────────────────────────────────────────╯")));
}

function printSuccessMessage(): void {
    console.log();
    console.log(pc.bold(pc.green("  ╭─────────────────────────────────────────────╮")));
    console.log(pc.bold(pc.green("  │  ✅ セットアップが完了しました！            │")));
    console.log(pc.bold(pc.green("  ╰─────────────────────────────────────────────╯")));
    console.log();
    console.log(pc.bold("  次のステップ:"));
    console.log(pc.dim("    • 必要に応じて .docker/secrets/ の値を編集してください"));
    console.log(pc.dim("    • bun run dev で開発サーバー（docker compose up）を起動できます"));
    console.log();
}

function printErrorMessage(error: unknown): void {
    console.log();
    console.error(pc.bold(pc.red("  ╭─────────────────────────────────────────────╮")));
    console.error(pc.bold(pc.red("  │  ✗ セットアップ中にエラーが発生しました    │")));
    console.error(pc.bold(pc.red("  ╰─────────────────────────────────────────────╯")));
    console.error();
    console.error(pc.red("  "), error);
    console.error();
}

async function handleInstallStep(rootDir: string, runInstall: boolean): Promise<void> {
    if (!runInstall) {
        return;
    }

    const shouldSkipInstall = process.env.BUN_LIFECYCLE_EVENT === "prepare";
    if (shouldSkipInstall) {
        const { logSection } = await import("./env");
        logSection("📦 依存関係のインストール");
        logStep("", "依存関係のインストールをスキップしました（prepareスクリプトから実行中）", "info");
        return;
    }

    await installDependencies(rootDir);
}

async function runBuildTasks(
    rootDir: string,
    runSchema: boolean,
    runDocker: boolean,
    parallel: boolean,
): Promise<void> {
    const useLoadingBar = !parallel;

    if (parallel && (runSchema || runDocker)) {
        const tasks: Promise<void>[] = [];
        if (runSchema) {
            tasks.push(generatePrismaSchema(rootDir, useLoadingBar));
        }
        if (runDocker) {
            tasks.push(buildDockerImages(rootDir, useLoadingBar));
        }
        await Promise.all(tasks);
        return;
    }

    if (runSchema) {
        await generatePrismaSchema(rootDir, useLoadingBar);
    }
    if (runDocker) {
        await buildDockerImages(rootDir, useLoadingBar);
    }
}

export async function runWorkspace(options: SetupOptions = {}): Promise<void> {
    const rootDir = findRootDir();
    const resolved = resolveOptions(options);

    printStartMessage();

    const bunInstalled = await checkBunInstalled();
    if (!bunInstalled) {
        console.log();
        console.error(pc.red("  ✗ Bunがインストールされていません。"));
        console.error(pc.dim("    Bunをインストールしてください: https://bun.sh"));
        process.exit(1);
    }

    logStep("", "Bunがインストールされています", "success");

    try {
        await checkAndInstallCommands();

        if (resolved.runEnv) {
            await setupComposeSecrets(rootDir);
        }

        await handleInstallStep(rootDir, resolved.runInstall);
        await runBuildTasks(rootDir, resolved.runSchema, resolved.runDocker, resolved.parallel);

        if (resolved.runMigrate) {
            await runDatabaseMigrations(rootDir);
        }

        printSuccessMessage();
    } catch (error) {
        printErrorMessage(error);
        process.exit(1);
    }
}
