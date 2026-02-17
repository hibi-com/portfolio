import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { $ } from "bun";
import pc from "picocolors";
import { findNearestPackage, findRepoRoot } from "./dispatch";
import { LoadingBar, logStep } from "./utils";

function getWorkspaceDir(filePath: string, rootDir: string): string | null {
    const absolutePath = filePath.startsWith("/") ? filePath : resolve(rootDir, filePath);
    const nearestPackage = findNearestPackage(absolutePath, rootDir);
    if (!nearestPackage) {
        return null;
    }
    return nearestPackage.replace(`${rootDir}/`, "");
}

function filterFilenames(filenames: string[], rootDir: string): string[] {
    return filenames
        .map((f) => (f.startsWith("/") ? f.replace(`${rootDir}/`, "") : f))
        .filter(
            (f) =>
                !f.includes("worker-configuration.d.ts") &&
                !f.includes("/.astro/") &&
                !f.includes("/.turbo/") &&
                !f.includes("/.tanstack/") &&
                !f.includes("/.wrangler/") &&
                !f.includes("/build/") &&
                !f.includes("/dist/") &&
                !f.includes("/report/") &&
                !f.includes("/coverage/"),
        );
}

function getSourceFiles(filteredFilenames: string[]): string[] {
    return filteredFilenames.filter(
        (f) => !f.endsWith(".test.ts") && !f.endsWith(".test.tsx") && (f.endsWith(".ts") || f.endsWith(".tsx")),
    );
}

function getSourceFilesWithTests(sourceFiles: string[], rootDir: string): string[] {
    return sourceFiles.filter((f) => {
        const absolutePath = f.startsWith("/") ? f : `${rootDir}/${f}`;
        const testFile = absolutePath.replace(/\.(ts|tsx)$/, ".test.$1");
        return existsSync(testFile);
    });
}

function groupFilesByWorkspace(
    filteredFilenames: string[],
    rootDir: string,
): {
    workspaceGroups: Map<string, string[]>;
    rootFiles: string[];
} {
    const workspaceGroups = new Map<string, string[]>();
    const rootFiles: string[] = [];

    for (const file of filteredFilenames) {
        const relativeFile = file.startsWith("/") ? file.replace(`${rootDir}/`, "") : file;
        const workspaceDir = getWorkspaceDir(relativeFile, rootDir);
        if (workspaceDir) {
            if (!workspaceGroups.has(workspaceDir)) {
                workspaceGroups.set(workspaceDir, []);
            }
            workspaceGroups.get(workspaceDir)!.push(relativeFile);
        } else {
            rootFiles.push(relativeFile);
        }
    }

    return { workspaceGroups, rootFiles };
}

function addWorkspaceCommands(workspaceGroups: Map<string, string[]>, rootDir: string, commands: string[]): void {
    for (const [workspaceDir] of workspaceGroups) {
        commands.push(`cd ${join(rootDir, workspaceDir)} && bun run fmt:check && bun run lint`);
    }
}

function addRootCommands(rootFiles: string[], rootDir: string, commands: string[]): void {
    if (rootFiles.length === 0) {
        return;
    }
    const rootWorkspaceFiles = rootFiles.filter(
        (f) => f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".js") || f.endsWith(".jsx"),
    );
    if (rootWorkspaceFiles.length > 0) {
        commands.push(`cd ${rootDir} && bun run fmt:check`, `cd ${rootDir} && bun run lint`);
    }
}

function addTestCommands(sourceFilesWithTests: string[], rootDir: string, commands: string[]): void {
    for (const sourceFile of sourceFilesWithTests) {
        const relativeSourceFile = sourceFile.startsWith("/") ? sourceFile.replace(`${rootDir}/`, "") : sourceFile;
        const workspaceDir = getWorkspaceDir(relativeSourceFile, rootDir);
        const testFile = relativeSourceFile.replace(/\.(ts|tsx)$/, ".test.$1");
        if (workspaceDir) {
            const workspacePath = join(rootDir, workspaceDir);
            const workspaceRelativeTestFile = testFile.replace(`${workspaceDir}/`, "");
            const workspaceRelativeSourceFile = relativeSourceFile.replace(`${workspaceDir}/`, "");
            commands.push(
                `cd ${workspacePath} && bun run test -- ${workspaceRelativeTestFile}`,
                `cd ${workspacePath} && bun run coverage -- ${workspaceRelativeSourceFile}`,
            );
        }
    }
}

function processTypeScriptFiles(filenames: string[], rootDir: string): string[] {
    const filteredFilenames = filterFilenames(filenames, rootDir);
    const sourceFiles = getSourceFiles(filteredFilenames);
    const sourceFilesWithTests = getSourceFilesWithTests(sourceFiles, rootDir);
    const hasTsFiles = filteredFilenames.some((f) => f.endsWith(".ts") || f.endsWith(".tsx"));

    const { workspaceGroups, rootFiles } = groupFilesByWorkspace(filteredFilenames, rootDir);

    const commands: string[] = [];

    addWorkspaceCommands(workspaceGroups, rootDir, commands);
    addRootCommands(rootFiles, rootDir, commands);
    addTestCommands(sourceFilesWithTests, rootDir, commands);

    if (hasTsFiles) {
        commands.push(`cd ${rootDir} && bun run typecheck`);
    }

    return commands;
}

function matchesPattern(file: string, pattern: string): boolean {
    if (pattern === "*.{ts,tsx}") {
        return file.endsWith(".ts") || file.endsWith(".tsx");
    }
    if (pattern === "*.config.js") {
        return file.endsWith(".config.js");
    }
    if (pattern === "*.md") {
        return file.endsWith(".md");
    }
    if (pattern === "*.sh") {
        return file.endsWith(".sh");
    }
    if (pattern === "*.tsp") {
        return file.endsWith(".tsp");
    }
    if (pattern === "**/*.test.{ts,tsx}") {
        return file.includes(".test.ts") || file.includes(".test.tsx");
    }
    if (pattern.startsWith(".github/") && pattern.endsWith("/*.yml")) {
        return file.startsWith(".github/") && file.endsWith(".yml");
    }
    return false;
}

function getStagedFiles(): string[] {
    try {
        const output = execSync("git diff --cached --name-only --diff-filter=ACM", { encoding: "utf-8" });
        return output
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
    } catch (error) {
        console.error("Error getting staged files:", error);
        return [];
    }
}

async function runCommand(command: string): Promise<boolean> {
    try {
        await $`sh -c ${command}`;
        return true;
    } catch {
        return false;
    }
}

function processFiles(filenames: string[], rootDir: string): string[] {
    if (!Array.isArray(filenames) || filenames.length === 0) {
        return [];
    }

    const config: Record<string, (files: string[]) => string[]> = {
        ".github/**/*.yml": (filenames) =>
            filenames.flatMap((f) => [`bun run fmt:actions:check -- ${f}`, `bun run lint:actions:check -- ${f}`]),
        "*.{ts,tsx}": (filenames) => processTypeScriptFiles(filenames, rootDir),
        "*.config.js": (filenames) => processTypeScriptFiles(filenames, rootDir),
        "*.md": (filenames) => {
            const wikiFiles = filenames.filter((f) => f.includes("apps/wiki/"));
            const otherFiles = filenames.filter((f) => !f.includes("apps/wiki/"));

            const commands: string[] = [];

            if (wikiFiles.length > 0) {
                const relativeFiles = wikiFiles.map((f) => {
                    const match = f.match(/apps\/wiki\/(.+)/);
                    return match ? match[1] : f;
                });
                commands.push(
                    `cd ${join(rootDir, "apps/wiki")} && bun run fmt:md:check -- ${relativeFiles.join(" ")}`,
                    `cd ${join(rootDir, "apps/wiki")} && bun run lint:md:check -- ${relativeFiles.join(" ")}`,
                    `cd ${join(rootDir, "apps/wiki")} && bun run lint:textlint:check -- ${relativeFiles.join(" ")}`,
                );
            }

            if (otherFiles.length > 0) {
                logStep(
                    "⚠️",
                    `The following markdown files are outside apps/wiki/ and will not be checked: ${otherFiles.join(", ")}`,
                    "warning",
                );
            }

            return commands;
        },
        "*.sh": (filenames) =>
            filenames.flatMap((f) => [`bun run fmt:shell:check -- ${f}`, `bun run lint:shell:check -- ${f}`]),
        "*.tsp": (filenames) =>
            filenames.flatMap((f) => [`bun run fmt:tsp:check -- ${f}`, `bun run lint:tsp:check -- ${f}`]),
        "**/*.test.{ts,tsx}": (filenames) => {
            const commands: string[] = [];
            for (const file of filenames) {
                const relativeFile = file.startsWith("/") ? file.replace(`${rootDir}/`, "") : file;
                const workspaceDir = getWorkspaceDir(relativeFile, rootDir);
                if (workspaceDir) {
                    const workspacePath = join(rootDir, workspaceDir);
                    const workspaceRelativeFile = relativeFile.replace(`${workspaceDir}/`, "");
                    commands.push(`cd ${workspacePath} && bun run test -- ${workspaceRelativeFile}`);
                } else {
                    logStep(
                        "⚠️",
                        `Test file ${relativeFile} is not in a workspace directory and will be skipped`,
                        "warning",
                    );
                }
            }
            return commands;
        },
    };

    const allCommands: string[] = [];

    for (const [pattern, handler] of Object.entries(config)) {
        const matchedFiles = filenames.filter((f) => matchesPattern(f, pattern));

        if (matchedFiles.length > 0) {
            const commands = handler(matchedFiles);
            allCommands.push(...commands);
        }
    }

    return allCommands;
}

export async function runStaged(files?: string[]): Promise<boolean> {
    const rootDir = findRepoRoot();
    const filesToProcess = files && files.length > 0 ? files : getStagedFiles();

    if (filesToProcess.length === 0) {
        logStep("ℹ️", "No files to process", "info");
        return true;
    }

    const commands = processFiles(filesToProcess, rootDir);

    if (commands.length === 0) {
        logStep("ℹ️", "No commands to execute", "info");
        return true;
    }

    let hasError = false;
    for (const command of commands) {
        const loadingBar = new LoadingBar(`Running: ${command}`);
        loadingBar.start();

        const success = await runCommand(command);
        loadingBar.stop(success, success ? `Completed: ${command}` : `Failed: ${command}`);

        if (!success) {
            hasError = true;
            console.error(pc.red(`Command failed: ${command}`));
        }
    }

    return !hasError;
}
