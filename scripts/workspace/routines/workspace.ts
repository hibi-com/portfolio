#!/usr/bin/env bun

import { $ } from "bun";
import pc from "picocolors";
import { checkAndInstallCommands } from "./commands/check";
import { logStep } from "./lib/env";
import { findRootDir } from "./lib/root";
import type { ResolvedOptions, SetupOptions, SetupStep, StepId } from "./lib/types";
import { runDockerStep } from "./steps/docker";
import { runInstallStep } from "./steps/install";

export const SETUP_STEPS: Record<StepId, SetupStep> = {
    install: runInstallStep,
    docker: runDockerStep,
};

function shouldRunAll(options: SetupOptions): boolean {
    return !options.install && !options.docker;
}

function resolveOptions(options: SetupOptions): ResolvedOptions {
    const runAll = shouldRunAll(options);
    return {
        runInstall: runAll || options.install !== false,
        runDocker: runAll || options.docker !== false,
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

async function handleInstallStep(rootDir: string, runInstall: boolean): Promise<void> {
    if (!runInstall) {
        return;
    }

    const shouldSkipInstall = process.env.BUN_LIFECYCLE_EVENT === "prepare";
    if (shouldSkipInstall) {
        const { logSection } = await import("./lib/env");
        logSection("📦 依存関係のインストール");
        logStep("", "依存関係のインストールをスキップしました（prepareスクリプトから実行中）", "info");
        return;
    }

    await SETUP_STEPS.install({ rootDir, useLoadingBar: true });
}

async function runBuildTasks(rootDir: string, runDocker: boolean, parallel: boolean): Promise<void> {
    const useLoadingBar = !parallel;

    if (runDocker) {
        await SETUP_STEPS.docker({ rootDir, useLoadingBar });
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

        await handleInstallStep(rootDir, resolved.runInstall);
        await runBuildTasks(rootDir, resolved.runDocker, resolved.parallel);

        printSuccessMessage();
    } catch (error) {
        printErrorMessage(error);
        process.exit(1);
    }
}

export { findRootDir } from "./lib/root";
export type { SetupOptions } from "./lib/types";
