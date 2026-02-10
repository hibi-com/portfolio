import { existsSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { $ } from "bun";

declare const Bun: {
    spawn: (
        args: string[],
        options?: { stdout?: "inherit" | "pipe"; stderr?: "inherit" | "pipe"; cwd?: string },
    ) => {
        exited: Promise<number>;
        exitCode: number | null;
        stdout: ReadableStream | null;
        stderr: ReadableStream | null;
    };
};

type CheckType = "lint" | "fmt" | "test" | "coverage";
type LintType = "ts" | "tsp" | "md" | "shell" | "actions" | "textlint";

interface Config {
    checkType: CheckType;
    lintType: LintType;
    isFix: boolean;
}

function findRootDir(startDir: string = process.cwd()): string {
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

function parseArgs(): { config: Config; files: string[] } {
    const args = process.argv.slice(2);
    let checkType: CheckType = "lint";
    let lintType: LintType = "ts";
    let isFix = false;
    const files: string[] = [];

    for (const arg of args) {
        if (arg.startsWith("--check-type=")) {
            checkType = arg.split("=")[1] as CheckType;
        } else if (arg.startsWith("--lint-type=")) {
            lintType = arg.split("=")[1] as LintType;
        } else if (arg === "--fix") {
            isFix = true;
        } else if (!arg.startsWith("--")) {
            files.push(arg);
        }
    }

    return {
        config: { checkType, lintType, isFix },
        files,
    };
}

function getWorkspaceFromPath(filePath: string, rootDir: string): string | null {
    const absolutePath = resolve(rootDir, filePath);
    const relativePath = relative(rootDir, absolutePath);

    const workspacePatterns = [
        /^apps\/([^/]+)/,
        /^packages\/([^/]+)/,
        /^tooling\/([^/]+)/,
        /^testing\/([^/]+)/,
        /^scripts\/([^/]+)/,
    ];

    for (const pattern of workspacePatterns) {
        const match = pattern.exec(relativePath);
        if (match) {
            const workspace = match[1];
            if (workspace) {
                return workspace;
            }
        }
    }

    return null;
}

function getDefaultPath(lintType: LintType, rootDir: string): string[] {
    switch (lintType) {
        case "tsp":
            return [join(rootDir, "packages/api/src/schema/")];
        case "md":
            return [join(rootDir, "apps/wiki/docs/")];
        case "shell": {
            const dockerDir = join(rootDir, ".docker");
            const files: string[] = [];
            try {
                const dockerFiles = (readdirSync(dockerDir, { recursive: true }) as string[])
                    .filter((f) => f.endsWith(".sh"))
                    .map((f) => join(dockerDir, f));
                files.push(...dockerFiles);
            } catch {
                // .docker directory not found or no shell scripts
            }
            return files;
        }
        case "actions":
            return [join(rootDir, ".github/")];
        case "textlint":
            return [join(rootDir, "apps/wiki/docs/")];
        default:
            return [
                join(rootDir, "apps/*/app/"),
                join(rootDir, "packages/*/src/"),
                join(rootDir, "tooling/*/src/"),
                join(rootDir, "testing/*/src/"),
            ];
    }
}

function getTestFilePath(sourceFile: string): string | null {
    const testFile = sourceFile.replace(/\.(ts|tsx)$/, ".test.$1");
    return existsSync(testFile) ? testFile : null;
}

function getSourceFilePath(testFile: string): string | null {
    const sourceFile = testFile.replace(/\.test\.(ts|tsx)$/, ".$1");
    return existsSync(sourceFile) ? sourceFile : null;
}

async function checkFileCoverage(sourceFile: string, rootDir: string): Promise<void> {
    const absoluteSourceFile = resolve(rootDir, sourceFile);
    const vitestPath = join(rootDir, "node_modules", ".bin", "vitest");
    const testFile = getTestFilePath(absoluteSourceFile);

    if (!testFile) {
        console.error(`Error: Test file not found for ${sourceFile}`);
        process.exit(1);
    }

    await $`${vitestPath} run --coverage --coverage.include=${absoluteSourceFile} --coverage.threshold.lines=100 --coverage.threshold.functions=100 --coverage.threshold.branches=100 --coverage.threshold.statements=100 ${testFile}`
        .cwd(rootDir)
        .env({
            NODE_ENV: "test",
            PATH: process.env.PATH || "",
        });
}

async function runTest(files: string[], lintType: LintType, rootDir: string): Promise<void> {
    if (lintType !== "ts") {
        console.error(`Error: --lint-type=${lintType} is not supported for test. Only --lint-type=ts is supported.`);
        process.exit(1);
    }
    const absoluteFiles = files.map((f) => resolve(rootDir, f));
    const vitestPath = join(rootDir, "node_modules", ".bin", "vitest");
    await $`${vitestPath} run ${absoluteFiles}`.cwd(rootDir).env({
        NODE_ENV: "test",
        PATH: process.env.PATH || "",
    });
}

async function runCoverage(files: string[], lintType: LintType, rootDir: string): Promise<void> {
    if (lintType !== "ts") {
        console.error(
            `Error: --lint-type=${lintType} is not supported for coverage. Only --lint-type=ts is supported.`,
        );
        process.exit(1);
    }
    const vitestPath = join(rootDir, "node_modules", ".bin", "vitest");

    if (files.length > 0) {
        const sourceFiles = files
            .map((f) => {
                const absolutePath = resolve(rootDir, f);
                if (f.includes(".test.")) {
                    return getSourceFilePath(absolutePath);
                }
                return absolutePath;
            })
            .filter((f): f is string => f !== null);

        if (sourceFiles.length === 0) {
            console.error("Error: No source files found");
            process.exit(1);
        }

        for (const sourceFile of sourceFiles) {
            await checkFileCoverage(relative(rootDir, sourceFile), rootDir);
        }
        return;
    }

    await $`${vitestPath} run --coverage`.cwd(rootDir).env({
        NODE_ENV: "test",
        PATH: process.env.PATH || "",
    });
}

async function runTspCommand(
    tspPath: string,
    checkType: CheckType,
    isFix: boolean,
    files: string[],
    rootDir: string,
): Promise<void> {
    const absoluteFiles = files.map((f) => resolve(rootDir, f));
    if (checkType === "fmt") {
        if (isFix) {
            await $`${tspPath} format ${absoluteFiles}`.cwd(rootDir);
        } else {
            await $`${tspPath} format --check ${absoluteFiles}`.cwd(rootDir);
        }
        return;
    }

    if (isFix) {
        await $`${tspPath} compile ${absoluteFiles}`.cwd(rootDir);
    } else {
        await $`${tspPath} compile ${absoluteFiles} --warn-as-error`.cwd(rootDir);
    }
}

function getTurboCommand(checkType: CheckType, isFix: boolean): string {
    if (checkType === "fmt") {
        return isFix ? "fmt" : "fmt:check";
    }
    return isFix ? "lint:fix" : "lint";
}

async function runWorkspaceCommand(
    workspaces: Set<string>,
    checkType: CheckType,
    isFix: boolean,
    rootDir: string,
): Promise<void> {
    if (workspaces.size === 0) {
        return;
    }

    const workspaceList = Array.from(workspaces);
    const filter = workspaceList.map((w) => `--filter=${w}`).join(" ");
    const command = getTurboCommand(checkType, isFix);
    await $`turbo run ${command} ${filter}`.cwd(rootDir);
}

async function runRootFilesCommand(
    biomePath: string,
    checkType: CheckType,
    isFix: boolean,
    rootFiles: string[],
    rootDir: string,
): Promise<void> {
    if (rootFiles.length === 0) {
        return;
    }

    const isFormat = checkType === "fmt";

    if (isFormat) {
        if (isFix) {
            await $`${biomePath} check --write --only=formatter --organize-imports-enabled=true ${rootFiles}`.cwd(
                rootDir,
            );
        } else {
            await $`${biomePath} check --only=formatter --organize-imports-enabled=true ${rootFiles}`.cwd(rootDir);
        }
    } else if (isFix) {
        await $`${biomePath} check --write --only=linter --organize-imports-enabled=true ${rootFiles}`.cwd(rootDir);
    } else {
        await $`${biomePath} check --only=linter --organize-imports-enabled=true ${rootFiles}`.cwd(rootDir);
    }
}

async function runTsCommand(
    biomePath: string,
    checkType: CheckType,
    isFix: boolean,
    files: string[],
    rootDir: string,
): Promise<void> {
    const workspaces = new Set<string>();
    const rootFiles: string[] = [];

    for (const file of files) {
        const absoluteFile = resolve(rootDir, file);
        const workspace = getWorkspaceFromPath(absoluteFile, rootDir);
        if (workspace) {
            workspaces.add(workspace);
        } else {
            rootFiles.push(absoluteFile);
        }
    }

    await runWorkspaceCommand(workspaces, checkType, isFix, rootDir);
    await runRootFilesCommand(biomePath, checkType, isFix, rootFiles, rootDir);
}

async function runMdCommand(checkType: CheckType, isFix: boolean, files: string[], rootDir: string): Promise<void> {
    const absoluteFiles = files.map((f) => resolve(rootDir, f));
    if (checkType === "fmt") {
        if (isFix) {
            await $`remark ${absoluteFiles} --output`.cwd(rootDir);
        } else {
            await $`remark ${absoluteFiles} --frail --quiet`.cwd(rootDir);
        }
        return;
    }

    const markdownlintPath = join(rootDir, "node_modules", ".bin", "markdownlint-cli2");
    if (isFix) {
        await $`${markdownlintPath} --fix ${absoluteFiles}`.cwd(rootDir);
    } else {
        await $`${markdownlintPath} ${absoluteFiles}`.cwd(rootDir);
    }
}

async function runShellCommand(checkType: CheckType, isFix: boolean, files: string[], rootDir: string): Promise<void> {
    const absoluteFiles = files.map((f) => resolve(rootDir, f));

    if (absoluteFiles.length === 0) {
        console.log("No shell files to check");
        return;
    }

    if (checkType === "fmt") {
        if (isFix) {
            await $`go run mvdan.cc/sh/v3/cmd/shfmt@v3.12.0 -w ${absoluteFiles}`.cwd(rootDir);
        } else {
            await $`go run mvdan.cc/sh/v3/cmd/shfmt@v3.12.0 -l -d ${absoluteFiles}`.cwd(rootDir);
        }
        return;
    }

    const relativeFiles = absoluteFiles.map((f) => relative(rootDir, f));

    await $`docker run --rm -v ${rootDir}:/work -w /work -v ${rootDir}/node_modules:/work/node_modules koalaman/shellcheck:v0.11.0 ${relativeFiles}`;
}

async function runTextlintCommand(
    checkType: CheckType,
    isFix: boolean,
    files: string[],
    rootDir: string,
): Promise<void> {
    if (checkType === "fmt") {
        console.error("Error: textlint does not support formatting. Use --check-type=lint instead.");
        process.exit(1);
    }

    const absoluteFiles = files.map((f) => resolve(rootDir, f));
    const textlintPath = join(rootDir, "node_modules", ".bin", "textlint");
    if (isFix) {
        await $`${textlintPath} --fix ${absoluteFiles}`.cwd(rootDir);
    } else {
        await $`${textlintPath} ${absoluteFiles}`.cwd(rootDir);
    }
}

async function runActionsCommand(
    checkType: CheckType,
    isFix: boolean,
    files: string[],
    _rootDir: string,
): Promise<void> {
    if (checkType === "fmt") {
        const args = isFix ? [] : ["-lint"];
        args.push("-gitignore_excludes", ...files);
        const proc = Bun.spawn(["go", "run", "github.com/google/yamlfmt/cmd/yamlfmt@v0.20.0", ...args], {
            stdout: "inherit",
            stderr: "inherit",
        });
        await proc.exited;
        if (proc.exitCode !== 0) {
            process.exit(proc.exitCode || 1);
        }
        return;
    }

    const actionlintProc = Bun.spawn(["go", "run", "github.com/rhysd/actionlint/cmd/actionlint@v1.7.9"], {
        stdout: "inherit",
        stderr: "inherit",
    });

    const ghalintArgs = ["go", "run", "github.com/suzuki-shunsuke/ghalint/cmd/ghalint@v1.5.4", "run", ...files];
    const ghalintProc = Bun.spawn(ghalintArgs, {
        stdout: "inherit",
        stderr: "inherit",
    });

    const [actionlintExitCode, ghalintExitCode] = await Promise.all([
        actionlintProc.exited.then(() => actionlintProc.exitCode),
        ghalintProc.exited.then(() => ghalintProc.exitCode),
    ]);

    if (actionlintExitCode !== 0 || ghalintExitCode !== 0) {
        process.exit(1);
    }
}

async function runLintOrFormatCommand(config: Config, files: string[], rootDir: string): Promise<void> {
    const { checkType, lintType } = config;
    const nodeModulesBin = join(rootDir, "node_modules", ".bin");

    switch (lintType) {
        case "tsp": {
            const tspPath = join(nodeModulesBin, "tsp");
            await runTspCommand(tspPath, checkType, config.isFix, files, rootDir);
            break;
        }
        case "md": {
            await runMdCommand(checkType, config.isFix, files, rootDir);
            break;
        }
        case "shell": {
            await runShellCommand(checkType, config.isFix, files, rootDir);
            break;
        }
        case "actions": {
            await runActionsCommand(checkType, config.isFix, files, rootDir);
            break;
        }
        case "textlint": {
            await runTextlintCommand(checkType, config.isFix, files, rootDir);
            break;
        }
        default: {
            const biomePath = join(nodeModulesBin, "biome");
            await runTsCommand(biomePath, checkType, config.isFix, files, rootDir);
        }
    }
}

export async function runCheck(): Promise<void> {
    const ROOT_DIR = findRootDir();
    const { config, files: parsedFiles } = parseArgs();

    try {
        if (config.checkType === "coverage") {
            await runCoverage(parsedFiles, config.lintType, ROOT_DIR);
        } else if (config.checkType === "test") {
            await runTest(parsedFiles, config.lintType, ROOT_DIR);
        } else {
            const defaultPath = getDefaultPath(config.lintType, ROOT_DIR);
            const files = parsedFiles.length > 0 ? parsedFiles : defaultPath;
            await runLintOrFormatCommand(config, files, ROOT_DIR);
        }
        process.exit(0);
    } catch {
        process.exit(1);
    }
}
