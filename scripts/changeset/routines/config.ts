import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Changeset作成ツールの設定
 */
export interface ChangesetConfig {
  /** Changesetファイルを格納するディレクトリ（例: ".changeset"） */
  changesetDir: string;
  /** パッケージスコープ（例: "@portfolio"）。未指定の場合は全パッケージを対象 */
  packageScope?: string;
}

/**
 * リポジトリのスコープを自動検出する
 * package.jsonのworkspaces内のパッケージから共通スコープを抽出
 */
async function detectPackageScope(rootDir: string): Promise<string | undefined> {
  try {
    const rootPkgPath = join(rootDir, "package.json");
    if (!existsSync(rootPkgPath)) {
      return undefined;
    }

    const content = await readFile(rootPkgPath, "utf-8");
    const rootPkg = JSON.parse(content);

    // workspaces内のパッケージを探索
    if (!rootPkg.workspaces || !Array.isArray(rootPkg.workspaces)) {
      return undefined;
    }

    const { glob } = await import("fast-glob");
    const packageJsonPaths = await glob("**/package.json", {
      cwd: rootDir,
      ignore: ["**/node_modules/**", "**/dist/**", "**/bin/**"],
    });

    // 最初に見つかったスコープ付きパッケージからスコープを抽出
    for (const pkgPath of packageJsonPaths) {
      const fullPath = join(rootDir, pkgPath);
      const pkgContent = await readFile(fullPath, "utf-8");
      const pkg = JSON.parse(pkgContent);

      if (pkg.name && pkg.name.startsWith("@")) {
        const scope = pkg.name.split("/")[0];
        return scope; // "@portfolio" のような形式
      }
    }

    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * .changeset/config.jsonの存在確認
 */
async function detectChangesetDir(rootDir: string): Promise<string> {
  const defaultDir = ".changeset";
  const configPath = join(rootDir, defaultDir, "config.json");

  if (existsSync(configPath)) {
    return defaultDir;
  }

  // デフォルトとして.changesetを返す
  return defaultDir;
}

/**
 * 設定を自動検出して取得
 */
export async function loadConfig(rootDir: string): Promise<ChangesetConfig> {
  const [changesetDir, packageScope] = await Promise.all([
    detectChangesetDir(rootDir),
    detectPackageScope(rootDir),
  ]);

  return {
    changesetDir,
    packageScope,
  };
}
