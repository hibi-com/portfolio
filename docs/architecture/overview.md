---
title: "Architecture Overview"
---

このプロジェクトは、**Turborepo + Bun Workspaces** を採用したMonorepo構造のポートフォリオプロジェクトです。

## Monorepo構造

このプロジェクトは、複数のアプリケーションとパッケージを単一のリポジトリで管理するMonorepo構造を採用しています。

### ワークスペース構成

- **`apps/`**: アプリケーション層
  - `web/`: Remix + Cloudflare Pages（ポートフォリオサイト）
  - `api/`: Hono + Cloudflare Workers + D1（CMS API）
  - `admin/`: React + Vite + Tanstack Router（管理ダッシュボード）
  - `wiki/`: Astro + Starlight（ドキュメントサイト）
- **`packages/`**: 共通パッケージ層
  - `ui/`: Design System
  - `api/`: API定義統合
  - `db/`: Database（Prisma + D1）
  - `auth/`: Better-auth共通設定
  - `cache/`: Redis クライアント
  - `log/`: ロガー（Sentry、Prometheus）
  - `validation/`: Zod バリデーションスキーマ
- **`tooling/`**: 開発ツール設定
  - `storybook/`: Storybook共通設定
  - `biome/`: Biome Base Config
  - `tailwind/`: Tailwind Base Config
  - `tsconfig/`: TypeScript Base Configs
  - `vite/`: Vite設定
  - `vitest/`: Vitest設定
  - `playwright/`: Playwright設定
  - `changelog/`: チャンゲログ生成
- **`infra/`**: インフラストラクチャ（Pulumi）
- **`testing/`**: テストユーティリティ
  - `mocks/`: MSW モックハンドラー
  - `vitest/`: Vitest テストユーティリティ
- **`scripts/`**: 運用スクリプト
  - `check/`: コード品質チェック
  - `env/`: 環境変数管理
  - `workspace/`: ワークスペース管理

### 技術スタック

- **Monorepo**: Turborepo + Bun Workspaces
- **Runtime**: Cloudflare Workers (API), Cloudflare Pages (Web),
  Cloudflare D1 (DB)
- **Language**: TypeScript (Strict Mode)

### 重要なルール

- **Naming**: `utils`というディレクトリ名は**厳格に禁止**。
  代わりに`lib`、`shared`、`infra`、または具体的な名前を使用
- **App Structure**:
  - `apps/web`、`apps/admin`、`apps/wiki`: `app/`をソースルートとして使用（`src/`は使用しない）
  - `apps/api`: `src/`をソースルートとして使用（DDDアーキテクチャ）
- **Package Structure**: `packages/*`と`tooling/*`内のディレクトリは`src/`を使用可能

詳細は [`project-structure.md`](./project-structure.md) を参照してください。

## Feature-Sliced Design (FSD)

このプロジェクトは、フロントエンドアプリケーション（`apps/web`、`apps/admin`）で
Feature-Sliced Design (FSD) アーキテクチャを採用しています。

### レイヤー構造

- **app/**: アプリケーションエントリーポイント（`root.tsx`, `entry.client.tsx`, `entry.server.tsx`）
- **routes/**: ページレイヤー（Remixのルートファイル）
- **widgets/**: 大きなUIブロック（自己完結型のUIセクション）
- **features/**: ユーザー機能（特定のユースケースに特化）
- **entities/**: ドメインモデル（ビジネスエンティティ）
- **shared/**: 共通リソース（UIコンポーネント、ユーティリティ、API、設定、型定義）

### インポートルール

FSDのインポートルールに従い、上位レイヤーから下位レイヤーへのみインポート可能です。

**許可されるインポート:**

- ✅ `routes/` → `widgets/`, `features/`, `entities/`, `shared/`
- ✅ `widgets/` → `features/`, `entities/`, `shared/`
- ✅ `features/` → `entities/`, `shared/`
- ✅ `entities/` → `shared/`
- ✅ 同じレイヤー内でのインポート

**禁止されるインポート:**

- ❌ `shared/` → `entities/`, `features/`, `widgets/`, `routes/`
- ❌ `entities/` → `features/`, `widgets/`, `routes/`
- ❌ `features/` → `widgets/`, `routes/`
- ❌ `widgets/` → `routes/`

### パスエイリアス

TypeScriptのパスエイリアスが設定されており、`~`プレフィックスでインポートできます：

- `~/shared/*` → `app/shared/*`
- `~/entities/*` → `app/entities/*`
- `~/features/*` → `app/features/*`
- `~/widgets/*` → `app/widgets/*`
- `~/*` → `app/*`

**注意:** `~/components/*`というパスエイリアスは存在しません。コンポーネントは`widgets/`、`features/`、または`shared/ui/`に配置されます。

詳細は [`feature-sliced.md`](./feature-sliced.md) を参照してください。

## Domain-Driven Design (DDD)

バックエンドAPI（`apps/api`）では、Domain-Driven Design (DDD) アーキテクチャを採用しています。

詳細は [`domain-driven.md`](./domain-driven.md) を参照してください。

## プロジェクト構造

詳細なプロジェクト構造については [`project-structure.md`](./project-structure.md) を参照してください。

## インフラストラクチャ

Pulumi で管理する Cloudflare / Doppler / TiDB / Redis / Grafana / Sentry の構成と関係は [`infra-architecture.md`](./infra-architecture.md) を参照してください。
