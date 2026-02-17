---
title: "Project Structure"
---

このプロジェクトは、**Turborepo + Bun Workspaces** を採用したMonorepo構造です。

## Monorepo構造

```text
./
├── apps/                         # アプリケーション層
│   ├── web/                      # Remix + Cloudflare Pages
│   ├── api/                      # Hono + Cloudflare Workers + D1
│   ├── admin/                    # React + Vite + Tanstack Router
│   ├── e2e/                      # Remix + Cloudflare Pages (Test Portal)
│   └── wiki/                     # Astro + Starlight
├── packages/                     # 共通パッケージ層
│   ├── ui/                       # Design System
│   ├── api/                      # API定義統合
│   ├── db/                       # Database (Prisma + D1)
│   ├── auth/                     # Better-auth共通設定
│   ├── cache/                    # Redis クライアント
│   ├── log/                      # ロガー (Sentry, Prometheus)
│   └── validation/               # Zod バリデーションスキーマ
├── tooling/                      # 開発ツール設定
│   ├── storybook/                # Storybook共通設定
│   ├── biome/                    # Biome Base Config
│   ├── tailwind/                 # Tailwind Base Config
│   ├── tsconfig/                 # TypeScript Base Configs
│   ├── vite/                     # Vite設定
│   ├── vitest/                   # Vitest設定
│   ├── playwright/               # Playwright設定
│   └── changelog/                # チャンゲログ生成
├── infra/                        # インフラストラクチャ (Pulumi)
├── testing/                      # テストユーティリティ
│   ├── mocks/                    # MSW モックハンドラー
│   └── vitest/                   # Vitest テストユーティリティ
├── generators/                   # Scaffolding Templates
└── scripts/                      # 運用スクリプト
    ├── check/                    # チェックスクリプト
    ├── env/                      # 環境変数管理
    └── workspace/               # ワークスペース管理
```

## アプリケーション層 (`apps/`)

### apps/web (Remix + Cloudflare Pages)

ポートフォリオサイト（BFF）です。Feature-Sliced Design (FSD) を採用しています。

**構造:**

- `app/`: FSDルート（`src/`は使用しない）
  - `entities/`: ドメインモデル
  - `features/`: ユーザー機能
  - `widgets/`: 大きなUIブロック
  - `shared/`: 共通リソース
  - `routes/`: Remix Routes（`api+/`でBFF Resource Routes）
- `functions/`: Cloudflare Pages Functions
- `e2e/`: Playwright E2Eテスト

詳細は [`feature-sliced.md`](./feature-sliced.md) を参照してください。

### apps/api (Hono + Cloudflare Workers + D1)

CMS APIです。Domain-Driven Design (DDD) を採用しています。

**構造:**

- `src/`: DDDルート
  - `usecase/`: Application Rules
  - `domain/`: Enterprise Rules（Model, Repo I/F）
  - `infra/`: Frameworks（D1, Repo Impl, Cache）
  - `interface/`: Adapters（REST Handlers, Middleware）
  - `lib/`: Shared internal utilities
  - `di/`: Dependency Injection
- `e2e/`: Playwright E2Eテスト

詳細は [`domain-driven.md`](./domain-driven.md) を参照してください。

### apps/admin (React + Vite + Tanstack Router)

管理ダッシュボードです。Feature-Sliced Design (FSD) を採用しています。

**構造:**

- `app/`: FSDルート（`src/`は使用しない）
  - `app/`: App initialization
  - `routes/`: Tanstack Router
  - `widgets/`: 大きなUIブロック
  - `features/`: ユーザー機能
  - `entities/`: ドメインモデル
  - `shared/`: 共通リソース
- `functions/`: Cloudflare Pages Functions
- `e2e/`: Playwright E2Eテスト

詳細は [`feature-sliced.md`](./feature-sliced.md) を参照してください。

### apps/e2e (Remix + Cloudflare Pages)

認証付きTest Portalサイトです。E2Eテストレポートとカバレッジレポートを可視化します。

**構造:**

- `app/`: Remixアプリケーション
  - `routes/`: ファイルベースルーティング（認証、ダッシュボード、レポート表示）
  - `lib/`: ユーティリティ（auth.server.ts, reports/）
- `e2e/`: Playwright E2Eテスト
  - `large/`: Large Tests (E2E)
- `public/`: 静的ファイル
  - `reports/`: テストレポート出力先（E2E、カバレッジ）
- `playwright.config.ts`: Playwright設定
- `vite.config.ts`: Vite + Remix設定
- `wrangler.toml`: Cloudflare Pages設定

### apps/wiki (Astro + Starlight)

Wikiドキュメントサイトです。

**構造:**

- `docs/`: Markdownドキュメント（Starlightコンテンツコレクション）
- `src/`: ソースコード
  - `content.config.ts`: コンテンツコレクション設定
  - `styles/`: カスタムスタイル
- `design/`: デザインアセット（Storybookビルド成果物など）
- `reference/`: APIリファレンス

## パッケージ層 (`packages/`)

### packages/ui

Design System（公開予定）です。

**構造:**

- `src/`: ソースコード（`src/`を使用可能）
  - `components/`: Atomic Components
  - `hooks/`: カスタムフック
- `.storybook/`: Storybook設定（toolingから継承）

### packages/api

API定義統合パッケージです。

**構造:**

- `src/`: ソースコード
  - `schema/`: Zod/TypeSpec Schema
  - `generated/`: Orval生成クライアント（自動生成）

### packages/db

Database（Prisma + D1）パッケージです。

**構造:**

- `prisma/`: Prismaスキーマ
- `migrations/`: D1用マイグレーションSQL
- `src/`: ソースコード
  - `client.ts`: Prisma Client factory
  - `seed.ts`: 初期データ投入

### packages/auth

Better-auth共通設定パッケージです。

**構造:**

- `src/`: ソースコード
  - `index.ts`: Better-auth設定とエクスポート

### packages/cache

Redis クライアントパッケージです。

**構造:**

- `src/`: ソースコード
  - `client/`: Redis クライアント実装

### packages/log

ロガーパッケージです（Sentry、Prometheus統合）。

**構造:**

- `src/`: ソースコード
  - `logger/`: ロガー実装
  - `sentry/`: Sentry クライアント
  - `prometheus/`: Prometheus メトリクス
  - `errors/`: エラーハンドリング

### packages/validation

Zod バリデーションスキーマパッケージです。

**構造:**

- `src/`: ソースコード
  - `schemas/`: Zod スキーマ定義
  - `lib/`: バリデーションユーティリティ

## ツール設定層 (`tooling/`)

### tooling/storybook

Storybook共通設定基盤です。

**構造:**

- `src/`: ソースコード
  - `main.preset.ts`: Storybook メイン設定
  - `preview.preset.tsx`: Storybook プレビュー設定
  - `theme.ts`: テーマ設定

### tooling/biome

Biome Base Configです。

### tooling/tailwind

Tailwind Base Configです。

**構造:**

- `src/`: ソースコード
  - `postcss-config.js`: PostCSS設定
  - `theme.css`: テーマ定義

### tooling/tsconfig

TypeScript Base Configsです。

- `base.json`: ベース設定
- `compiled-package.json`: ビルド用パッケージ設定（`base.json`を継承）

### tooling/vite

Vite設定パッケージです。

**構造:**

- `src/`: ソースコード
  - `index.ts`: Vite設定エクスポート

### tooling/vitest

Vitest設定パッケージです。

**構造:**

- `src/`: ソースコード
  - `index.ts`: Vitest設定エクスポート
  - `setup.ts`: テストセットアップ
  - `mocks.ts`: モック設定
  - `msw.ts`: MSW設定
  - `render.tsx`: テストレンダリングユーティリティ

### tooling/playwright

Playwright設定パッケージです。

**構造:**

- `src/`: ソースコード
  - `index.ts`: Playwright設定エクスポート

### tooling/changelog

チャンゲログ生成パッケージです。

**構造:**

- `src/`: ソースコード
  - `index.ts`: チャンゲログ生成ロジック

## FSDレイヤーの詳細説明（apps/web, apps/admin）

FSDの各レイヤーの詳細については、[`feature-sliced.md`](./feature-sliced.md) を参照してください。

### shared/

全体で再利用可能なリソースを配置します。

- **ui/**: 汎用UIコンポーネント（Button、Inputなど）
- **api/**: APIクライアント、Orval生成クライアント設定など
- **config/**: 設定ファイル（定数、i18n設定など）
- **hooks/**: カスタムReactフック
- **validation/**: バリデーションスキーマ（Zodなど）

**重要**: `utils`というディレクトリ名は**厳格に禁止**されています。
代わりに`lib`、`shared`、`infra`、または具体的な名前を使用してください。

## ファイル命名規則

### コンポーネント

- PascalCaseを使用: `BlogPreview.tsx`
- ファイル名はコンポーネント名と一致

### ユーティリティ

- camelCaseを使用: `formatDate.ts`, `getUserData.ts`

### 型定義

- PascalCaseを使用: `types.ts`内で`BlogPreviewProps`など

### テストファイル

- コンポーネント名に`.test.tsx`を追加: `BlogPreview.test.tsx`
- スナップショットテスト: `BlogPreview.test.tsx.snap`

詳細なコーディング規約は [`../development/coding-standards.md`](../development/coding-standards.md) を参照してください。

## インフラストラクチャ層 (`infra/`)

### infra

Pulumiを使用したインフラストラクチャ管理です。

**構造:**

- `src/`: ソースコード
  - `resources/`: リソース定義
    - `databases.ts`: データベースリソース
    - `dns.ts`: DNS設定
    - `observability.ts`: 監視設定
    - `pages.ts`: Cloudflare Pages設定
    - `workers.ts`: Cloudflare Workers設定
  - `config.ts`: 設定管理
  - `index.ts`: エントリーポイント

## テストユーティリティ層 (`testing/`)

### testing/msw

MSW モックハンドラーパッケージです。

**構造:**

- `src/`: ソースコード
  - `handlers/`: MSW ハンドラー定義
  - `server.ts`: サーバーサイドモック
  - `browser.ts`: ブラウザサイドモック

### testing/vitest

Vitest テストユーティリティパッケージです。

**構造:**

- `src/`: ソースコード
  - `render.tsx`: テストレンダリングユーティリティ
  - `index.ts`: エクスポート

## スクリプト層 (`scripts/`)

### scripts/check

コード品質チェックスクリプトです。

**構造:**

- `cmd/`: CLI エントリーポイント
- `routines/`: チェックルーチン

### scripts/env

環境変数管理スクリプトです。

**構造:**

- `cmd/`: CLI エントリーポイント
- `routines/`: 環境変数管理ルーチン

### scripts/workspace

ワークスペース管理スクリプトです。

**構造:**

- `cmd/`: CLI エントリーポイント
- `routines/`: ワークスペース管理ルーチン
  - `docker.ts`: Docker管理
  - `env.ts`: 環境変数管理
  - `install.ts`: 依存関係インストール
  - `migrate.ts`: データベースマイグレーション
  - `schema.ts`: スキーマ管理
  - `workspace.ts`: ワークスペース操作
