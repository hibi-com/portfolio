import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { glob } from "fast-glob";
import type { PackageInfo } from "./types.js";

/**
 * リポジトリ内の全パッケージを取得
 * @param rootDir リポジトリのルートディレクトリ
 * @param packageScope パッケージスコープ（例: "@portfolio"）。指定されない場合は全パッケージを取得
 */
export async function getAllPackages(
    rootDir: string,
    packageScope?: string,
): Promise<PackageInfo[]> {
    const packageJsonPaths = await glob("**/package.json", {
        cwd: rootDir,
        ignore: ["**/node_modules/**", "**/dist/**", "**/bin/**"],
    });

    const packages: PackageInfo[] = [];

    for (const pkgPath of packageJsonPaths) {
        const fullPath = join(rootDir, pkgPath);
        const content = await readFile(fullPath, "utf-8");
        const pkg = JSON.parse(content);

        // パッケージ名が存在し、スコープが指定されている場合はスコープでフィルタ
        if (pkg.name) {
            if (packageScope) {
                // スコープが指定されている場合のみそのスコープのパッケージを含める
                if (pkg.name.startsWith(`${packageScope}/`)) {
                    packages.push({
                        name: pkg.name,
                        path: pkgPath.replace("/package.json", ""),
                    });
                }
            } else {
                // スコープが指定されていない場合は全パッケージを含める
                packages.push({
                    name: pkg.name,
                    path: pkgPath.replace("/package.json", ""),
                });
            }
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
