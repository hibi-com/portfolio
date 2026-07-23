---
title: "API Key Setup"
---

# API Key Setup

このプロジェクトで必要な各種APIキー・トークンの発行手順をまとめています。

## 環境変数・Cloudflare の管理

- **compose で使う値**: `compose.yaml` の `environment` を正とし、ローカルは `.env` や compose のデフォルト値を使用。
- **Cloudflare Pages/Workers**: `pulumi up` 実行時に `infra/.env` の値が Pulumi 経由で Cloudflare の環境変数に反映される。デプロイ後は Cloudflare Dashboard または `wrangler secret` で管理。
- **infra 用シークレット**（Cloudflare, Sentry 等）: `infra/.env` または `infra/env.yaml` に設定し、`cd infra && pulumi up` で適用。
- **D1 / KV / R2**: Pulumi（`infra/src/resources/cloudflare-data.ts`）が作成する。Cloudflare アカウント向けの API トークン以外に、これらのリソース専用の API キーは不要。

## 目次

1. [Cloudflare APIトークン](#cloudflare-apiトークン)
2. [Sentry認証トークン](#sentry認証トークン)
3. [Google OAuth認証情報](#google-oauth認証情報)
4. [Better Auth Secret](#better-auth-secret)
5. [CircleCI（Pulumi × R2）](./circleci-pulumi-r2.md)

## Cloudflare APIトークン

### Cloudflare - 必要な情報

- `CLOUDFLARE_API_TOKEN` - APIトークン
- `CLOUDFLARE_ACCOUNT_ID` - アカウントID
- `CLOUDFLARE_ZONE_ID` - ゾーンID

### Cloudflare - 発行手順

#### 1. APIトークンの作成

1. `https://dash.cloudflare.com/profile/api-tokens` にアクセス
2. 「Create Token」をクリック
3. 「Create Custom Token」を選択
4. 以下の設定を行う：
   - **Token name**: `portfolio-infra` など任意の名前
   - **Permissions**:
     - **Zone** → **DNS** → **Edit**
     - **Zone** → **Zone** → **Read**
     - **Account** → **Cloudflare Pages** → **Edit**
     - **Account** → **Workers Scripts** → **Edit**
     - **Account** → **D1** → **Edit**（データベース用）
     - **Account** → **Workers KV Storage** → **Edit**（キャッシュ用）
     - **Account** → **Workers R2 Storage** → **Edit**（アプリ画像用）
     - **Account** → **Access: Apps and Policies** → **Edit** (Zero Trust Access用)
   - **Account Resources**: 対象のアカウントを選択
   - **Zone Resources**: 「Include」を選択し、対象のゾーンを選択
5. 「Continue to summary」→「Create Token」をクリック
6. 表示されたトークンをコピー（**再表示できないため注意**）

#### 2. アカウントIDの取得

1. `https://dash.cloudflare.com/` にアクセス
2. 右サイドバーの「Account ID」をコピー

#### 3. ゾーンIDの取得

1. `https://dash.cloudflare.com/` にアクセス
2. 対象のドメインを選択
3. 右サイドバーの「Zone ID」をコピー

### Cloudflare - 環境変数への設定

```env
CLOUDFLARE_API_TOKEN="your-api-token"
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_ZONE_ID="your-zone-id"
```

## Sentry認証トークン

### Sentry - 必要な情報

- `SENTRY_AUTH_TOKEN` - 認証トークン
- `SENTRY_ORG` - 組織スラッグ
- `SENTRY_DSN` - プロジェクトDSN

### Sentry - 発行手順

#### 1. 認証トークンの作成

1. [Sentry API Tokens](https://sentry.io/settings/account/api/auth-tokens/) にアクセス
2. 「Create New Token」をクリック
3. 以下の設定を行う：
   - **Name**: `portfolio-infra` など任意の名前
   - **Scopes**:
     - ✅ `org:read` - 組織の読み取り
     - ✅ `org:write` - 組織の書き込み
     - ✅ `project:read` - プロジェクトの読み取り
     - ✅ `project:write` - プロジェクトの書き込み
     - ✅ `team:read` - チームの読み取り
     - ✅ `team:write` - チームの書き込み
4. 「Create Token」をクリック
5. 表示されたトークンをコピー（**再表示できないため注意**）

#### Sentry - 2. 組織スラッグの取得

1. [Sentry Settings](https://sentry.io/settings/) にアクセス
2. 組織名の下に表示されるスラッグ（例: `hibicom`）をコピー

#### 3. DSNの取得

1. [Sentry Settings](https://sentry.io/settings/) にアクセス
2. 対象のプロジェクトを選択
3. 「Settings」→「Client Keys (DSN)」にアクセス
4. 「DSN」をコピー

### Sentry - 環境変数への設定

```env
SENTRY_AUTH_TOKEN="your-auth-token"
SENTRY_ORG="your-org-slug"
SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
```

### Sentry - トラブルシューティング

#### エラー: "Invalid token header. No credentials provided"

**原因**: PulumiのSentryプロバイダーが認証トークンを正しく読み取れていない

**解決方法**:

1. `infra/.env` の `SENTRY_AUTH_TOKEN` が正しく設定されているか確認
2. トークンが有効で、必要なスコープ（`org:read`, `org:write`, `team:read`, `team:write`, `project:read`, `project:write`）が付与されているか確認
3. `check infra` を実行して、トークンの有効性を確認

#### エラー: "You do not have permission to perform this action" (403)

**原因**: 認証トークンに必要なスコープが不足している

**解決方法**:

1. [Sentry API Tokens](https://sentry.io/settings/account/api/auth-tokens/) にアクセス
2. 既存のトークンを削除し、新しいトークンを作成
3. すべての必要なスコープを選択：
   - ✅ `org:read`
   - ✅ `org:write`
   - ✅ `team:read`
   - ✅ `team:write`
   - ✅ `project:read`
   - ✅ `project:write`
4. 新しいトークンを`.env`ファイルに設定する

## Google OAuth認証情報

### Google OAuth - 必要な情報

- `GOOGLE_CLIENT_ID` - クライアントID
- `GOOGLE_CLIENT_SECRET` - クライアントシークレット

### Google OAuth - 発行手順

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 「APIとサービス」→「認証情報」→「+ 認証情報を作成」→「OAuth クライアント ID」
3. アプリケーションの種類で「ウェブアプリケーション」を選択
4. 承認済みのリダイレクトURIに `http://localhost:3000/api/auth/callback/google` 等を追加
5. 表示されたクライアントIDとシークレットをコピー

### Google OAuth - 環境変数への設定

```env
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## Better Auth Secret

### Better Auth - 必要な情報

- `BETTER_AUTH_SECRET` - 認証用シークレットキー

### Better Auth - 生成手順

```bash
openssl rand -base64 32
```

または

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Better Auth - 環境変数への設定

```env
BETTER_AUTH_SECRET="your-generated-secret-key"
```

## まとめ

すべての認証情報を `infra/.env` に設定し、`check infra` で検証できます。`cd infra && pulumi up` で Cloudflare Pages/Workers に環境変数が反映され、D1 / KV / R2 も合わせて作成・紐付けされます。

## check infra コマンド（APIキー・トークン検証）

`scripts/check` の `infra` サブコマンドで、`.env` から読み込んだ API キー・トークンの有効性を一括検証できます。

### 使用方法

```bash
# リポジトリルートから（check は fmt/lint/type/test/knip を実行。infra は -- で渡す）
bun run check -- infra
```

### 確認内容

- Cloudflare APIトークン（トークン・アカウント・ゾーン・DNS・Pages・Workers・D1/KV/R2）
- Sentry認証トークン（トークン・組織・チーム・プロジェクト）
- Google OAuth（形式チェック）
- Better Auth Secret（形式チェック）

### 注意事項

- `.env` はリポジトリルートに配置し、未設定の項目は警告のみでエラーにはなりません。
- 詳細な発行手順は本ドキュメントの各セクションを参照してください。
- D1 / Workers KV / R2 の接続情報は Cloudflare バインディング経由でアプリに渡されるため、別途 `DATABASE_URL` 等の外部 DB 接続文字列は本番では不要です（ローカルは libSQL 用の URL を使用）。
