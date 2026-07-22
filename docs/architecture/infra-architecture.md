---
title: "インフラアーキテクチャ"
---

このドキュメントは、`infra/` ディレクトリで Pulumi により管理されるインフラストラクチャの構成とコンポーネントの関係を図示します。

> **注意**: 本ドキュメントの構成図（ランタイム構成図・プロビジョニング構成図）は**Pulumiから自動生成されています**。
> `infra` で `bun run generate` を実行すると再生成されます。
> 仕様駆動開発の観点から、手動で書くべき仕様は [`docs/specs/infra/`](../specs/infra/) に記載しています。

**Pulumi のデフォルトコマンドで生成したリソース依存グラフ**: デプロイ済みスタックから `pulumi stack graph` で自動生成した図は [infra-stack-graph.md](./infra-stack-graph.md) を参照してください。`infra` で `bun run generate` を実行すると再生成されます。

## ランタイム構成図

ユーザーリクエストが DNS を経由して Cloudflare に到達し、Pages（Web/Admin/Wiki）と Workers（API）に振り分けられ、API が D1・KV・R2 を利用する流れです。可観測性は Sentry、CI 成果物は CircleCI Artifacts です。

```mermaid
flowchart TB
    subgraph Users["ユーザー"]
        Browser["ブラウザ"]
    end

    subgraph Cloudflare["Cloudflare"]
        DNS["Cloudflare DNS<br/>ゾーン"]
        subgraph Edge["エッジ"]
            Pages["Pages<br/>(web / admin / wiki / portal)"]
            Workers["Workers (API)"]
        end
        subgraph Data["データストア"]
            D1["Cloudflare D1<br/>(SQLite)"]
            KV["Workers KV<br/>(cache)"]
            R2["R2<br/>(アプリ画像専用)"]
        end
    end

    subgraph CI["CI"]
        CircleCI["CircleCI Artifacts"]
    end

    subgraph Secrets["シークレット管理"]
        CFEnv["Cloudflare Pages/Workers 環境変数"]
    end

    subgraph Observability["可観測性"]
        Sentry["Sentry"]
    end

    Browser --> DNS
    DNS --> Pages
    DNS --> Workers
    Workers --> D1
    Workers --> KV
    Workers --> R2
    Workers --> Sentry
    Pages --> Sentry
    CircleCI -.-> Pages
    CircleCI -.-> Workers
    CFEnv --> Pages
    CFEnv --> Workers
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
        Sentry["Sentry"]
    end

    subgraph Resources["作成リソース"]
        direction TB
        R1["D1 Database"]
        R2["Workers KV Namespace"]
        R3["R2 Bucket（画像）"]
        R4["Cloudflare Workers (API)"]
        R5["Cloudflare Pages (web, admin, wiki, e2e)"]
        R6["Cloudflare DNS (www, admin, wiki, api, portal)"]
        R7["Cloudflare Access (rc/stg)"]
        R8["Sentry Project / DSN"]
    end

    Config --> CF
    Config --> Sentry
    CF --> R1
    CF --> R2
    CF --> R3
    CF --> R4
    CF --> R5
    R1 --> R4
    R2 --> R4
    R3 --> R4
    R4 --> R5
    CF --> R6
    R5 --> R6
    R4 --> R6
    CF --> R7
    R5 --> R7
    R4 --> R7
    Sentry --> R8
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
- [APIキー・トークン発行手順](../setup/api-keys.md)
