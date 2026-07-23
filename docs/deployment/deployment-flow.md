---
title: "デプロイメントフロー"
---

# デプロイメントフロー

## 概要

このドキュメントは、CircleCIを使用した完全自動化デプロイメントフローについて説明します。

## デプロイメントアーキテクチャ

```mermaid
graph TD
    A[Git Push] --> B[CI: Build & Test]
    B --> C[Artifacts Upload to CircleCI]
    C --> D[Download Artifacts]
    D --> E[Pre-deployment Check]
    E --> F[Database Migration]
    F --> G[Preview Deploy]
    G --> H[Smoke Test]
    H --> I{Smoke Test<br/>Pass?}
    I -->|Yes| J{Manual<br/>Approval<br/>rc only}
    I -->|No| K[Rollback & Alert]
    J -->|Approved| L[Production Deploy]
    J -->|Rejected| M[Cancel]
    L --> N[Post-deploy Verify]
    N --> O{Health<br/>Check<br/>Pass?}
    O -->|Yes| P[Deploy Complete]
    O -->|No| Q[Auto Rollback]
```

## デプロイフロー詳細

### Phase 1: ビルド & テスト

```bash
setup → format → lint → typecheck → test → e2e → build → upload-artifacts
```

### Phase 2: デプロイ準備（全環境共通）

#### 1. Download Artifacts

CircleCI Artifacts（または workspace）から最新ビルドアーティファクトを取得。デプロイ workflow はソース再ビルドする場合もある。

#### 2. Pre-deployment Check

デプロイ前の検証:

- ビルドアーティファクトの存在確認
- 環境変数の検証
- 設定ファイルの整合性チェック

#### 3. Database Migration

Cloudflare D1 へ Wrangler でマイグレーションを適用:

```bash
# packages/db または apps/api の wrangler.toml を使用
bunx wrangler d1 migrations apply <DATABASE_NAME> --remote
```

ローカル（libSQL）では Docker の `setup-db` または Prisma migrate を使用。

**特徴**:

- 失敗時は自動でGitHub Issue作成
- ロールバック手順をIssueに記載

#### 4. Preview Deploy (Blue-Green準備)

Preview環境にデプロイ（本番トラフィックに影響なし）:

```bash
bun run deploy -- --env=preview
```

#### 5. Smoke Test

Preview環境で基本動作を検証:

- ヘルスチェックエンドポイント確認
- 重要なAPIの動作確認

### Phase 3: 本番デプロイ

#### RC環境（手動承認あり）

```text
smoke-test → hold-approval → deploy → verify
```

- スモークテスト成功後、手動承認待ち
- 承認後に本番デプロイ実行

#### STG/PRD環境（完全自動）

```text
smoke-test → deploy → verify
```

- スモークテスト成功で自動的に本番デプロイ
- デプロイ後のヘルスチェックで検証

## 環境別デプロイトリガー

| 環境 | トリガー | 承認 |
| ---- | -------- | ---- |
| RC | Git Push (master/main) → CI 成功後 | 最終デプロイ前に手動承認 |
| STG | RC デプロイ成功後 | 開始時に手動承認 |
| PRD | STG デプロイ成功後 | 開始時に手動承認 |

## セーフティ機能

### 1. 自動ロールバック

デプロイ後のヘルスチェック失敗時に自動ロールバック:

```bash
wrangler pages deployment rollback --project-name portfolio-web
```

### 2. リトライロジック

デプロイ失敗時は最大3回自動リトライ:

```bash
MAX_RETRIES=3
RETRY_DELAY=10s
```

### 3. GitHub Issue自動作成

失敗時に自動的にIssue作成:

- マイグレーション失敗
- スモークテスト失敗
- デプロイ失敗

Issue内容:

- 失敗したジョブ
- 環境
- コミットSHA
- ロールバック手順

## ロールバック手順

### 手動ロールバック

```bash
# Cloudflare Pages
wrangler pages deployment rollback --project-name portfolio-web

# Cloudflare Workers
wrangler rollback --name api

# データベース（D1）
# Time Travel / 直前のマイグレーション状態を確認し、必要なら手動で復元
bunx wrangler d1 migrations list <DATABASE_NAME> --remote
```

### CircleCI経由でのロールバック

```bash
# 特定のコミットSHAのアーティファクトを再デプロイ
circleci trigger deploy --param commit_sha=<previous-commit-sha>
```

## モニタリング & アラート

### デプロイメトリクス

- デプロイ頻度: 毎日（STG: 0:00, PRD: 12:00）
- 成功率: CircleCI UIで確認
- MTTR: GitHub Issuesで追跡

### アラート先

- **GitHub Issues**: 自動作成（全失敗）
- **Sentry**: エラー追跡・監視

## ベストプラクティス

### デプロイ前

1. ローカルで全テスト実行: `bun run test && bun run e2e`
2. 型チェック: `bun run typecheck`
3. リント: `bun run lint`

### デプロイ中

1. CircleCI UIでログ監視
2. Sentryでエラー監視

### デプロイ後

1. ヘルスチェック確認
2. 主要機能の動作確認
3. ログで異常がないか確認

## トラブルシューティング

### マイグレーション失敗

1. CircleCI UIでログ確認
2. D1 バインディング / `wrangler.toml` のデータベース名を確認
3. 手動でマイグレーション状態確認:

   ```bash
   bunx wrangler d1 migrations list <DATABASE_NAME> --remote
   ```

### スモークテスト失敗

1. Preview URLにアクセスして動作確認
2. Cloudflare Dashboardでログ確認
3. Sentryでエラー確認

### デプロイ失敗

1. CircleCI UIでログ確認
2. Cloudflare APIトークンの権限確認
3. ビルドアーティファクトの存在確認

## 参考資料

- [CircleCI Documentation](https://circleci.com/docs/)
- [Cloudflare Pages Deployment](https://developers.cloudflare.com/pages/)
- [Cloudflare D1 Migrations](https://developers.cloudflare.com/d1/reference/migrations/)
- [トラブルシューティングガイド](../development/troubleshooting.md)
