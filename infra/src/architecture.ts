export interface RuntimeNode {
    id: string;
    label: string;
    subgraphId: string;
}

export interface RuntimeEdge {
    from: string;
    to: string;
    label?: string;
    style?: "solid" | "dashed";
}

export interface RuntimeSubgraph {
    id: string;
    label: string;
    childSubgraph?: { id: string; label: string };
}

export const RUNTIME_SUBGRAPHS: RuntimeSubgraph[] = [
    { id: "Users", label: "ユーザー" },
    {
        id: "Cloudflare",
        label: "Cloudflare",
        childSubgraph: { id: "Edge", label: "エッジ" },
    },
    { id: "Data", label: "データストア" },
    { id: "Storage", label: "ストレージ" },
    { id: "Secrets", label: "シークレット管理" },
    { id: "Observability", label: "可観測性" },
];

export const RUNTIME_NODES: RuntimeNode[] = [
    { id: "Browser", label: "ブラウザ", subgraphId: "Users" },
    { id: "DNS", label: "Cloudflare DNS<br/>ゾーン", subgraphId: "Cloudflare" },
    { id: "D1", label: "Cloudflare D1", subgraphId: "Data" },
    { id: "KV", label: "Cloudflare Workers KV", subgraphId: "Data" },
    { id: "R2", label: "Cloudflare R2<br/>（アプリ画像）", subgraphId: "Storage" },
    { id: "CFEnv", label: "Cloudflare Pages/Workers 環境変数", subgraphId: "Secrets" },
    { id: "Sentry", label: "Sentry", subgraphId: "Observability" },
];

export const RUNTIME_EDGES: RuntimeEdge[] = [
    { from: "Browser", to: "DNS" },
    { from: "WorkerAPI", to: "D1" },
    { from: "WorkerAPI", to: "KV" },
    { from: "WorkerAPI", to: "R2" },
    { from: "WorkerAPI", to: "Sentry", label: "トレース・エラー", style: "dashed" },
];

export interface ProvisioningNode {
    id: string;
    label: string;
    kind: "config" | "provider" | "resource";
}

export interface ProvisioningEdge {
    from: string;
    to: string;
}

export const PROVISIONING_NODES: ProvisioningNode[] = [
    { id: "Config", label: "config / .env 参照", kind: "config" },
    { id: "CF", label: "Cloudflare", kind: "provider" },
    { id: "Sentry", label: "Sentry", kind: "provider" },
    { id: "R1", label: "Cloudflare D1 Database", kind: "resource" },
    { id: "R2", label: "Cloudflare Workers KV", kind: "resource" },
    { id: "R3", label: "Cloudflare R2 Bucket（画像）", kind: "resource" },
    { id: "R4", label: "Cloudflare Workers (API)", kind: "resource" },
    { id: "R5", label: "Cloudflare Pages (web, admin, wiki, e2e)", kind: "resource" },
    { id: "R6", label: "Cloudflare DNS (www, admin, wiki, api, portal)", kind: "resource" },
    { id: "R7", label: "Cloudflare Access (rc/stg)", kind: "resource" },
    { id: "R9", label: "Sentry Project / DSN", kind: "resource" },
];

export const PROVISIONING_EDGES: ProvisioningEdge[] = [
    { from: "Config", to: "CF" },
    { from: "Config", to: "Sentry" },
    { from: "CF", to: "R1" },
    { from: "CF", to: "R2" },
    { from: "CF", to: "R3" },
    { from: "CF", to: "R4" },
    { from: "R1", to: "R4" },
    { from: "R2", to: "R4" },
    { from: "R3", to: "R4" },
    { from: "CF", to: "R5" },
    { from: "R4", to: "R5" },
    { from: "CF", to: "R6" },
    { from: "R5", to: "R6" },
    { from: "R4", to: "R6" },
    { from: "CF", to: "R7" },
    { from: "R5", to: "R7" },
    { from: "R4", to: "R7" },
    { from: "Sentry", to: "R9" },
];
