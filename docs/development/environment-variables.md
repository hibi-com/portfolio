---
title: "環境変数管理"
---

## 概要

このドキュメントでは、環境変数の管理方法、命名規則、セキュリティベストプラクティスを説明します。

## 概要

このプロジェクトでは、環境変数を適切に管理し、セキュリティと設定の一貫性を保つための仕組みを提供しています。

## 環境変数の種類

### 開発環境変数

開発環境で使用する環境変数は `.env` ファイルに定義します。

```bash
# .env
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
NODE_ENV="development"
API_BASE_URL="http://localhost:8787"
VITE_BASE_URL="http://localhost:5173"
```

### 本番環境変数

本番環境では、Cloudflare Pages/Workersの環境変数として設定します。

## 環境変数の命名規則

### Vite環境変数

フロントエンドで使用する環境変数は `VITE_` プレフィックスを付けます。

```typescript
// ✅ Good: VITE_プレフィックスを使用
VITE_BASE_URL="http://localhost:5173"
VITE_GOOGLE_ANALYTICS_ENABLED="false"
VITE_SENTRY_ENVIRONMENT="development"

// ❌ Bad: VITE_プレフィックスなし
BASE_URL="http://localhost:5173"
```

### サーバーサイド環境変数

サーバーサイド（Remix loader、API）で使用する環境変数は、プレフィックスなしで定義します。

```typescript
// ✅ Good: サーバーサイド環境変数
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="your-secret-key-here"
API_BASE_URL="http://localhost:8787"
```

## 環境変数の使用方法

### フロントエンド（Vite）

Vite環境では、`import.meta.env` を使用して環境変数にアクセスします。

```typescript
// app/shared/config/settings.ts
export const BASE_URL = import.meta.env.VITE_BASE_URL ?? "__undefined__";
export const GOOGLE_ANALYTICS_ENABLED =
    import.meta.env.VITE_GOOGLE_ANALYTICS_ENABLED === "true";
```

**注意**: Cloudflare Workers環境では `process.env` は使用できません。
`import.meta.env` を使用してください。

### サーバーサイド（Remix Loader）

Remixのloaderでは、Cloudflareの環境変数にアクセスできます。

```typescript
// app/routes/api.blog.ts
export const loader = async ({ context }: LoaderFunctionArgs) => {
    // Cloudflare環境変数にアクセス
    const apiUrl = context.cloudflare.env.API_BASE_URL;

    // または、直接process.envを使用（開発環境）
    const apiUrl = process.env.API_BASE_URL;

    return json({ apiUrl });
};
```

### Cloudflare Workers/Pages

Cloudflare環境では、`wrangler.toml` または環境変数として設定します。

```toml
# wrangler.toml
[env.production]
vars = { API_BASE_URL = "https://api.example.com" }

# または、シークレットとして設定
# wrangler secret put API_BASE_URL
```

## 環境変数の型定義

TypeScriptで環境変数の型安全性を保つため、型定義ファイルを作成します。

```typescript
// apps/web/env.d.ts
interface ImportMetaEnv {
    readonly VITE_BASE_URL: string;
    readonly VITE_GOOGLE_ANALYTICS_ENABLED: string;
    readonly VITE_GOOGLE_TAG_MANAGER_ENABLED: string;
    readonly VITE_SENTRY_ENVIRONMENT: string;
    readonly VITE_SENTRY_TRACES_SAMPLE_RATE: string;
    readonly VITE_SENTRY_REPLAY_SAMPLE_RATE: string;
    readonly VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
```

## 環境変数の設定手順

### 1. ローカル開発環境

```bash
# .env.exampleをコピー
cp .env.example .env

# .envファイルを編集して必要な値を設定
# DATABASE_URL, BETTER_AUTH_SECRET などを設定
```

### 2. Cloudflare Pagesへの設定

#### 方法1: Wrangler CLIを使用

```bash
# シークレットとして設定（推奨）
wrangler pages secret put VITE_BASE_URL --project-name portfolio-web

# 環境変数として設定
wrangler pages secret put DATABASE_URL --project-name portfolio-web
```

#### 方法2: スクリプトを使用

```bash
# scripts/env.tsを使用して一括設定
bun run scripts/env.ts production .env
```

このスクリプトは `.env` ファイルから `VITE_*` で始まる環境変数を読み込み、Cloudflare Pagesに設定します。

### 3. Cloudflare Workersへの設定

```bash
# wrangler.tomlに設定
[env.production]
vars = { API_BASE_URL = "https://api.example.com" }

# または、シークレットとして設定
wrangler secret put API_BASE_URL
```

## 環境変数のバリデーション

環境変数のバリデーションは、アプリケーション起動時に実行します。

```typescript
// app/env.ts
import { z } from "zod";

const envSchema = z.object({
    VITE_BASE_URL: z.string().url(),
    VITE_GOOGLE_ANALYTICS_ENABLED: z.enum(["true", "false"]),
});

export const env = envSchema.parse({
    VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
    VITE_GOOGLE_ANALYTICS_ENABLED: import.meta.env.VITE_GOOGLE_ANALYTICS_ENABLED,
});
```

## セキュリティベストプラクティス

### 1. シークレットの管理

機密情報（APIキー、シークレットキーなど）は、環境変数として設定し、コードに直接記述しないでください。

```typescript
// ✅ Good: 環境変数から取得
const apiKey = process.env.API_KEY;

// ❌ Bad: コードに直接記述
const apiKey = "sk_live_1234567890abcdef";
```

### 2. .envファイルの管理

`.env` ファイルは `.gitignore` に含まれているため、リポジトリにコミットされません。

```gitignore
# .gitignore
.env
.env.local
.env.*.local
```

### 3. 環境変数の例ファイル

`.env.example` ファイルをリポジトリに含め、必要な環境変数のテンプレートを提供します。

```bash
# .env.example
DATABASE_URL="file:./dev.db"
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
```

### 4. シークレットの生成

シークレットキーは、適切な方法で生成します。

```bash
# OpenSSLを使用してシークレットを生成
openssl rand -base64 32

# または、Node.jsを使用
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 環境変数の一覧

### データベース

- `DATABASE_URL`: データベース接続URL（開発環境: `file:./dev.db`）

### キャッシュ

- `CACHE_URL`: Redis/Upstash キャッシュ接続URL（旧: `REDIS_URL`）

### 認証

- `BETTER_AUTH_SECRET`: Better Authのシークレットキー
- `BETTER_AUTH_URL`: Better AuthのベースURL
- `GITHUB_CLIENT_ID`: GitHub OAuth Client ID（オプション）
- `GITHUB_CLIENT_SECRET`: GitHub OAuth Client Secret（オプション）
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID（オプション）
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret（オプション）

### Cloudflare

- `CLOUDFLARE_ACCOUNT_ID`: CloudflareアカウントID（オプション）
- `CLOUDFLARE_API_TOKEN`: Cloudflare APIトークン（オプション）

### アプリケーション

- `NODE_ENV`: 実行環境（`development` | `production`）
- `API_BASE_URL`: APIのベースURL
- `VITE_BASE_URL`: フロントエンドのベースURL

### 分析・監視

- `VITE_GOOGLE_ANALYTICS_ENABLED`: Google Analytics有効化フラグ
- `VITE_GOOGLE_TAG_MANAGER_ENABLED`: Google Tag Manager有効化フラグ
- `SENTRY_DSN`: Sentry DSN（オプション）
- `SENTRY_ORG`: Sentry組織名（オプション）
- `SENTRY_PROJECT`: Sentryプロジェクト名（オプション）
- `SENTRY_AUTH_TOKEN`: Sentry認証トークン（オプション）
- `VITE_SENTRY_ENVIRONMENT`: Sentry環境名
- `VITE_SENTRY_TRACES_SAMPLE_RATE`: Sentryトレースサンプルレート
- `VITE_SENTRY_REPLAY_SAMPLE_RATE`: Sentryリプレイサンプルレート
- `VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE`: エラー時のリプレイサンプルレート

### 開発ツール

- `VITE_XSTATE_INSPECTOR_ENABLED`: XState Inspector有効化フラグ

### freee 連携（API）

- `FREEE_CLIENT_ID`: freee OAuth クライアントID（freee 連携利用時）
- `FREEE_CLIENT_SECRET`: freee OAuth クライアントシークレット（freee 連携利用時）
- `FREEE_AUTH_BASE_URL`: freee 認証サーバー基底URL（未設定時は本番 `https://accounts.secure.freee.co.jp`。開発で mock-apis 利用時は `http://mock-apis:3920` など）
- `FREEE_API_BASE_URL`: freee API サーバー基底URL（未設定時は本番 `https://api.freee.co.jp`。開発で mock-apis 利用時は `http://mock-apis:3920` など）

### メール送信（Resend）

- `RESEND_API_KEY`: Resend API キー（メール送信利用時）
- `RESEND_FROM_EMAIL`: 送信元メールアドレス（未設定時は `noreply@example.com`）

### ストレージ（Cloudflare R2）

- `R2_BUCKET`: R2 バケットバインディング名（ポートフォリオファイル等。Workers の R2 バインド名）
- `R2_PUBLIC_URL`: R2 公開URL（未設定時は R2 経由の公開URL は利用不可）

### API 共通

- `CORS_ORIGINS`: 許可するオリジン（カンマ区切り）。未設定時は `http://localhost:3000`, `http://localhost:5173`, `http://localhost:8787`
- `VITE_API_URL`: フロント／E2E から参照する API の URL（admin の `VITE_API_URL`、E2E の `VITE_API_URL`。未設定時は `http://localhost:8787`）

### Workers 専用（compose では未使用）

- `CHAT_ROOMS`: Durable Object の ChatRoom バインディング（wrangler.toml で定義）

## 開発環境での freee 擬似 API（mock-apis）

docker compose で開発するとき、freee の代わりに `@portfolio/mock-apis` を使うと、本番の freee アカウントなしで連携フローをテストできる。

- compose に `mock-apis` サービスが含まれており、api はデフォルトで `FREEE_AUTH_BASE_URL` / `FREEE_API_BASE_URL` を `http://mock-apis:3920` に設定する。
- freee 連携用の `FREEE_CLIENT_ID` / `FREEE_CLIENT_SECRET` は未設定でも mock 利用時は `mock-client-id` / `mock-client-secret` がデフォルトで入る。
- 本番の freee に接続したい場合は、`.env` や compose の `environment` で `FREEE_AUTH_BASE_URL` と `FREEE_API_BASE_URL` を未設定（または本番 URL）にし、`FREEE_CLIENT_ID` / `FREEE_CLIENT_SECRET` に本番の値を設定する。

## トラブルシューティング

### 環境変数が読み込まれない

1. `.env` ファイルが正しい場所にあるか確認
2. 環境変数の名前が正しいか確認（`VITE_` プレフィックスなど）
3. アプリケーションを再起動

### Cloudflare環境で環境変数が設定されない

1. `wrangler pages secret list` で設定済みのシークレットを確認
2. プロジェクト名が正しいか確認
3. Cloudflareダッシュボードで環境変数を確認

### 型エラーが発生する

1. `env.d.ts` ファイルに環境変数の型定義を追加
2. TypeScriptの型チェックを実行: `bun run typecheck`

## 環境変数チェックリスト

### 新規プロジェクトセットアップ

- [ ] `.env.example` をコピーして `.env` を作成
- [ ] `BETTER_AUTH_SECRET` を生成して設定
- [ ] `DATABASE_URL` を設定
- [ ] 必要なOAuthクライアントIDを設定

### デプロイ前

- [ ] 本番用の環境変数がCloudflareに設定されている
- [ ] シークレットが `wrangler secret` で設定されている
- [ ] `.env` ファイルがコミットされていない

### セキュリティ監査

- [ ] ハードコードされた認証情報がない
- [ ] ログに機密情報が出力されていない
- [ ] 不要な環境変数が削除されている

## 参考資料

- [Vite環境変数とモード](https://vitejs.dev/guide/env-and-mode.html)
- [Cloudflare Pages環境変数](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)
- [Cloudflare Workers環境変数](https://developers.cloudflare.com/workers/configuration/environment-variables/)
- [セキュリティガイドライン](../security/guidelines.md)
