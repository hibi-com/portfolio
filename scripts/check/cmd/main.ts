#!/usr/bin/env bun

import { cac } from "cac";
import { runCheck } from "~/check";
import { findRepoRoot, groupFilesByPackage, runPackageCommands } from "~/dispatch";
import { runInfraVerify } from "~/infra";
import { checkSecrets } from "~/secrets";
import { runStaged } from "~/staged";

const cli = cac("check");

cli.command("staged", "ステージされたファイルをチェックします")
    .option("--files <files...>", "チェックするファイルのリスト")
    .action(async (options) => {
        let files: string[] = [];
        if (Array.isArray(options.files)) {
            files = options.files;
        } else if (options.files) {
            files = [options.files];
        }
        const success = await runStaged(files.length > 0 ? files : undefined);
        process.exit(success ? 0 : 1);
    });

cli.command("secrets", "セキュリティ関連のシークレットを網羅的にチェックします")
    .option("--files <files...>", "チェックするファイルのリスト")
    .action(async (options) => {
        const files = options.files || [];
        const success = await checkSecrets(files.length > 0 ? files : undefined);
        process.exit(success ? 0 : 1);
    });

cli.command("infra", "infra 用 API キー・トークンの有効性を検証します（.env を参照）").action(async () => {
    const success = await runInfraVerify();
    process.exit(success ? 0 : 1);
});

cli.command("dispatch <command>", "パッケージごとにコマンドを実行します")
    .option("--files <files...>", "処理するファイルのリスト")
    .option("--no-parallel", "並列実行を無効化")
    .action(async (command, options) => {
        const repoRoot = findRepoRoot();
        const files = options.files || [];

        if (files.length === 0) {
            console.error("Error: No files provided");
            process.exit(1);
        }

        const packageMap = groupFilesByPackage(files, repoRoot);
        const success = await runPackageCommands(packageMap, command, repoRoot, !options["no-parallel"]);
        process.exit(success ? 0 : 1);
    });

// 既存のcheckコマンド（後方互換性のため）
cli.command("*", "既存のcheckコマンドを実行します").action(async () => {
    await runCheck();
});

cli.help();
cli.version("1.0.1");

cli.parse();
