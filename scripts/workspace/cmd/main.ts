#!/usr/bin/env bun

import { cac } from "cac";
import { checkAndInstallCommands } from "~/check";
import { runSeed } from "~/seed";
import { findRootDir, runWorkspace, type SetupOptions } from "~/workspace";

const cli = cac("workspace");

cli.command("setup", "開発環境のセットアップを実行します")
    .option("--env", "compose 用シークレット（.docker/secrets/）のセットアップのみ実行")
    .option("--install", "依存関係のインストールのみ実行")
    .option("--schema", "Prismaスキーマの生成のみ実行")
    .option("--docker", "Dockerイメージのビルドのみ実行")
    .option("--migrate", "データベースマイグレーションのみ実行")
    .option("--no-parallel", "並列実行を無効化")
    .action(async (options) => {
        const setupOptions: SetupOptions = {
            env: options.env !== undefined,
            install: options.install !== undefined,
            schema: options.schema !== undefined,
            docker: options.docker !== undefined,
            migrate: options.migrate !== undefined,
            parallel: !options["no-parallel"],
        };
        await runWorkspace(setupOptions);
    });

cli.command("seed", "シードデータを投入します").action(async () => {
    const rootDir = findRootDir();
    await runSeed(rootDir);
});

cli.command("check", "必要なコマンドのインストール確認と対話的インストールを実行します").action(async () => {
    await checkAndInstallCommands();
});

cli.command("*", "開発環境のセットアップを実行します").action(async () => {
    const { runWorkspace } = await import("~/workspace");
    await runWorkspace();
});

cli.help();
cli.version("1.0.1");

cli.parse();
