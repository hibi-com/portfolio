import pc from "picocolors";
import { writeChangesetFile } from "./changeset.js";
import { loadConfig } from "./config.js";
import { addAndCommit, getChangedFiles } from "./git.js";
import { detectAffectedPackages, getAllPackages } from "./packages.js";
import { confirmChangeset, promptCategory, promptPackages, promptSummary, promptVersionType } from "./prompts.js";
import type { ChangesetData } from "./types.js";

export async function runChangeset(rootDir: string): Promise<void> {
    console.log(pc.cyan("\n📝 Changeset 作成ツール\n"));

    try {
        // 設定を自動検出
        const config = await loadConfig(rootDir);

        if (config.packageScope) {
            console.log(pc.dim(`パッケージスコープ: ${config.packageScope}`));
        }
        console.log(pc.dim(`Changesetディレクトリ: ${config.changesetDir}\n`));

        const changedFiles = await getChangedFiles();
        const allPackages = await getAllPackages(rootDir, config.packageScope);
        const packageNames = allPackages.map((p) => p.name);
        const affectedPackages = detectAffectedPackages(changedFiles, allPackages);
        const selectedPackages = await promptPackages(packageNames, affectedPackages);

        if (selectedPackages.length === 0) {
            console.log(pc.red("\n❌ パッケージが選択されていません。"));
            process.exit(1);
        }

        const versionType = await promptVersionType();
        const category = await promptCategory();
        const summary = await promptSummary();
        const confirmed = await confirmChangeset(selectedPackages, versionType, category, summary);

        if (!confirmed) {
            console.log(pc.yellow("\n⚠️  キャンセルされました。"));
            process.exit(0);
        }

        const changesetData: ChangesetData = {
            packages: selectedPackages,
            versionType,
            category,
            summary,
        };

        const filePath = await writeChangesetFile(rootDir, changesetData, config.changesetDir);
        console.log(pc.green(`\n✅ Changesetファイルを作成しました: ${filePath}`));

        const commitMessage = `changeset: ${summary}`;
        await addAndCommit(filePath, commitMessage);
        console.log(pc.green(`✅ コミットしました: ${commitMessage}\n`));
    } catch (error) {
        if (error instanceof Error) {
            console.error(pc.red(`\n❌ エラー: ${error.message}\n`));
        }
        process.exit(1);
    }
}
