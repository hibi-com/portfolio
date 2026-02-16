#!/usr/bin/env bun

import { cac } from "cac";
import pc from "picocolors";
import { createAIFileLinks } from "../routines/file";

const cli = cac("symlinks");

cli.command("[...args]", "シンボリックリンク").action(async () => {
    try {
        console.log(pc.cyan("🔗 シンボリックリンクを開始...\n"));
        await createAIFileLinks();
        console.log(pc.green("\n✅ 完了！"));
    } catch (error) {
        console.error(pc.red("❌ エラーが発生しました:"), error);
        process.exit(1);
    }
});

cli.help();
cli.version("1.0.0");

cli.parse();
