export function generateRuntimeDiagram(): string {
    return `\`\`\`mermaid
flowchart TB
    subgraph Users["ユーザー"]
        Browser["ブラウザ"]
    end

    subgraph Cloudflare["Cloudflare"]
        DNS["Cloudflare DNS<br/>ゾーン"]
        subgraph Edge["エッジ"]
            PagesWeb["Pages: Web<br/>(www)"]
            PagesAdmin["Pages: Admin<br/>(admin)"]
            PagesWiki["Pages: Wiki<br/>(wiki)"]
            PagesE2e["Pages: E2E<br/>(portal)"]
            WorkerAPI["Workers: API<br/>(api)"]
        end
    end

    subgraph Data["データストア"]
        TiDB["TiDB Cloud<br/>Serverless (AWS ap-northeast-1)"]
        Redis["Redis Cloud<br/>(AWS ap-northeast-1) または外部"]
    end

    subgraph Storage["ストレージ"]
        Backblaze["Backblaze B2"]
    end

    subgraph Secrets["シークレット管理"]
        CFEnv["Cloudflare Pages/Workers 環境変数"]
    end

    subgraph Observability["可観測性"]
        Grafana["Grafana Cloud"]
        Sentry["Sentry"]
    end

    Browser --> DNS
    DNS --> PagesWeb
    DNS --> PagesAdmin
    DNS --> PagesWiki
    DNS --> PagesE2e
    DNS --> WorkerAPI

    PagesWeb -->|Service Binding| WorkerAPI
    PagesAdmin -->|Service Binding| WorkerAPI
    WorkerAPI --> TiDB
    WorkerAPI --> Redis
    WorkerAPI --> Backblaze

    CFEnv -.->|環境変数・シークレット| PagesWeb
    CFEnv -.->|環境変数・シークレット| PagesAdmin
    CFEnv -.->|環境変数・シークレット| PagesWiki
    CFEnv -.->|環境変数・シークレット| PagesE2e
    CFEnv -.->|環境変数・シークレット| WorkerAPI

    WorkerAPI -.->|トレース・エラー| Sentry
    WorkerAPI -.->|メトリクス・ログ| Grafana
\`\`\``;
}

export function generateProvisioningDiagram(): string {
    return `\`\`\`mermaid
flowchart LR
    subgraph Pulumi["Pulumi (infra)"]
        Config["config / .env 参照"]
    end

    subgraph Providers["プロバイダー"]
        CF["Cloudflare"]
        TiDB["TiDB Cloud"]
        RedisCloud["Redis Cloud"]
        Grafana["Grafana"]
        Sentry["Sentry"]
        Backblaze["Backblaze"]
    end

    subgraph Resources["作成リソース"]
        direction TB
        R1["TiDB Serverless Cluster<br/>（オプション）"]
        R3["Redis Cloud Subscription/DB<br/>（オプション）"]
        R4["Cloudflare Workers (API)"]
        R5["Cloudflare Pages (web, admin, wiki, e2e)"]
        R6["Cloudflare DNS (www, admin, wiki, api, portal)"]
        R7["Cloudflare Access (rc/stg)"]
        R8["Grafana Folder / Dashboards"]
        R9["Sentry Project / DSN"]
        R10["Backblaze B2 Bucket"]
    end

    Config --> CF
    Config --> TiDB
    Config --> RedisCloud
    Config --> Grafana
    Config --> Sentry
    Config --> Backblaze

    TiDB --> R1
    RedisCloud --> R3
    CF --> R4
    CF --> R5
    R4 --> R5
    CF --> R6
    R5 --> R6
    R4 --> R6
    CF --> R7
    R5 --> R7
    Grafana --> R8
    Sentry --> R9
    Backblaze --> R10
\`\`\``;
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
