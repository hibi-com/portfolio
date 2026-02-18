import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { glob } from "fast-glob";
import type { PackageInfo } from "./types.js";

export async function getAllPackages(rootDir: string): Promise<PackageInfo[]> {
    const packageJsonPaths = await glob("**/package.json", {
        cwd: rootDir,
        ignore: ["**/node_modules/**", "**/dist/**", "**/bin/**"],
    });

    const packages: PackageInfo[] = [];

    for (const pkgPath of packageJsonPaths) {
        const fullPath = join(rootDir, pkgPath);
        const content = await readFile(fullPath, "utf-8");
        const pkg = JSON.parse(content);

        if (pkg.name?.startsWith("@portfolio/")) {
            packages.push({
                name: pkg.name,
                path: pkgPath.replace("/package.json", ""),
            });
        }
    }

    return packages;
}

export function detectAffectedPackages(changedFiles: string[], allPackages: PackageInfo[]): string[] {
    const affectedPackages = new Set<string>();

    for (const file of changedFiles) {
        for (const pkg of allPackages) {
            if (file.startsWith(pkg.path)) {
                affectedPackages.add(pkg.name);
            }
        }
    }

    return Array.from(affectedPackages).sort((a, b) => a.localeCompare(b));
}
