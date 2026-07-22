# Cloudflare 一本化（D1 / KV / R2）

日付: 2026-07-23

## 概要

TiDB Cloud / Redis Cloud / Backblaze B2 / Grafana の構成管理をやめ、Cloudflare（D1・KV・R2）と CircleCI Artifacts に寄せた。

## 変更内容

### インフラ（Pulumi）

- D1 / KV / R2 を `infra/src/resources/cloudflare-data.ts` で作成
- API Worker に `DB` / `CACHE` / `IMAGES` バインディング
- ドメイン: ベース `ageha734.jp`、rc/stg は `rc.www` / `rc.api` 形式（`hostname.ts`）
- Grafana / Redis Cloud / TiDB / B2 プロバイダ依存を削除
- 今回のデプロイ対象は本番（prd）想定。rc/stg は定義のみ

### データ層

- Prisma `provider = "sqlite"` + `@prisma/adapter-d1` / `@prisma/adapter-libsql`
- キャッシュ: Cloudflare KV（`@portfolio/cache`）
- R2: アプリ画像（WebView 表示）専用。CI 用途ではない
- Auth: Better Auth `provider: "sqlite"`

### ローカル Docker

- TiDB / Redis 撤去
- libSQL（sqld）コンテナ `sqlite`（ホスト `http://127.0.0.1:8081`）
- `setup-db` で migration + seed（SQLite 方言）

### CircleCI

- B2 CLI / context 削除
- 成果物は `store_artifacts` + workspace
- デプロイ workflow はソース再ビルド
- DB migrate は `wrangler d1 migrations apply`
- TiDB mysqldump バックアップ廃止（D1 Time Travel / Dashboard）

### ドキュメント

- `docs/specs/infra/overview.md`（既に D1/KV/R2）
- `docs/development/ci-cd-tools.md` / database / troubleshooting / `.docker/db/README.md`

## 残作業（運用）

- Cloudflare 上の D1/KV/R2 ID を `apps/api/wrangler.toml` / `packages/db/wrangler.toml` に反映
- `pulumi up` は prd のみ（ユーザー方針）
- Prisma migration 更新時は `packages/db/migrations/0001_*.sql` も同期
