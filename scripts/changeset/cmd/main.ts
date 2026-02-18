#!/usr/bin/env bun

import { resolve } from "node:path";
import { cac } from "cac";
import pc from "picocolors";
import { runChangeset } from "../routines/index.js";

const cli = cac("changeset-jp");

cli.command("[root]", "changesetを作成します（日本語版）")
    .option("--root <dir>", "リポジトリのルートディレクトリ", { default: process.cwd() })
    .action(async (root: string | undefined, options) => {
        const rootDir = resolve(options.root || root || process.cwd());
        await runChangeset(rootDir);
    });

cli.help();
cli.version("1.0.0");

try {
    cli.parse();
} catch (error) {
    if (error instanceof Error) {
        console.error(pc.red(`エラー: ${error.message}`));
    }
    process.exit(1);
}
