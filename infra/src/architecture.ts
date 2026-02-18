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
    { id: "TiDB", label: "TiDB Cloud<br/>Serverless (AWS ap-northeast-1)", subgraphId: "Data" },
    { id: "Redis", label: "Redis Cloud<br/>(AWS ap-northeast-1) または外部", subgraphId: "Data" },
    { id: "Backblaze", label: "Backblaze B2", subgraphId: "Storage" },
    { id: "CFEnv", label: "Cloudflare Pages/Workers 環境変数", subgraphId: "Secrets" },
    { id: "Grafana", label: "Grafana Cloud", subgraphId: "Observability" },
    { id: "Sentry", label: "Sentry", subgraphId: "Observability" },
];

export const RUNTIME_EDGES: RuntimeEdge[] = [
    { from: "Browser", to: "DNS" },
    { from: "WorkerAPI", to: "TiDB" },
    { from: "WorkerAPI", to: "Redis" },
    { from: "WorkerAPI", to: "Backblaze" },
    { from: "WorkerAPI", to: "Sentry", label: "トレース・エラー", style: "dashed" },
    { from: "WorkerAPI", to: "Grafana", label: "メトリクス・ログ", style: "dashed" },
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
    { id: "TiDB", label: "TiDB Cloud", kind: "provider" },
    { id: "RedisCloud", label: "Redis Cloud", kind: "provider" },
    { id: "Grafana", label: "Grafana", kind: "provider" },
    { id: "Sentry", label: "Sentry", kind: "provider" },
    { id: "Backblaze", label: "Backblaze", kind: "provider" },
    { id: "R1", label: "TiDB Serverless Cluster<br/>（オプション）", kind: "resource" },
    { id: "R3", label: "Redis Cloud Subscription/DB<br/>（オプション）", kind: "resource" },
    { id: "R4", label: "Cloudflare Workers (API)", kind: "resource" },
    { id: "R5", label: "Cloudflare Pages (web, admin, wiki, e2e)", kind: "resource" },
    { id: "R6", label: "Cloudflare DNS (www, admin, wiki, api, portal)", kind: "resource" },
    { id: "R7", label: "Cloudflare Access (rc/stg)", kind: "resource" },
    { id: "R8", label: "Grafana Folder / Dashboards", kind: "resource" },
    { id: "R9", label: "Sentry Project / DSN", kind: "resource" },
    { id: "R10", label: "Backblaze B2 Bucket", kind: "resource" },
];

export const PROVISIONING_EDGES: ProvisioningEdge[] = [
    { from: "Config", to: "CF" },
    { from: "Config", to: "TiDB" },
    { from: "Config", to: "RedisCloud" },
    { from: "Config", to: "Grafana" },
    { from: "Config", to: "Sentry" },
    { from: "Config", to: "Backblaze" },
    { from: "TiDB", to: "R1" },
    { from: "RedisCloud", to: "R3" },
    { from: "CF", to: "R4" },
    { from: "CF", to: "R5" },
    { from: "R4", to: "R5" },
    { from: "CF", to: "R6" },
    { from: "R5", to: "R6" },
    { from: "R4", to: "R6" },
    { from: "CF", to: "R7" },
    { from: "R5", to: "R7" },
    { from: "R4", to: "R7" },
    { from: "Grafana", to: "R8" },
    { from: "Sentry", to: "R9" },
    { from: "Backblaze", to: "R10" },
];
