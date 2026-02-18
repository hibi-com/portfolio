import { $ } from "bun";

export async function getChangedFiles(): Promise<string[]> {
    const result = await $`git status --porcelain`.text();
    const lines = result.trim().split("\n").filter(Boolean);
    return lines.map((line) => line.slice(3));
}

export async function addAndCommit(filePath: string, message: string): Promise<void> {
    await $`git add ${filePath}`;
    await $`git commit -m ${message}`;
}

export async function getCurrentBranch(): Promise<string> {
    return (await $`git rev-parse --abbrev-ref HEAD`.text()).trim();
}
