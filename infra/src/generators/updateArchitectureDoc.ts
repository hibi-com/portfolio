import * as fs from "node:fs";
import * as path from "node:path";
import { generateMermaidSection } from "./mermaidDiagrams.js";

const INFRA_DIR = process.cwd();
const REPO_ROOT = path.resolve(INFRA_DIR, "..");
const DOCS_ARCHITECTURE = path.join(REPO_ROOT, "docs", "architecture");
const ARCHITECTURE_DOC = path.join(DOCS_ARCHITECTURE, "infra-architecture.md");

/**
 * infra-architecture.md の Mermaid 図セクションを自動生成された内容で置き換える
 */
export function updateInfraArchitectureDoc(): boolean {
	if (!fs.existsSync(ARCHITECTURE_DOC)) {
		console.error(`[update-architecture-doc] ${ARCHITECTURE_DOC} not found.`);
		return false;
	}

	const content = fs.readFileSync(ARCHITECTURE_DOC, "utf-8");
	const lines = content.split("\n");

	// 置き換え範囲を特定
	const startMarker = "## ランタイム構成図";
	const endMarker = "## コンポーネント一覧";

	const startIndex = lines.findIndex((line) => line.includes(startMarker));
	const endIndex = lines.findIndex((line) => line.includes(endMarker));

	if (startIndex === -1 || endIndex === -1) {
		console.error("[update-architecture-doc] Could not find markers in infra-architecture.md");
		return false;
	}

	// 前半部分（開始マーカーの前まで）
	const beforeSection = lines.slice(0, startIndex).join("\n");

	// 自動生成されたMermaid図セクション
	const generatedSection = generateMermaidSection();

	// 後半部分（終了マーカー以降）
	const afterSection = lines.slice(endIndex).join("\n");

	// 結合
	const updatedContent = `${beforeSection}\n${generatedSection}\n\n${afterSection}`;

	// ファイルに書き込み
	fs.writeFileSync(ARCHITECTURE_DOC, updatedContent, "utf-8");
	console.log("[update-architecture-doc] Updated", ARCHITECTURE_DOC);

	return true;
}
