---
title: "インフラアーキテクチャ"
---

このドキュメントは、`infra/` ディレクトリで Pulumi により管理されるインフラストラクチャの構成とコンポーネントの関係を図示します。

> **注意**: 本ドキュメントの構成図（ランタイム構成図・プロビジョニング構成図）は**Pulumiから自動生成されています**。
> `infra` で `bun run generate` を実行すると再生成されます。
> 仕様駆動開発の観点から、手動で書くべき仕様は [`docs/specs/infra/`](../specs/infra/) に記載しています。

**Pulumi のデフォルトコマンドで生成したリソース依存グラフ**: デプロイ済みスタックから `pulumi stack graph` で自動生成した図は [infra-stack-graph.md](./infra-stack-graph.md) を参照してください。`infra` で `bun run generate` を実行すると再生成されます。

## ランタイム構成図

ユーザーリクエストが DNS を経由して Cloudflare に到達し、Pages（Web/Admin/Wiki）と Workers（API）に振り分けられ、API が TiDB と Redis を利用する流れです。

```mermaid
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
```

## プロビジョニング構成図

Pulumi がどのプロバイダーとリソースを順に作成・参照するかを示します。

```mermaid
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
    R4 --> R7
    Grafana --> R8
    Sentry --> R9
    Backblaze --> R10
```

## コンポーネント一覧

カテゴリ・コンポーネント・対応する infra リソースは実装の変更に伴い変わるため、一覧はこのドキュメントでは持たず、**`infra/` 配下の Pulumi リソース（`resources/*.ts`）を直接参照**すること。

## 環境とスタック

- **Pulumi スタック**: `prd`, `stg`, `rc` など（`Pulumi.*.yaml`）
- **環境変数**: `infra/.env` を読み、Pulumi で Cloudflare Pages/Workers に反映
- **Cloudflare Access**: プレビュー用の Access アプリは `rc` / `stg` のみ作成

## 関連ドキュメント

- [Architecture Overview](./overview.md)
- [インフラ仕様書](../specs/infra/overview.md) - 手動管理する仕様
- [APIキー・トークン発行手順](../development/api-keys-setup.md)
