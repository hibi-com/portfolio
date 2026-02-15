#!/usr/bin/env bun
import { cac } from "cac";
import pc from "picocolors";
import { createAIFileLinks } from "../routines/ai-file";

const cli = cac("symlinks");

cli
	.command("[...args]", "AI設定シンボリックリンクの統一構築")
	.action(async () => {
		try {
			console.log(pc.cyan("🔗 AI設定シンボリックリンクの統一構築を開始...\n"));
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
