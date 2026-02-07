import { existsSync } from "node:fs";
import { join } from "node:path";
import { findRepoRoot } from "./dispatch";

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

/**
 * infra/scripts/verify.ts を実行し、APIキー・トークンの有効性を検証する。
 * check infra コマンドから利用される。
 * @returns 検証が成功した場合 true
 */
export async function runInfraVerify(): Promise<boolean> {
    const repoRoot = findRepoRoot(process.cwd());
    const verifyPath = join(repoRoot, "infra", "scripts", "verify.ts");

    if (!existsSync(verifyPath)) {
        console.error("[check infra] verify script not found:", verifyPath);
        return false;
    }

    const proc = Bun.spawn(["bun", "run", verifyPath], {
        cwd: repoRoot,
        stdio: "inherit",
    });

    const exitCode = await proc.exited;
    return exitCode === 0;
}
