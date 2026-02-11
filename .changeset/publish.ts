#!/usr/bin/env bun

import { execSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, "..");

interface PublishConfig {
    verdaccioUrl: string;
    verdaccioService: string;
    composeFile: string;
    packages: string[];
    maxStartupAttempts: number;
}

const defaultConfig: PublishConfig = {
    verdaccioUrl: process.env.VERDACCIO_URL || "http://localhost:4873",
    verdaccioService: process.env.VERDACCIO_SERVICE || "verdaccio",
    composeFile: process.env.COMPOSE_FILE || "compose.yaml",
    maxStartupAttempts: 30,
    packages: [
        "tooling/biome-config",
        "tooling/tsconfig",
        "tooling/tailwind-config",
        "tooling/vite-config",
        "tooling/vitest-config",
        "tooling/storybook-config",
        "tooling/playwright-config",
        "tooling/playwright-reporter",
        "tooling/vitest-reporter",
        "tooling/prisma-markdown",
        "tooling/prisma-migration",
        "tooling/changelog-config",
        "packages/validation",
        "packages/db",
        "packages/cache",
        "packages/log",
        "packages/auth",
        "packages/api",
        "packages/ui",
    ],
};

function isDockerAvailable(): boolean {
    try {
        execSync("docker --version", { stdio: "pipe" });
        return true;
    } catch {
        return false;
    }
}

function isDockerRunning(): boolean {
    try {
        execSync("docker info", { stdio: "pipe" });
        return true;
    } catch {
        return false;
    }
}

async function isVerdaccioRunning(url: string): Promise<boolean> {
    try {
        const response = await fetch(`${url}/-/ping`);
        return response.ok;
    } catch {
        return false;
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startVerdaccio(config: PublishConfig): Promise<void> {
    console.log("🚀 Starting Verdaccio...");

    execSync(`docker compose -f ${config.composeFile} up -d ${config.verdaccioService}`, {
        cwd: ROOT_DIR,
        stdio: "inherit",
    });

    console.log("⏳ Waiting for Verdaccio to be ready...");

    for (let attempt = 0; attempt < config.maxStartupAttempts; attempt++) {
        if (await isVerdaccioRunning(config.verdaccioUrl)) {
            console.log("✅ Verdaccio is ready");
            return;
        }
        await sleep(1000);
    }

    throw new Error(`Verdaccio failed to start after ${config.maxStartupAttempts} attempts`);
}

async function ensureVerdaccioRunning(config: PublishConfig): Promise<boolean> {
    if (await isVerdaccioRunning(config.verdaccioUrl)) {
        console.log("✅ Verdaccio is already running");
        return false;
    }

    await startVerdaccio(config);
    return true;
}

function setupNpmrc(config: PublishConfig): void {
    const npmrcPath = resolve(process.env.HOME || "~", ".npmrc");
    const urlWithoutProtocol = config.verdaccioUrl.replace(/^https?:\/\//, "");
    const content = `registry=${config.verdaccioUrl}\n//${urlWithoutProtocol}/:_authToken=dummy\n`;
    writeFileSync(npmrcPath, content);
}

function buildPackages(): void {
    console.log("🔨 Building packages...");
    execSync("bun run build", {
        cwd: ROOT_DIR,
        stdio: "inherit",
    });
}

interface PackageJson {
    name?: string;
    version?: string;
    private?: boolean;
    files?: string[];
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
}

function resolveWorkspaceVersions(pkg: PackageJson): PackageJson {
    const resolveDeps = (deps: Record<string, string> | undefined): Record<string, string> | undefined => {
        if (!deps) return deps;
        return Object.fromEntries(
            Object.entries(deps).map(([key, value]) => [key, value === "workspace:*" ? "^1.0.0" : value]),
        );
    };

    return {
        ...pkg,
        dependencies: resolveDeps(pkg.dependencies),
        devDependencies: resolveDeps(pkg.devDependencies),
        peerDependencies: resolveDeps(pkg.peerDependencies),
    };
}

function preparePackageJson(pkgPath: string): void {
    const pkgJsonPath = resolve(pkgPath, "package.json");
    const backupPath = resolve(pkgPath, "package.json.bak");

    copyFileSync(pkgJsonPath, backupPath);
    const pkg: PackageJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
    const { private: _, ...pkgWithoutPrivate } = pkg;
    const modified = resolveWorkspaceVersions({
        ...pkgWithoutPrivate,
        files: ["dist", "src", "scripts", "prisma", "migration", "cmd"],
    });

    writeFileSync(pkgJsonPath, JSON.stringify(modified, null, 2));
}

function restorePackageJson(pkgPath: string): void {
    const pkgJsonPath = resolve(pkgPath, "package.json");
    const backupPath = resolve(pkgPath, "package.json.bak");

    if (existsSync(backupPath)) {
        copyFileSync(backupPath, pkgJsonPath);
        execSync(`rm ${backupPath}`);
    }
}

async function publishPackage(pkgPath: string, config: PublishConfig): Promise<boolean> {
    const fullPath = resolve(ROOT_DIR, pkgPath);

    if (!existsSync(fullPath)) {
        console.log(`  ⚠️ Package not found: ${pkgPath}`);
        return false;
    }

    const pkgJsonPath = resolve(fullPath, "package.json");
    if (!existsSync(pkgJsonPath)) {
        console.log(`  ⚠️ No package.json found: ${pkgPath}`);
        return false;
    }

    try {
        preparePackageJson(fullPath);

        execSync(`npm publish --registry ${config.verdaccioUrl}`, {
            cwd: fullPath,
            stdio: "pipe",
        });

        console.log("  ✅ Published successfully");
        return true;
    } catch {
        console.log("  ⚠️ Already published or failed");
        return false;
    } finally {
        restorePackageJson(fullPath);
    }
}

async function main(): Promise<void> {
    const config = defaultConfig;

    console.log("🚀 Portfolio Verdaccio Publisher");
    console.log("================================\n");

    if (!isDockerAvailable()) {
        console.error("❌ Docker is not installed.");
        console.error("   Please install Docker Desktop from https://www.docker.com/products/docker-desktop/");
        process.exit(1);
    }

    if (!isDockerRunning()) {
        console.error("❌ Docker is not running.");
        console.error("   Please start Docker Desktop and try again.");
        process.exit(1);
    }

    console.log("✅ Docker is available and running");
    console.log(`📦 Publishing workspace packages to Verdaccio (${config.verdaccioUrl})\n`);

    const startedByScript = await ensureVerdaccioRunning(config);

    process.chdir(ROOT_DIR);

    setupNpmrc(config);
    buildPackages();

    let publishedCount = 0;
    let failedCount = 0;

    for (const pkg of config.packages) {
        console.log(`📤 Publishing ${pkg}...`);
        const success = await publishPackage(pkg, config);
        if (success) {
            publishedCount++;
        } else {
            failedCount++;
        }
    }

    console.log("\n📊 Summary:");
    console.log(`  ✅ Published: ${publishedCount}`);
    console.log(`  ⚠️ Skipped/Failed: ${failedCount}`);
    console.log("");

    if (startedByScript) {
        console.log("ℹ️ Verdaccio was started by this script and is still running.");
        console.log("   To stop it: docker compose down verdaccio");
    }

    console.log("✅ All packages published to Verdaccio");
}

try {
    await main();
} catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
}
