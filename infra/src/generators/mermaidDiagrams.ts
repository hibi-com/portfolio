import {
    PROVISIONING_EDGES,
    PROVISIONING_NODES,
    RUNTIME_EDGES,
    RUNTIME_NODES,
    RUNTIME_SUBGRAPHS,
} from "../architecture.js";

function runtimeNodeLine(node: { id: string; label: string }): string {
    return `        ${node.id}["${node.label.replaceAll('"', "#quot;")}"]`;
}

function runtimeEdgeLine(edge: { from: string; to: string; label?: string; style?: "solid" | "dashed" }): string {
    const arrow = edge.style === "dashed" ? "-.->" : "-->";
    const labelPart = edge.label ? `|${edge.label}|` : "";
    return `    ${edge.from} ${arrow}${labelPart} ${edge.to}`;
}

export function generateRuntimeDiagram(): string {
    const lines: string[] = ["flowchart TB"];

    for (const sg of RUNTIME_SUBGRAPHS) {
        const nodesInSg = RUNTIME_NODES.filter((n) => n.subgraphId === sg.id);
        if (nodesInSg.length === 0 && !sg.childSubgraph) continue;

        lines.push(`    subgraph ${sg.id}["${sg.label}"]`);
        for (const node of nodesInSg) {
            lines.push(runtimeNodeLine(node));
        }
        if (sg.childSubgraph) {
            const childNodes = RUNTIME_NODES.filter((n) => n.subgraphId === sg.childSubgraph!.id);
            lines.push(`        subgraph ${sg.childSubgraph.id}["${sg.childSubgraph.label}"]`);
            for (const node of childNodes) {
                lines.push(`            ${runtimeNodeLine(node).trim()}`);
            }
            lines.push("        end", "    end", "");
        } else {
            lines.push("    end", "");
        }
    }

    for (const edge of RUNTIME_EDGES) {
        lines.push(runtimeEdgeLine(edge));
    }

    return `\`\`\`mermaid\n${lines.join("\n")}\n\`\`\``;
}

function provisioningNodeLine(node: { id: string; label: string }): string {
    return `        ${node.id}["${node.label.replaceAll('"', "#quot;")}"]`;
}

function provisioningEdgeLine(edge: { from: string; to: string }): string {
    return `    ${edge.from} --> ${edge.to}`;
}

export function generateProvisioningDiagram(): string {
    const configNodes = PROVISIONING_NODES.filter((n) => n.kind === "config");
    const providerNodes = PROVISIONING_NODES.filter((n) => n.kind === "provider");
    const resourceNodes = PROVISIONING_NODES.filter((n) => n.kind === "resource");

    const lines: string[] = [
        "flowchart LR",
        "    subgraph Pulumi[\"Pulumi (infra)\"]",
        ...configNodes.map((n) => provisioningNodeLine(n)),
        "    end",
        "",
        "    subgraph Providers[\"プロバイダー\"]",
        ...providerNodes.map((n) => provisioningNodeLine(n)),
        "    end",
        "",
        "    subgraph Resources[\"作成リソース\"]",
        "        direction TB",
        ...resourceNodes.map((n) => provisioningNodeLine(n)),
        "    end",
        "",
    ];

    for (const edge of PROVISIONING_EDGES) {
        lines.push(provisioningEdgeLine(edge));
    }

    return `\`\`\`mermaid\n${lines.join("\n")}\n\`\`\``;
}

export function generateMermaidSection(): string {
    const runtimeDiagram = generateRuntimeDiagram();
    const provisioningDiagram = generateProvisioningDiagram();

    return `## ランタイム構成図

ユーザーリクエストが DNS を経由して Cloudflare に到達し、Pages（Web/Admin/Wiki）と Workers（API）に振り分けられ、API が TiDB と Redis を利用する流れです。

${runtimeDiagram}

## プロビジョニング構成図

Pulumi がどのプロバイダーとリソースを順に作成・参照するかを示します。

${provisioningDiagram}`;
}
