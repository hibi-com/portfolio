# ドキュメント更新: 現行インフラ（D1/KV/R2）への追従

日付: 2026-07-23

## 概要

現行スタック（Cloudflare D1 / KV / R2、CircleCI Artifacts、Sentry）に合わせ、TiDB Cloud / Redis Cloud / Backblaze B2 / Grafana を現行構成として扱う記述をドキュメントから除去・置換した。

## 変更内容

### 削除

- `docs/setup/tidb-cloud-manual.md`
- `docs/setup/redis-cloud-manual.md`

### シーケンス図

- `docs/sequence/**` の `participant DB as TiDB Database` → `D1 Database`（22 ファイル）

### 主要ドキュメント更新

- `docs/setup/api-keys.md` — Grafana / Redis / TiDB セクション削除。D1/KV/R2 は Pulumi 作成である旨を追記
- `docs/development/tech-stack.md` — D1 / KV / R2 / Sentry / CircleCI Artifacts
- `docs/deployment/automation-complete.md` — CircleCI Contexts・バックアップ・コストを現行化
- `docs/deployment/deployment-flow.md` — Artifacts / Sentry / D1 migrate
- `docs/development/troubleshooting.md` — D1/libSQL、UTF-8/TZ を SQLite 向けに修正
- `docs/development/database.md` — 接続トラブルを D1/wrangler 向けに修正
- `docs/architecture/infra-architecture.md` — ランタイム/プロビジョニング図を現行化
- `docs/development/ci-cd-tools.md` — B2 言及除去
- `CLAUDE.md` / `AGENTS.md` — D1/KV/R2
- `.claude/templates/deployment/deployment-log.md` — CircleCI Artifacts / Sentry

### 付随修正

- 壊れていた `api-keys-setup.md` リンク → `docs/setup/api-keys.md`
- `docs/development/code-review.md` / テンプレート類の Redis 例 → KV
- `infra/src/generators/mermaidDiagrams.ts` — 生成文言を D1/KV/R2 に更新
- `.circleci/config.yml` — バックアップジョブの旧 mysqldump メッセージを削除

## 意図的に残した言及

- `docs/specs/infra/overview.md` 改訂履歴（削除記録）
- `.claude/log/*`（作業ログ）
- `CHANGELOG.md` / パッケージ CHANGELOG（履歴）
- `docs/api-reference/**`（生成物・触らない）
- `docs/architecture/infra-stack-graph.svg`（Pulumi 生成。再生成は `infra` の `bun run generate`）
