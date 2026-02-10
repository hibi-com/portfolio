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

export async function runInfraVerify(): Promise<boolean> {
    const repoRoot = findRepoRoot(process.cwd());
    const verifyPath = join(repoRoot, "infra", "scripts", "verify.ts");

    if (!existsSync(verifyPath)) {
        console.error("[check infra] verify script not found:", verifyPath);
        return false;
    }

    const proc = Bun.spawn(["bun", "run", verifyPath], {
        cwd: repoRoot,
        stdout: "inherit",
        stderr: "inherit",
    });

    const exitCode = await proc.exited;
    return exitCode === 0;
}
