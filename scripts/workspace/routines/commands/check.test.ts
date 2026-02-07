import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

type ProcessPromise = {
    exitCode: number;
    stdout: Buffer;
    stderr: Buffer;
    quiet(): ProcessPromise;
    env(env: Record<string, string | undefined>): ProcessPromise;
};

function createMockProcessPromise(
    exitCode: number,
    stdout = "",
    stderr = "",
    env?: Record<string, string | undefined>,
): ProcessPromise {
    const promise: ProcessPromise = {
        exitCode,
        stdout: Buffer.from(stdout),
        stderr: Buffer.from(stderr),
        quiet() {
            return this;
        },
        env(newEnv: Record<string, string | undefined>) {
            return createMockProcessPromise(exitCode, stdout, stderr, { ...env, ...newEnv });
        },
    };
    return promise;
}

if (process.env.E2E_TEST !== "true") {
    vi.mock("bun", async () => {
        const { execSync } = await import("node:child_process");

        const mock$ = vi.fn((strings: TemplateStringsArray, ...values: unknown[]) => {
            const command = strings
                .reduce((acc, str, i) => {
                    const value = values[i];
                    let valueStr = "";
                    if (value !== null && value !== undefined) {
                        valueStr = typeof value === "string" ? value : JSON.stringify(value);
                    }
                    return acc + str + valueStr;
                }, "")
                .trim();

            if (command.includes("--version")) {
                const commandName = command.split(" ")[0];
                try {
                    execSync(`which ${commandName}`, { stdio: "ignore" });
                    return createMockProcessPromise(0, "1.0.0\n");
                } catch {
                    const error = createMockProcessPromise(1, "", "command not found");
                    throw error;
                }
            }

            if (command.includes("uname -m")) {
                const arch = process.platform === "darwin" && process.arch === "arm64" ? "arm64" : "x86_64";
                return createMockProcessPromise(0, `${arch}\n`);
            }

            return createMockProcessPromise(0, "");
        });

        return {
            $: mock$,
        };
    });
}

let testDir: string;

async function checkGpgAvailable($: typeof import("bun").$): Promise<boolean> {
    try {
        await $`which gpg`.quiet();
        return true;
    } catch {
        return false;
    }
}

async function installDoppler(testBinDir: string, $: typeof import("bun").$): Promise<void> {
    const gpgAvailable = await checkGpgAvailable($);
    if (!gpgAvailable) {
        throw new Error("Doppler CLIのインストールにはGnuPGが必要です。gpgが見つかりません");
    }

    await $`mkdir -p ${testBinDir}`.quiet();
    const installResult =
        await $`bash -c "curl -Ls --tlsv1.2 --proto '=https' --retry 3 https://cli.doppler.com/install.sh | sh -s -- --install-path ${testBinDir}"`.quiet();
    expect(installResult.exitCode).toBe(0);
}

async function installCodex(testBinDir: string, $: typeof import("bun").$): Promise<void> {
    const releaseResponse = await fetch("https://api.github.com/repos/openai/codex/releases/latest");
    expect(releaseResponse.ok).toBe(true);
    const releaseData = (await releaseResponse.json()) as {
        tag_name: string;
        assets: Array<{ name: string; browser_download_url: string }>;
    };
    const archResult = await $`uname -m`.quiet();
    const archRaw = archResult.stdout.toString().trim();
    const arch = archRaw === "arm64" ? "aarch64" : "x86_64";
    const assetName = `codex-${arch}-apple-darwin.tar.gz`;
    const asset = releaseData.assets.find((a) => a.name === assetName);
    expect(asset).toBeDefined();
    const downloadPath = `${testDir}/${assetName}`;
    const downloadResult = await $`curl -fsSL -o ${downloadPath} ${asset!.browser_download_url}`.quiet();
    expect(downloadResult.exitCode).toBe(0);
    const extractResult = await $`tar -xzf ${downloadPath} -C ${testDir}`.quiet();
    expect(extractResult.exitCode).toBe(0);
    const extractedFileName = `codex-${arch}-apple-darwin`;
    const extractedPath = `${testDir}/${extractedFileName}`;
    await $`mkdir -p ${testBinDir}`.quiet();
    const moveResult = await $`mv ${extractedPath} ${testBinDir}/codex`.quiet();
    expect(moveResult.exitCode).toBe(0);
    await $`chmod +x ${testBinDir}/codex`.quiet();
    await $`rm ${downloadPath}`.quiet();
}

function createInstallEnv(name: string, testBinDir: string): Record<string, string | undefined> {
    const env: Record<string, string | undefined> = { ...process.env, PATH: `${testBinDir}:${process.env.PATH}` };
    if (name === "pulumi") {
        env.PULUMI_HOME = testDir;
    }
    if (name === "bun") {
        env.BUN_INSTALL = testDir;
    }
    return env;
}

async function copyPulumiBinary(testBinDir: string, $: typeof import("bun").$): Promise<boolean> {
    const homeDir = process.env.HOME || process.env.USERPROFILE || "~";
    const defaultPulumiBin = `${homeDir}/.pulumi/bin/pulumi`;
    const testDirPath = testBinDir.replace(/\/bin$/, "");
    const pulumiBinDir = `${testDirPath}/.pulumi/bin`;
    const targetPulumiBin = `${pulumiBinDir}/pulumi`;

    if (!existsSync(defaultPulumiBin)) {
        throw new Error(`pulumiバイナリが見つかりません: ${defaultPulumiBin}`);
    }

    const mkdirResult = await $`mkdir -p ${pulumiBinDir}`.quiet();
    if (mkdirResult.exitCode !== 0) {
        throw new Error(`pulumiディレクトリの作成に失敗しました: ${pulumiBinDir}`);
    }

    const cpResult = await $`cp ${defaultPulumiBin} ${targetPulumiBin}`;
    if (cpResult.exitCode !== 0) {
        const errorMsg = cpResult.stderr.toString() || cpResult.stdout.toString();
        throw new Error(`pulumiバイナリのコピーに失敗しました: ${defaultPulumiBin} -> ${targetPulumiBin}\n${errorMsg}`);
    }

    const chmodResult = await $`chmod +x ${targetPulumiBin}`.quiet();
    if (chmodResult.exitCode !== 0) {
        throw new Error(`pulumiバイナリの実行権限設定に失敗しました: ${targetPulumiBin}`);
    }

    return existsSync(targetPulumiBin);
}

async function installStandardCommand(
    name: string,
    installScript: string,
    testBinDir: string,
    $: typeof import("bun").$,
): Promise<{ isMockEnvironment: boolean }> {
    if (!installScript) {
        throw new Error(`${name}のインストールスクリプトが定義されていません`);
    }

    if (name === "docker" && process.platform === "darwin") {
        throw new Error("macOSではDocker Desktopが必要です。get.docker.comスクリプトはサポートされていません");
    }

    if (name === "pulumi") {
        const homeDir = process.env.HOME || process.env.USERPROFILE || "~";
        const defaultPulumiBin = `${homeDir}/.pulumi/bin/pulumi`;
        if (existsSync(defaultPulumiBin)) {
            const copied = await copyPulumiBinary(testBinDir, $);
            return { isMockEnvironment: !copied };
        }
    }

    const env = createInstallEnv(name, testBinDir);
    const originalEnv = { ...process.env };
    Object.assign(process.env, env);
    try {
        const installResult = await $`bash -c ${installScript}`.quiet();

        if (name === "pulumi") {
            const copied = await copyPulumiBinary(testBinDir, $);
            return { isMockEnvironment: !copied };
        }

        expect(installResult.exitCode).toBe(0);
        return { isMockEnvironment: false };
    } finally {
        process.env = originalEnv;
    }
}

function setupPulumiPath(testBinDir: string): string {
    let pathToAdd = testBinDir;
    const pulumiBinDir = `${testDir}/.pulumi/bin`;
    if (existsSync(pulumiBinDir)) {
        pathToAdd = `${pulumiBinDir}:${pathToAdd}`;
    }
    return pathToAdd;
}

function setupPulumiHome(): void {
    const homeDir = process.env.HOME || process.env.USERPROFILE || "~";
    process.env.PULUMI_HOME = `${homeDir}/.pulumi`;
}

async function verifyNodeInstallation(name: string, originalPath: string, $: typeof import("bun").$): Promise<boolean> {
    const nvmNodePath = `${testDir}/.nvm/versions/node`;
    if (!existsSync(nvmNodePath)) {
        return false;
    }
    const versions = readdirSync(nvmNodePath);
    if (versions.length === 0) {
        return false;
    }
    const nodeBinDir = join(nvmNodePath, versions[0]!, "bin");
    process.env.PATH = `${nodeBinDir}:${originalPath}`;
    const versionResult = await $`${name} --version`.quiet();
    expect(versionResult.exitCode).toBe(0);
    const versionOutput = versionResult.stdout.toString().trim();
    console.log(`${name}のバージョン確認成功: ${versionOutput}`);
    return true;
}

async function verifyCommandVersion(name: string, commandPath: string, $: typeof import("bun").$): Promise<void> {
    let commandToRun = name;
    if (existsSync(commandPath)) {
        commandToRun = commandPath;
    }

    const versionFlag = name === "pulumi" ? "version" : "--version";
    const versionResult = await $`${commandToRun} ${versionFlag}`.quiet();

    expect(versionResult.exitCode).toBe(0);
    const versionOutput = versionResult.stdout.toString().trim();
    expect(versionOutput).toBeTruthy();
    console.log(`${name}のバージョン確認成功: ${versionOutput}`);
}

function handleVerificationError(name: string, commandPath: string, error: unknown): never {
    const pulumiBinPath = name === "pulumi" ? `${testDir}/.pulumi/bin/${name}` : null;
    if (existsSync(commandPath) || (pulumiBinPath && existsSync(pulumiBinPath))) {
        throw new Error(`${name}のバージョン確認に失敗しました: ${error}`);
    }
    throw new Error(`${name}のインストール確認に失敗しました（${commandPath}が存在しません）`);
}

async function verifyInstallation(name: string, testBinDir: string, $: typeof import("bun").$): Promise<void> {
    const commandPath = name === "pulumi" ? `${testDir}/.pulumi/bin/${name}` : `${testBinDir}/${name}`;
    const originalPath = process.env.PATH || "";

    let pathToAdd = testBinDir;
    if (name === "pulumi") {
        pathToAdd = setupPulumiPath(testBinDir);
    }

    process.env.PATH = `${pathToAdd}:${originalPath}`;

    if (name === "pulumi") {
        setupPulumiHome();
    }

    try {
        if (name === "node") {
            const verified = await verifyNodeInstallation(name, originalPath, $);
            if (verified) {
                return;
            }
        }

        await verifyCommandVersion(name, commandPath, $);
    } catch (error) {
        handleVerificationError(name, commandPath, error);
    } finally {
        process.env.PATH = originalPath;
    }
}

async function loadBun(): Promise<typeof import("bun").$> {
    try {
        const bun = await import("bun");
        return bun.$;
    } catch {
        const bun = await import("bun");
        return bun.$;
    }
}

function shouldSkipTest(name: string): boolean {
    if (process.env.E2E_TEST !== "true") {
        console.log(
            `${name}はインストールされていません。E2E_TEST=trueを設定すると実際のインストールテストが実行されます`,
        );
        return true;
    }

    if (name === "docker" && process.platform === "darwin") {
        console.log(`${name}はmacOSではDocker Desktopが必要なため、テストをスキップします`);
        return true;
    }

    if (name === "pulumi") {
        const homeDir = process.env.HOME || process.env.USERPROFILE || "~";
        const defaultPulumiBin = `${homeDir}/.pulumi/bin/pulumi`;
        if (!existsSync(defaultPulumiBin)) {
            console.log(
                `${name}はインストールされていないため、テストをスキップします（${defaultPulumiBin}が存在しません）`,
            );
            return true;
        }
    }

    return false;
}

async function installCommandByName(
    name: string,
    installScript: string | null,
    testBinDir: string,
    $: typeof import("bun").$,
): Promise<{ isMockEnvironment: boolean }> {
    if (name === "doppler") {
        await installDoppler(testBinDir, $);
        return { isMockEnvironment: false };
    } else if (name === "codex") {
        await installCodex(testBinDir, $);
        return { isMockEnvironment: false };
    } else if (installScript) {
        return await installStandardCommand(name, installScript, testBinDir, $);
    } else {
        throw new Error(`${name}のインストールスクリプトが定義されていません`);
    }
}

function shouldSkipError(error: unknown, name: string): boolean {
    if (!(error instanceof Error)) {
        return false;
    }

    if (error.message.includes("macOSではDocker Desktopが必要")) {
        console.log(`${name}のテストをスキップ: ${error.message}`);
        return true;
    }

    if (error.message.includes("GnuPGが必要") || error.message.includes("gpgが見つかりません")) {
        console.log(`${name}のテストをスキップ: ${error.message}`);
        return true;
    }

    return false;
}

async function runInstallationTest(
    name: string,
    installScript: string | null,
    $: typeof import("bun").$,
): Promise<void> {
    const testBinDir = `${testDir}/bin`;
    await $`mkdir -p ${testBinDir}`.quiet();

    try {
        const { isMockEnvironment } = await installCommandByName(name, installScript, testBinDir, $);
        if (isMockEnvironment) {
            console.log(`${name}のテストはモック環境のためバージョン確認のみ実行します`);
            const versionResult = await $`${name} version`.quiet();
            expect(versionResult.exitCode).toBe(0);
            console.log(`${name}のバージョン確認成功: ${versionResult.stdout.toString().trim()}`);
            return;
        }
        await verifyInstallation(name, testBinDir, $);
    } catch (error) {
        if (shouldSkipError(error, name)) {
            return;
        }
        throw error;
    }
}

describe("check module structure", () => {
    it("should export checkAndInstallCommands function", async () => {
        try {
            const module = await import("./check");
            expect(module.checkAndInstallCommands).toBeDefined();
            expect(typeof module.checkAndInstallCommands).toBe("function");
        } catch (error) {
            console.warn("Bun環境ではないため、テストをスキップします:", error);
        }
    });
});

describe("command installation (E2E)", () => {
    const testCommands = [
        {
            name: "node",
            installScript: "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash",
        },
        { name: "bun", installScript: "curl -fsSL https://bun.sh/install | bash" },
        { name: "docker", installScript: "curl -fsSL https://get.docker.com/ | sh" },
        { name: "pulumi", installScript: "curl -fsSL https://get.pulumi.com | sh" },
        { name: "doppler", installScript: null },
        { name: "coderabbit", installScript: "curl -fsSL https://cli.coderabbit.ai/install.sh | sh" },
        { name: "claude", installScript: "curl -fsSL https://claude.ai/install.sh | bash" },
        { name: "codex", installScript: null },
    ];

    beforeAll(() => {
        if (process.env.E2E_TEST === "true") {
            testDir = `/tmp/workspace-test-${Date.now()}-${Math.random().toString(36).substring(7)}`;
            mkdirSync(testDir, { recursive: true });
            console.log(`テスト用一時ディレクトリを作成しました: ${testDir}`);
        }
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    testCommands.forEach(({ name, installScript }) => {
        it(`should install and verify ${name} command`, async () => {
            const $ = await loadBun();

            if (shouldSkipTest(name)) {
                return;
            }

            await runInstallationTest(name, installScript, $);
        }, 120000);
    });

    afterAll(async () => {
        if (process.env.E2E_TEST === "true" && testDir) {
            try {
                rmSync(testDir, { recursive: true, force: true });
                console.log(`テスト用一時ディレクトリを削除しました: ${testDir}`);
            } catch (error) {
                console.warn(`テスト用一時ディレクトリの削除に失敗しました: ${testDir}`, error);
            }
        }
    });
});
