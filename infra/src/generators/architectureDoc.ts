/**
 * Pulumi のデフォルトコマンド `pulumi stack graph` でスタックの依存グラフを DOT 形式で出力し、
 * Graphviz で SVG に変換して docs/architecture に保存する。
 * 前提: スタックが選択済みかつデプロイ済みであること。Graphviz (dot) は任意。
 */

import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

const INFRA_DIR = process.cwd();
const REPO_ROOT = path.resolve(INFRA_DIR, "..");
const DOCS_ARCHITECTURE = path.join(REPO_ROOT, "docs", "architecture");
const DOT_FILE = path.join(INFRA_DIR, "graph.dot");
const SVG_FILE = path.join(DOCS_ARCHITECTURE, "infra-stack-graph.svg");
const MARKDOWN_FILE = path.join(DOCS_ARCHITECTURE, "infra-stack-graph.md");

function runPulumiStackGraph(): boolean {
    console.log("[generate-architecture-doc] Running: pulumi stack graph", DOT_FILE);
    const result = spawnSync("pulumi", ["stack", "graph", DOT_FILE], {
        cwd: INFRA_DIR,
        stdio: "inherit",
        shell: true,
    });
    if (result.status !== 0) {
        console.error(
            "[generate-architecture-doc] pulumi stack graph failed. Ensure a stack is selected and deployed.",
        );
        return false;
    }
    return true;
}

function runGraphvizDot(): boolean {
    const dotExists = spawnSync("which", ["dot"], { encoding: "utf-8" }).status === 0;
    if (!dotExists) {
        console.warn(
            "[generate-architecture-doc] Graphviz (dot) not found. Skipping SVG generation. Install with: brew install graphviz",
        );
        return false;
    }
    if (!fs.existsSync(DOT_FILE)) {
        console.error("[generate-architecture-doc] graph.dot not found. Run pulumi stack graph first.");
        return false;
    }
    console.log("[generate-architecture-doc] Running: dot -Tsvg", DOT_FILE, "-o", SVG_FILE);
    const result = spawnSync("dot", ["-Tsvg", DOT_FILE, "-o", SVG_FILE], {
        cwd: INFRA_DIR,
        stdio: "inherit",
        shell: true,
    });
    if (result.status !== 0) {
        console.error("[generate-architecture-doc] dot failed.");
        return false;
    }
    return true;
}

function writeMarkdown(svgGenerated: boolean): void {
    if (!fs.existsSync(DOCS_ARCHITECTURE)) {
        fs.mkdirSync(DOCS_ARCHITECTURE, { recursive: true });
    }
    const t = "`";
    const content = `---
title: "インフラスタックグラフ（自動生成）"
---

この図は Pulumi のデフォルトコマンド ${t}pulumi stack graph${t} により、**デプロイ済みスタックのリソース依存関係**から自動生成されています。

## リソース依存グラフ

${svgGenerated ? `![Pulumi stack graph](${path.basename(SVG_FILE)})\n` : ""}
${svgGenerated ? "" : `（SVG を生成するには Graphviz をインストールし、再度 ${t}bun run generate${t} を実行してください。）\n\n`}

## 再生成方法

${t}infra${t} ディレクトリで以下を実行してください。

${t}${t}${t}bash
cd infra
bun run generate
${t}${t}${t}

- **前提**: スタックが選択済み（${t}pulumi stack select <stack>${t}）かつ、少なくとも 1 回デプロイ済みであること。
- **Graphviz**: SVG を生成するには [Graphviz](https://graphviz.org/) の ${t}dot${t} コマンドが必要です（例: ${t}brew install graphviz${t}）。
- DOT ファイルは ${t}infra/graph.dot${t} に出力され、${t}dot -Tsvg graph.dot -o docs/architecture/infra-stack-graph.svg${t} で SVG に変換されます。
`;

    fs.writeFileSync(MARKDOWN_FILE, content, "utf-8");
    console.log("[generate-architecture-doc] Wrote", MARKDOWN_FILE);
}

/**
 * Pulumi stack graph を実行し、DOT と（Graphviz があれば）SVG、および docs/architecture 用 Markdown を生成する。
 * generate コマンドから利用される。
 * @returns 成功した場合 true
 */
export function generateArchitectureDoc(): boolean {
    const ok = runPulumiStackGraph();
    if (!ok) {
        return false;
    }
    const svgGenerated = runGraphvizDot();
    writeMarkdown(svgGenerated);
    return true;
}
