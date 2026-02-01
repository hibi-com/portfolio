import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type PackageChangelog = {
    name: string;
    path: string;
    content: string;
};

type VersionContent = {
    name: string;
    content: string;
};

const WORKSPACES = ["apps/*", "packages/*", "tooling/*", "testing/*", "scripts/*", "generators"] as const;

const CHANGELOG_HEADER = `# Changelog

このファイルは、モノレポ内のすべてのパッケージの変更履歴を集約したものです。
各パッケージの詳細な変更履歴は、各パッケージの \`CHANGELOG.md\` を参照してください。

`;

function getPackagePaths(workspace: string, rootDir: string): string[] {
    const workspacePath = join(rootDir, workspace.replace("/*", ""));
    if (!existsSync(workspacePath)) {
        return [];
    }

    if (workspace.includes("*")) {
        return readdirSync(workspacePath, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => join(workspacePath, dirent.name));
    }

    return [workspacePath];
}

function loadPackageChangelog(packagePath: string): PackageChangelog | null {
    const packageChangelogPath = join(packagePath, "CHANGELOG.md");
    if (!existsSync(packageChangelogPath)) {
        return null;
    }

    const packageJsonPath = join(packagePath, "package.json");
    if (!existsSync(packageJsonPath)) {
        return null;
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8")) as { name?: string };
    const content = readFileSync(packageChangelogPath, "utf-8");

    if (!content.trim()) {
        return null;
    }

    return {
        name: packageJson.name || packagePath,
        path: packageChangelogPath,
        content,
    };
}

function collectPackageChangelogs(rootDir: string): PackageChangelog[] {
    const packageChangelogs: PackageChangelog[] = [];

    for (const workspace of WORKSPACES) {
        const packagePaths = getPackagePaths(workspace, rootDir);
        for (const packagePath of packagePaths) {
            const changelog = loadPackageChangelog(packagePath);
            if (changelog) {
                packageChangelogs.push(changelog);
            }
        }
    }

    return packageChangelogs.sort((a, b) => a.name.localeCompare(b.name));
}

function parseVersionFromLine(line: string): string | null {
    const versionMatch = line.match(/^##\s+(?:\[?)(\d+\.\d+\.\d+)(?:\]?)/);
    return versionMatch ? versionMatch[1] : null;
}

function addVersionToMap(
    versionMap: Map<string, VersionContent[]>,
    version: string,
    pkgName: string,
    content: string,
): void {
    if (!versionMap.has(version)) {
        versionMap.set(version, []);
    }
    versionMap.get(version)!.push({ name: pkgName, content: content.trim() });
}

function processPackageVersions(pkg: PackageChangelog, versionMap: Map<string, VersionContent[]>): void {
    const lines = pkg.content.split("\n");
    let currentVersion = "";
    let versionContent = "";

    for (const line of lines) {
        const version = parseVersionFromLine(line);
        if (version) {
            if (currentVersion && versionContent.trim()) {
                addVersionToMap(versionMap, currentVersion, pkg.name, versionContent);
            }
            currentVersion = version;
            versionContent = `${line}\n`;
            continue;
        }

        if (currentVersion) {
            versionContent += `${line}\n`;
        }
    }

    if (currentVersion && versionContent.trim()) {
        addVersionToMap(versionMap, currentVersion, pkg.name, versionContent);
    }
}

function buildVersionMap(packageChangelogs: PackageChangelog[]): Map<string, VersionContent[]> {
    const versionMap = new Map<string, VersionContent[]>();

    for (const pkg of packageChangelogs) {
        processPackageVersions(pkg, versionMap);
    }

    return versionMap;
}

function compareVersions(a: string, b: string): number {
    const [aMajor, aMinor, aPatch] = a.split(".").map(Number);
    const [bMajor, bMinor, bPatch] = b.split(".").map(Number);

    if (aMajor !== bMajor) return bMajor - aMajor;
    if (aMinor !== bMinor) return bMinor - aMinor;
    return bPatch - aPatch;
}

function sortVersions(versions: string[]): string[] {
    return [...versions].sort(compareVersions);
}

function generateChangelogContent(versionMap: Map<string, VersionContent[]>): string {
    let changelogContent = CHANGELOG_HEADER;
    const sortedVersions = sortVersions(Array.from(versionMap.keys()));

    for (const version of sortedVersions) {
        const packages = versionMap.get(version)!;
        changelogContent += `## ${version}\n\n`;
        for (const pkg of packages) {
            changelogContent += `### ${pkg.name}\n\n`;
            changelogContent += `${pkg.content.replace(/^##\s+.*?\n/, "")}\n\n`;
        }
    }

    return changelogContent;
}

function generateRootChangelog(): void {
    const rootDir = process.cwd();
    const changelogPath = join(rootDir, "CHANGELOG.md");

    const existingChangelog = existsSync(changelogPath) ? readFileSync(changelogPath, "utf-8") : "";

    const packageChangelogs = collectPackageChangelogs(rootDir);
    const versionMap = buildVersionMap(packageChangelogs);
    const changelogContent = generateChangelogContent(versionMap);

    if (changelogContent === existingChangelog) {
        console.log("ℹ️  Root CHANGELOG.md is up to date");
        return;
    }

    writeFileSync(changelogPath, changelogContent, "utf-8");
    console.log("✅ Root CHANGELOG.md has been generated");
}

generateRootChangelog();
