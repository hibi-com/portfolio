---
title: "デプロイメントガイド"
---

このプロジェクトでは、Cloudflare PagesとCloudflare Workersを使用してアプリケーションをデプロイします。

## デプロイメント概要

### デプロイメント先

- **`apps/web`**: Cloudflare Pages（ポートフォリオサイト）
- **`apps/api`**: Cloudflare Workers（CMS API）
- **`apps/admin`**: Cloudflare Pages（管理ダッシュボード）
- **`apps/wiki`**: GitHub Pages（ドキュメントサイト）
- **Storybook**: GitHub Pages（コンポーネントドキュメント）

### デプロイメント方法

1. **自動デプロイ**: GitHub Actions経由で自動デプロイ
2. **手動デプロイ**: Wrangler CLIを使用した手動デプロイ

## Cloudflare Pages デプロイメント

### apps/web のデプロイ

#### 前提条件

1. Cloudflareアカウントの作成
2. Wrangler CLIのインストールと認証

```bash
# Wrangler CLIのインストール
bun add -g wrangler

# Cloudflareにログイン
wrangler login
```

#### ビルド設定

`wrangler.toml` でビルド設定を定義します。

```toml
# apps/web/wrangler.toml
name = "portfolio-web"
compatibility_date = "2024-01-01"
pages_build_output_dir = "./build"

[env.production]
name = "portfolio-web"
```

#### 環境変数の設定

```bash
# シークレットとして設定（推奨）
wrangler pages secret put VITE_BASE_URL --project-name portfolio-web

# または、スクリプトを使用
bun run scripts/env.ts production .env
```

#### デプロイ手順

```bash
# 1. ビルド
cd apps/web
bun run build

# 2. デプロイ
bun run deploy
# または
wrangler pages deploy ./build --project-name portfolio-web --branch master
```

### apps/admin のデプロイ

`apps/web` と同様の手順でデプロイします。

```bash
cd apps/admin
bun run build
bun run deploy
```

## Cloudflare Workers デプロイメント

### apps/api のデプロイ

#### 前提条件

1. Cloudflareアカウントの作成
2. D1データベースの作成

```bash
# D1データベースの作成
wrangler d1 create portfolio-db

# データベースのマイグレーション
cd packages/db
wrangler d1 migrations apply portfolio-db
```

#### ビルド設定

`wrangler.toml` でビルド設定を定義します。

```toml
# apps/api/wrangler.toml
name = "portfolio-api"
compatibility_date = "2024-01-01"
main = "src/index.ts"

[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "your-database-id"
```

#### 環境変数の設定

```bash
# シークレットとして設定
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put DATABASE_URL
```

#### デプロイ手順

```bash
# 1. ビルド
cd apps/api
bun run build

# 2. デプロイ
bun run deploy
# または
wrangler deploy
```

## GitHub Pages デプロイメント

### apps/wiki のデプロイ

Astro + Starlightを使用したドキュメントサイトをCloudflare Pagesにデプロイします。

#### 前提条件

1. GitHubリポジトリの設定
2. GitHub Pagesの有効化

#### デプロイ手順

GitHub Actions経由で自動デプロイされます。

```bash
# ローカルでビルドを確認
cd apps/wiki
bun run build

# GitHub Pagesへのデプロイは自動実行されます
```

### Storybook のデプロイ

StorybookをGitHub Pagesにデプロイします。

#### デプロイ手順

```bash
# 1. Storybookのビルド
cd apps/web
bun run build:ui

# 2. GitHub Pagesへのデプロイは自動実行されます
```

## 自動デプロイ（GitHub Actions）

### CI/CDワークフロー

`.github/workflows/` にCI/CDワークフローが定義されています。

#### CIワークフロー

- コード品質チェック（フォーマット、リント、型チェック）
- テスト実行（ユニットテスト、E2Eテスト）
- ビルド検証

#### CDワークフロー

- ドキュメントのデプロイ（`apps/wiki`）
- Storybookのデプロイ
- Swaggerドキュメントのデプロイ
- テスト結果のデプロイ

### デプロイメントトリガー

#### 自動デプロイ

- **masterブランチへのpush**: 自動的にデプロイが実行されます
- **Pull Request**: プレビューデプロイが実行されます

#### 手動デプロイ

GitHub Actionsのワークフローを手動で実行できます。

```bash
# GitHub Actionsのワークフローを手動実行
gh workflow run deploy.yml
```

## データベースマイグレーション

### D1データベースのマイグレーション

```bash
# 1. Prismaスキーマの変更
cd packages/db
# prisma/schema.prisma を編集

# 2. マイグレーションファイルの生成
bunx prisma migrate dev --name migration_name

# 3. 本番環境への適用
wrangler d1 migrations apply portfolio-db
```

### ローカル開発環境でのマイグレーション

```bash
# 開発環境でのマイグレーション
cd packages/db
bun run push

# シードデータの投入
bun run seed
```

## 環境別デプロイ設定

### 開発環境

開発環境では、ローカルで実行します。

```bash
# 開発サーバーの起動
bun run dev
```

### ステージング環境

ステージング環境では、Cloudflare Pagesのプレビューデプロイを使用します。

```bash
# プレビューデプロイ
wrangler pages deploy ./build --project-name portfolio-web --branch staging
```

### 本番環境

本番環境では、masterブランチへのpushで自動デプロイされます。

```bash
# 本番環境へのデプロイ
git push origin master
```

## デプロイメント前のチェックリスト

### ビルド前

- \[ ] すべてのテストが通過している
- \[ ] コードフォーマットが適用されている
- \[ ] リントエラーがない
- \[ ] 型チェックが通過している

### デプロイ前

- \[ ] 環境変数が正しく設定されている
- \[ ] データベースマイグレーションが適用されている
- \[ ] ビルドが成功している
- \[ ] 本番環境での動作確認が完了している

### デプロイ後

- \[ ] アプリケーションが正常に動作している
- \[ ] エラーログを確認している
- \[ ] パフォーマンスを確認している
- \[ ] アクセシビリティを確認している

## ロールバック手順

### Cloudflare Pages のロールバック

```bash
# 以前のデプロイメントを確認
wrangler pages deployment list --project-name portfolio-web

# 特定のデプロイメントにロールバック
wrangler pages deployment rollback --project-name portfolio-web --deployment-id <deployment-id>
```

### Cloudflare Workers のロールバック

```bash
# 以前のバージョンを確認
wrangler versions list

# 特定のバージョンにロールバック
wrangler rollback <version-id>
```

## トラブルシューティング

### ビルドエラー

```bash
# キャッシュをクリアして再ビルド
bun run clean
bun run build
```

### デプロイエラー

```bash
# Wranglerの認証を確認
wrangler whoami

# 環境変数を確認
wrangler pages secret list --project-name portfolio-web
```

### データベース接続エラー

```bash
# D1データベースの接続を確認
wrangler d1 execute portfolio-db --command "SELECT 1"
```

## パフォーマンス最適化

### ビルドサイズの最適化

- コード分割の活用
- 不要な依存関係の削除
- ツリーシェイキングの確認

### デプロイメント時間の短縮

- Turborepoのキャッシュを活用
- 並列ビルドの設定
- インクリメンタルビルドの活用

## セキュリティ

### 環境変数の管理

- シークレットは環境変数として設定
- `.env` ファイルをリポジトリにコミットしない
- 本番環境のシークレットを適切に管理

### アクセス制御

- Cloudflareのアクセス制御を設定
- APIエンドポイントの認証を実装
- 適切なCORS設定を適用

## Docker / K8s 向けイメージビルド

本番が Kubernetes の場合は、**イメージ内でビルドせず・turbo は使わない**方針です。ビルドは CI（またはホスト）で行い、イメージには成果物のみを載せます。アプリのソース変更時も、パッケージを再ビルドしないためビルド時間を抑えられます。

### 構成のポイント

- **イメージ内**: turbo なし。COPY のみでランタイムを構成。
- **admin / wiki**: 単一ステージの nginx。ビルドコンテキスト = **CI が出力した静的 dist の中身**（index.html, assets/ 等）。CI で `turbo run build --filter=@portfolio/admin` 等を実行し、その出力をコンテキストにして `docker build` する。
- **api / web（開発・compose）**: イメージは bun + entrypoint のみ。compose で **volume マウント `.:/app`** し、ホストのソースで wrangler dev / remix vite:dev を実行。ホストで `bun install` と必要に応じてパッケージビルドを済ませておく。
- **api / web（本番・K8s）**: CI がビルドした成果物ディレクトリをコンテキストに渡して `docker build` する。成果物の形は CI に依存（worker バンドルや build/ など）。

### CI でのビルド手順（例）

1. **パッケージ・アプリをビルド**（リポジトリルートで）:
   ```bash
   bun install --frozen-lockfile
   bunx turbo run build --filter=@portfolio/admin   # admin 用
   # または --filter=@portfolio/wiki など
   ```
2. **Docker イメージをビルド**（成果物をコンテキストに）:
   ```bash
   # admin: コンテキスト = apps/admin/dist の中身
   docker build -f apps/admin/Dockerfile -t portfolio-admin:local apps/admin/dist

   # wiki: コンテキスト = apps/wiki/dist の中身
   docker build -f apps/wiki/Dockerfile -t portfolio-wiki:local apps/wiki/dist
   ```

### compose での利用

- **admin / wiki**: `apps/admin/dist` および `apps/wiki/dist` が存在する必要がある。事前に `turbo run build --filter=@portfolio/admin` 等で生成してから `docker compose up` する。
- **api / web**: volume で `.:/app` をマウントしているため、ホストで `bun install` と（必要なら）`turbo run build --filter='./packages/*'` を実行したうえで compose を起動する。

### 本番環境での Secret Manager（例: AWS Secrets Manager）

環境変数の優先順位は **既存の環境変数 > Secret Manager 由来の environment > /run/secrets ファイル** です。

- **ローカル / compose**: `secrets/` のファイルを `/run/secrets/*` でマウントし、entrypoint が未設定の変数のみファイルから読む。
- **本番**: Secret Manager（例: AWS Secrets Manager）から取得した値を `environment` で渡す。compose の `api` / `web` には `environment: DATABASE_URL: ${DATABASE_URL:-}` 等を定義してあり、`--env-file` で渡した値がコンテナに注入される。

本番起動の流れ（例）:

1. AWS Secrets Manager にシークレットを JSON で登録（例: `{"DATABASE_URL":"...","REDIS_URL":"...","NODE_ENV":"production"}`）。
2. `scripts/secrets/fetch-aws-secrets.sh` で env 形式に変換し、`.env.production` に出力。
3. `docker compose --env-file .env.production up -d` で起動。entrypoint は既に設定された環境変数を優先するため、Secret Manager 由来の値が使われる。

```bash
./scripts/secrets/fetch-aws-secrets.sh portfolio/production --region ap-northeast-1 > .env.production
docker compose --env-file .env.production up -d
```

- 前提: aws CLI と jq がインストールされていること。詳細は `secrets/README.md` を参照。

## 参考資料

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers ドキュメント](https://developers.cloudflare.com/workers/)
- [Wrangler CLI ドキュメント](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions ドキュメント](https://docs.github.com/actions)
