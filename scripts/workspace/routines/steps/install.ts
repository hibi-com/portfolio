import { $ } from "bun";
import { LoadingBar, logSection } from "../lib/env";
import type { StepContext } from "../lib/types";

export async function runInstallStep(ctx: StepContext): Promise<void> {
    logSection("📦 依存関係のインストール");
    const loadingBar = new LoadingBar("依存関係をインストールしています");
    loadingBar.start();

    try {
        await $`bun install --ignore-scripts`.cwd(ctx.rootDir).quiet();
        loadingBar.stop(true, "依存関係のインストールが完了しました");
    } catch (error: unknown) {
        loadingBar.stop(false, "依存関係のインストールに失敗しました");
        if (process.env.DEBUG) {
            console.error(error);
        }
        throw error;
    }
}
