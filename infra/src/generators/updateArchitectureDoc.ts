import * as fs from "node:fs";
import * as path from "node:path";
import { generateMermaidSection } from "./mermaidDiagrams.js";

const REPO_ROOT = path.resolve(process.cwd(), "..");
const DOCS_ARCHITECTURE = path.join(REPO_ROOT, "docs", "architecture");
const ARCHITECTURE_DOC = path.join(DOCS_ARCHITECTURE, "infra-architecture.md");

export function updateInfraArchitectureDoc(infraRoot: string = process.cwd()): boolean {
    if (!fs.existsSync(ARCHITECTURE_DOC)) {
        console.error(`[update-architecture-doc] ${ARCHITECTURE_DOC} not found.`);
        return false;
    }

    const content = fs.readFileSync(ARCHITECTURE_DOC, "utf-8");
    const lines = content.split("\n");

    const startMarker = "## ランタイム構成図";
    const endMarker = "## コンポーネント一覧";

    const startIndex = lines.findIndex((line) => line.includes(startMarker));
    const endIndex = lines.findIndex((line) => line.includes(endMarker));

    if (startIndex === -1 || endIndex === -1) {
        console.error("[update-architecture-doc] Could not find markers in infra-architecture.md");
        return false;
    }

    const beforeSection = lines.slice(0, startIndex).join("\n");
    const generatedSection = generateMermaidSection(infraRoot);
    const afterSection = lines.slice(endIndex).join("\n");
    const updatedContent = `${beforeSection}\n${generatedSection}\n\n${afterSection}`;

    fs.writeFileSync(ARCHITECTURE_DOC, updatedContent, "utf-8");
    console.log("[update-architecture-doc] Updated", ARCHITECTURE_DOC);

    return true;
}
