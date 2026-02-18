---
title: "技術スタック"
---

技術スタックは変更されやすいため、このファイルを**単一の参照先**として管理する。アプリ・パッケージ・ツールの追加・変更時はここだけ更新する。

---

## 基盤

| 項目 | 技術 |
| -------- | -------- |
| Monorepo | Turborepo + Bun Workspaces |
| パッケージマネージャ | Bun |
| 言語 | TypeScript (Strict Mode) |
| フォーマット・リント | Biome |
| ビルド | Vite（フロント）, esbuild（API 等） |

### Runtime（デプロイ先）

| 用途 | 技術 |
| -------- | -------- |
| フロント・管理画面・Wiki | Cloudflare Pages |
| API | Cloudflare Workers |
| DB（本番） | TiDB Cloud（D1 互換レイヤー利用時は Cloudflare D1） |
| キャッシュ | Redis Cloud |

---

## アプリケーション（`apps/`）

デプロイ対象のアプリ。追加・削除時はこの表とリポジトリの `apps/` を同期する。

| アプリ | パッケージ名 | 技術 | 用途 |
| -------- | -------- | -------- | -------- |
| **web** | `@portfolio/web` | Remix + Vite, Cloudflare Pages, FSD | ポートフォリオ・ブログ公開サイト |
| **admin** | `@portfolio/admin` | Vite + TanStack Router, Cloudflare Pages, FSD | 管理ダッシュボード（投稿・問い合わせ・CRM 等） |
| **api** | `@portfolio/cms` | Hono, Cloudflare Workers, DDD | バックエンド API（CMS・問い合わせ・CRM） |
| **e2e** | `@portfolio/e2e` | Remix + Vite, Cloudflare Pages | Test Portal（認証付き）。E2E・カバレッジレポート表示 |
| **wiki** | `@portfolio/wiki` | Astro + Starlight | ドキュメント・Wiki サイト |

---

## 共有パッケージ（`packages/`）

アプリ間で共有するライブラリ。追加・削除時はこの表とリポジトリの `packages/` を同期する。

| パッケージ | 名前 | 用途 |
| -------- | -------- | -------- |
| **db** | `@portfolio/db` | Prisma スキーマ・クライアント。D1 / TiDB 対応。マイグレーション含む |
| **api** | `@portfolio/api` | API クライアント（Orval 等で生成）。型・Zod スキーマ・エンドポイント定義 |
| **auth** | `@portfolio/auth` | Better Auth 共通設定・ヘルパー |
| **cache** | `@portfolio/cache` | Redis クライアント（キャッシュ・セッション等） |
| **log** | `@portfolio/log` | 構造化ロギング・Sentry・Prometheus 等 |
| **ui** | `@portfolio/ui` | 共通 UI コンポーネント（shadcn/ui ベース等） |
| **validation** | `@portfolio/validation` | Zod バリデーションスキーマ（API 以外の共通スキーマ） |

---

## ツール・設定（`tooling/`）

ビルド・テスト・品質まわりの共通設定。追加・削除時はこの表とリポジトリの `tooling/` を同期する。

| パッケージ | 用途 |
| -------- | -------- |
| `@portfolio/biome-config` | Biome 共通設定 |
| `@portfolio/tailwind-config` | Tailwind CSS 共通設定 |
| `@portfolio/tsconfig` | TypeScript ベース設定（base / compiled-package 等） |
| `@portfolio/vite-config` | Vite 共通設定 |
| `@portfolio/vitest-config` | Vitest 共通設定・セットアップ・MSW |
| `@portfolio/playwright-config` | Playwright 共通設定 |
| `@portfolio/playwright-reporter` | Playwright レポーター |
| `@portfolio/vitest-reporter` | Vitest レポーター |
| `@portfolio/storybook-config` | Storybook 共通設定 |
| `@portfolio/changelog-config` | チャンゲログ生成設定 |
| `@portfolio/prisma-migration` | Prisma マイグレーション実行用 |
| `@portfolio/prisma-markdown` | Prisma スキーマから Markdown 生成 |

---

## その他ワークスペース

| パス | 用途 |
| -------- | -------- |
| `testing/` | MSW モック、Vitest 用ユーティリティ等 |
| `scripts/` | チェック・環境変数・ワークスペース管理用 CLI |
| `generators/` | スキャフォールド・コード生成 |
| `infra/` | Pulumi によるインフラ定義 |

---

## インフラストラクチャ（本番・ステージング）

構成とリソースの関係は `infra/`（Pulumi）および [インフラアーキテクチャ](../architecture/infra-architecture.md) を参照。ここではサービス名のみ列挙する。

| 種別 | サービス |
| -------- | -------- |
| ホスティング・エッジ | Cloudflare（Pages, Workers, DNS） |
| データベース | TiDB Cloud（Serverless） |
| キャッシュ | Redis Cloud |
| オブジェクトストレージ | Backblaze B2（利用時） |
| 可観測性 | Grafana Cloud, Sentry |
| シークレット・環境変数 | Cloudflare 環境変数（Doppler 等と連携する場合はその設定を参照） |

---

## 更新ルール

- アプリ・パッケージ・ツールを追加・削除・リネームしたら、このドキュメントの該当セクションを更新する。
- 他ドキュメントでは「技術スタックの一覧は [技術スタック](./tech-stack.md) を参照」とし、一覧の二重管理をしない。
