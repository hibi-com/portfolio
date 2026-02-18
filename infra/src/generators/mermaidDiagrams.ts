import {
    PROVISIONING_EDGES,
    PROVISIONING_NODES,
    RUNTIME_EDGES,
    RUNTIME_NODES,
    RUNTIME_SUBGRAPHS,
} from "../architecture.js";
import { getAppListForDiagram } from "./appsConfig.js";

function runtimeNodeLine(node: { id: string; label: string }): string {
    return `        ${node.id}["${node.label.replaceAll('"', "#quot;")}"]`;
}

function runtimeEdgeLine(edge: { from: string; to: string; label?: string; style?: "solid" | "dashed" }): string {
    const arrow = edge.style === "dashed" ? "-.->" : "-->";
    const labelPart = edge.label ? `|${edge.label}|` : "";
    return `    ${edge.from} ${arrow}${labelPart} ${edge.to}`;
}

function toEdgeNodeId(app: { name: string; type: "pages" | "worker" }): string {
    const pascal = app.name.charAt(0).toUpperCase() + app.name.slice(1);
    if (app.type === "worker" && app.name === "api") return "WorkerAPI";
    return app.type === "pages" ? `Pages${pascal}` : `Worker${pascal}`;
}

const DISPLAY_NAME_OVERRIDE: Record<string, string> = { api: "API" };

function getRuntimeEdgeNodes(infraRoot: string): { id: string; label: string }[] {
    const apps = getAppListForDiagram(infraRoot);
    return apps.map((app) => {
        const id = toEdgeNodeId(app);
        const displayName = DISPLAY_NAME_OVERRIDE[app.name] ?? app.name.charAt(0).toUpperCase() + app.name.slice(1);
        const label =
            app.type === "pages"
                ? `Pages: ${displayName}<br/>(${app.subdomain})`
                : `Workers: ${displayName}<br/>(${app.subdomain})`;
        return { id, label };
    });
}

function buildRuntimeSubgraphLines(
    edgeNodes: { id: string; label: string }[],
): string[] {
    const out: string[] = [];
    for (const sg of RUNTIME_SUBGRAPHS) {
        const nodesInSg = RUNTIME_NODES.filter((n) => n.subgraphId === sg.id);
        if (nodesInSg.length === 0 && !sg.childSubgraph) continue;

        const block = sg.childSubgraph
            ? [
                  `    subgraph ${sg.id}["${sg.label}"]`,
                  ...nodesInSg.map(runtimeNodeLine),
                  `        subgraph ${sg.childSubgraph.id}["${sg.childSubgraph.label}"]`,
                  ...edgeNodes.map((node) => `            ${runtimeNodeLine(node).trim()}`),
                  "        end",
                  "    end",
                  "",
              ]
            : [`    subgraph ${sg.id}["${sg.label}"]`, ...nodesInSg.map(runtimeNodeLine), "    end", ""];
        out.push(...block);
    }
    return out;
}

function buildRuntimeEdgeLines(
    apps: { name: string; type: "pages" | "worker" }[],
    hasApiWorker: boolean,
): string[] {
    const out: string[] = [];
    for (const app of apps) {
        const nodeId = toEdgeNodeId(app);
        out.push(
            runtimeEdgeLine({ from: "DNS", to: nodeId }),
            runtimeEdgeLine({ from: "CFEnv", to: nodeId, label: "環境変数・シークレット", style: "dashed" }),
        );
    }
    if (hasApiWorker) {
        const serviceBindingApps = apps.filter(
            (app) => app.type === "pages" && (app.name === "web" || app.name === "admin"),
        );
        for (const app of serviceBindingApps) {
            out.push(runtimeEdgeLine({ from: toEdgeNodeId(app), to: "WorkerAPI", label: "Service Binding" }));
        }
    }
    for (const edge of RUNTIME_EDGES) {
        if (edge.from === "WorkerAPI" && !hasApiWorker) continue;
        out.push(runtimeEdgeLine(edge));
    }
    return out;
}

export function generateRuntimeDiagram(infraRoot: string): string {
    const edgeNodes = getRuntimeEdgeNodes(infraRoot);
    const hasApiWorker = edgeNodes.some((n) => n.id === "WorkerAPI");
    const apps = getAppListForDiagram(infraRoot);

    const lines = [
        "flowchart TB",
        ...buildRuntimeSubgraphLines(edgeNodes),
        ...buildRuntimeEdgeLines(apps, hasApiWorker),
    ];
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
        '    subgraph Pulumi["Pulumi (infra)"]',
        ...configNodes.map((n) => provisioningNodeLine(n)),
        "    end",
        "",
        '    subgraph Providers["プロバイダー"]',
        ...providerNodes.map((n) => provisioningNodeLine(n)),
        "    end",
        "",
        '    subgraph Resources["作成リソース"]',
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

export function generateMermaidSection(infraRoot: string): string {
    const runtimeDiagram = generateRuntimeDiagram(infraRoot);
    const provisioningDiagram = generateProvisioningDiagram();

    return `## ランタイム構成図

ユーザーリクエストが DNS を経由して Cloudflare に到達し、Pages（Web/Admin/Wiki）と Workers（API）に振り分けられ、API が TiDB と Redis を利用する流れです。

${runtimeDiagram}

## プロビジョニング構成図

Pulumi がどのプロバイダーとリソースを順に作成・参照するかを示します。

${provisioningDiagram}`;
}
