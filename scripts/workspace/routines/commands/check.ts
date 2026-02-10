import { existsSync } from "node:fs";
import { createInterface } from "node:readline";
import { $ } from "bun";
import pc from "picocolors";
import { LoadingBar, logSection, logStep } from "../lib/env";

interface CommandInfo {
    name: string;
    checkCommand: string;
    installScript: string | (() => Promise<void>);
    description: string;
    required: boolean;
}

async function checkCommandInstalled(command: string): Promise<{ installed: boolean; inPath: boolean }> {
    const originalPath = process.env.PATH || "";
    let commandToRun = command;
    let pathToAdd = "";
    let inPath = true;

    if (command === "pulumi") {
        const homeDir = process.env.HOME || process.env.USERPROFILE || "~";
        const pulumiBinDir = `${homeDir}/.pulumi/bin`;
        const pulumiBinPath = `${pulumiBinDir}/pulumi`;

        if (existsSync(pulumiBinPath)) {
            if (!originalPath.includes(pulumiBinDir)) {
                inPath = false;
            }
            commandToRun = pulumiBinPath;
        } else if (existsSync(pulumiBinDir)) {
            pathToAdd = `${pulumiBinDir}:`;
            process.env.PATH = `${pathToAdd}${originalPath}`;
        } else {
            return { installed: false, inPath: false };
        }
        process.env.PULUMI_HOME = `${homeDir}/.pulumi`;
    }

    try {
        const versionFlag = command === "pulumi" ? "version" : "--version";
        await $`${commandToRun} ${versionFlag}`.quiet();
        return { installed: true, inPath };
    } catch {
        return { installed: false, inPath: false };
    }
}

async function promptUser(question: string): Promise<boolean> {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            const normalized = answer.trim().toLowerCase();
            const result = normalized === "y" || normalized === "yes" || normalized === "はい";
            resolve(result);
        });
    });
}

async function installNode(): Promise<void> {
    logStep("", "nvmをインストールしています...", "info");
    try {
        await $`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`.quiet();
        logStep("", "nvmのインストールが完了しました", "success");
        logStep("", "シェルを再起動するか、以下のコマンドを実行してください:", "info");
        console.log(pc.dim(String.raw`    export NVM_DIR="$HOME/.nvm"`));
        console.log(pc.dim(String.raw`    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`));
        console.log(pc.dim(String.raw`    nvm install --lts`));
        console.log();
        console.log(pc.yellow("  注意: nodeのインストールにはシェルの再起動が必要です。"));
    } catch (error) {
        logStep("", "nvmのインストールに失敗しました", "error");
        throw error;
    }
}

async function installDocker(): Promise<void> {
    if (process.platform === "darwin") {
        logStep("", "macOSではDocker Desktopが必要です。get.docker.comスクリプトはサポートされていません", "warning");
        logStep("", "Docker Desktopをインストールしてください: https://www.docker.com/products/docker-desktop", "info");
        throw new Error("macOSではDocker Desktopが必要です。get.docker.comスクリプトはサポートされていません");
    }

    const loadingBar = new LoadingBar("Dockerをインストールしています...");
    loadingBar.start();
    try {
        const installResult = await $`curl -fsSL https://get.docker.com/ | sh`.quiet();

        if (installResult.exitCode !== 0) {
            loadingBar.stop(false);
            throw new Error("Dockerのインストールに失敗しました");
        }
        loadingBar.stop(true, "Dockerのインストールが完了しました");
    } catch (error) {
        loadingBar.stop(false);
        logStep("", "Dockerのインストールに失敗しました", "error");
        throw error;
    }
}

async function runShellInstallScript(name: string, script: string): Promise<void> {
    const loadingBar = new LoadingBar(`${name}をインストールしています...`);
    loadingBar.start();
    try {
        const result = await $`bash -c ${script}`.quiet();

        if (result.exitCode !== 0) {
            const errorOutput = result.stderr.toString() || result.stdout.toString();
            loadingBar.stop(false);
            logStep("", `${name}のインストールに失敗しました`, "error");
            if (errorOutput) {
                console.error(pc.dim(`  エラー出力: ${errorOutput.trim()}`));
            }
            throw new Error(`インストールスクリプトが終了コード ${result.exitCode} で終了しました`);
        }
        loadingBar.stop(true, `${name}のインストールが完了しました`);
    } catch (error) {
        loadingBar.stop(false);
        logStep("", `${name}のインストールに失敗しました`, "error");
        if (error instanceof Error) {
            console.error(pc.dim(`  エラー: ${error.message}`));
        }
        if (process.env.DEBUG) {
            console.error(error);
        }
        throw error;
    }
}

async function installCommand(commandInfo: CommandInfo): Promise<void> {
    if (typeof commandInfo.installScript === "string") {
        await runShellInstallScript(commandInfo.name, commandInfo.installScript);
    } else {
        await commandInfo.installScript();
    }
}

const COMMANDS: CommandInfo[] = [
    {
        name: "node",
        checkCommand: "node",
        installScript: installNode,
        description: "Node.js (nvm経由)",
        required: true,
    },
    {
        name: "bun",
        checkCommand: "bun",
        installScript: "curl -fsSL https://bun.sh/install | bash",
        description: "Bun",
        required: true,
    },
    {
        name: "docker",
        checkCommand: "docker",
        installScript: installDocker,
        description: "Docker",
        required: true,
    },
    {
        name: "pulumi",
        checkCommand: "pulumi",
        installScript: "curl -fsSL https://get.pulumi.com | sh",
        description: "Pulumi",
        required: true,
    },
    {
        name: "claude",
        checkCommand: "claude",
        installScript: "curl -fsSL https://claude.ai/install.sh | bash",
        description: "Claude Code",
        required: false,
    },
];

function showPathWarning(commandName: string): void {
    if (commandName !== "pulumi") {
        return;
    }

    const homeDir = process.env.HOME || process.env.USERPROFILE || "~";
    logStep("", "PATHに追加するには、シェル設定ファイルに以下を追加してください:", "info");
    const shell = process.env.SHELL || "";
    if (shell.includes("fish")) {
        console.log(pc.dim(String.raw`    fish_add_path ${homeDir}/.pulumi/bin`));
    } else {
        console.log(pc.dim(String.raw`    export PATH="$HOME/.pulumi/bin:$PATH"`));
    }
}

function handleInstalledCommand(commandInfo: CommandInfo, inPath: boolean, isAlreadyInstalled: boolean): void {
    const statusMessage = isAlreadyInstalled
        ? `${commandInfo.name}がインストールされています`
        : `${commandInfo.name}のインストールが確認されました`;

    if (inPath) {
        logStep("", statusMessage, "success");
    } else {
        const warningMessage = isAlreadyInstalled
            ? `${commandInfo.name}がインストールされていますが、PATHに含まれていません`
            : `${commandInfo.name}のインストールが確認されましたが、PATHに含まれていません`;
        logStep("", warningMessage, "warning");
        showPathWarning(commandInfo.name);
    }
}

async function handleInstallationPrompt(commandInfo: CommandInfo, isOptional: boolean): Promise<boolean> {
    const optionalText = isOptional ? "（オプション）" : "";
    const message = `${commandInfo.name}がインストールされていません${optionalText}。インストールしますか？ (y/n): `;

    const shouldInstall = await promptUser(message);

    if (!shouldInstall) {
        const skipStatus = isOptional ? "info" : "warning";
        logStep("", `${commandInfo.name}のインストールをスキップしました`, skipStatus);
        return false;
    }

    return true;
}

async function performInstallation(commandInfo: CommandInfo): Promise<void> {
    try {
        await installCommand(commandInfo);
        const { installed, inPath } = await checkCommandInstalled(commandInfo.checkCommand);

        if (installed) {
            handleInstalledCommand(commandInfo, inPath, false);
        } else {
            logStep(
                "",
                `${commandInfo.name}のインストール後、コマンドが見つかりません。シェルを再起動してください`,
                "warning",
            );
        }
    } catch (error) {
        logStep("", `${commandInfo.name}のインストールに失敗しました`, "error");
        if (error instanceof Error) {
            console.error(pc.dim(`  エラー: ${error.message}`));
        }
        if (process.env.DEBUG) {
            console.error(error);
        }
    }
}

async function handleCommandInstallation(commandInfo: CommandInfo, isOptional: boolean): Promise<void> {
    const { installed, inPath } = await checkCommandInstalled(commandInfo.checkCommand);

    if (installed) {
        handleInstalledCommand(commandInfo, inPath, true);
        return;
    }

    const shouldInstall = await handleInstallationPrompt(commandInfo, isOptional);
    if (!shouldInstall) {
        return;
    }

    await performInstallation(commandInfo);
}

async function processCommands(commands: CommandInfo[], isOptional: boolean): Promise<void> {
    if (isOptional && commands.length > 0) {
        console.log();
        logStep("", "オプションコマンドの確認", "info");
    }

    for (const commandInfo of commands) {
        if (!commandInfo) {
            continue;
        }
        await handleCommandInstallation(commandInfo, isOptional);
    }
}

export async function checkAndInstallCommands(): Promise<void> {
    logSection("🔍 コマンドのインストール確認");

    const requiredCommands = COMMANDS.filter((cmd) => cmd.required);
    const optionalCommands = COMMANDS.filter((cmd) => !cmd.required);

    await processCommands(requiredCommands, false);
    await processCommands(optionalCommands, true);

    console.log();
    logStep("", "コマンドの確認が完了しました", "success");
}
