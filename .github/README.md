# 🏎️💨 Portfolio

このリポジトリは、モノレポを採用したモダンなポートフォリオサイトです。

## Overview

このプロジェクトは、案件獲得率向上を目的としたポートフォリオサイトです。
TypeScript言語で実装され、以下のソフトウェアアーキテクチャに基づいた明確なレイヤー分離を採用しています。

- **Monorepo**: Turborepo + Bun Workspaces
  - 詳細は [`docs/development/monorepo-management.md`](./docs/development/monorepo-management.md) を参照してください。
- **Frontend**: Feature-Sliced Design（FSD）を採用
  - Web: Remix + FSD
  - Admin: TanStack Router + FSD
- **Backend**: Domain-Driven Design（DDD）を採用
  - API: Hono + DDD（Cloudflare Workers）

### Development Commands

必ず以下のコマンドを実行してください。

```bash
# ワークスペース
bun run build
# または特定のパッケージ
bun run build --filter=@portfolio/<package_name>

# コード品質
bun run fmt
bun run lint
bun run typecheck
bun run coverage
bun run test
bun run e2e
```

## 📚 Documentation

| カテゴリ | パス | 内容 |
| --------- | ------ | ------ |
| プロジェクト概要 | [`CLAUDE.md`](./CLAUDE.md) | 開発の最優先ルール、技術スタック、コマンド一覧 |
| アーキテクチャ | [`docs/architecture/`](./docs/architecture/) | システム設計、インフラ構成図 |
| 開発ガイド | [`docs/development/`](./docs/development/) | コーディング規約、CI/CD、トラブルシューティング |
| テスト戦略 | [`docs/testing/`](./docs/testing/) | TDD、テストサイズ、カバレッジ基準 |
| 仕様書 | [`docs/sequence/`](./docs/sequence/), [`docs/specs/`](./docs/specs/) | シーケンス図、API/DB仕様 |
| デプロイ | [`logs/deployment/README.md`](./logs/deployment/README.md) | デプロイ手順書（ローカル実行禁止） |

## 🚀 技術スタック

### Package Management

- **[Bun](https://bun.sh/)** - JavaScriptランタイム・パッケージマネージャー

### Monorepo

- **[Turborepo](https://turbo.build/)** - 高速なビルドシステム
- **[Knip](https://knip.dev/)** - デッドコード検出
- **[Syncpack](https://github.com/JamieMason/syncpack)** - 依存バージョン整合性チェック
- **[Sherif](https://github.com/guillaumewuip/sherif)** - パッケージ依存関係の検証

### Core Technologies

- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React](https://reactjs.org)** - UI library
- **[Remix](https://remix.run)** - Full stack web framework
- **[Hono](https://hono.dev/)** - 軽量なWebフレームワーク（API）
- **[TailwindCSS](https://tailwindcss.com)** - Utility-first CSS framework

### Development Tools

- **[Vite](https://vitejs.dev/)** - Build tool
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Playwright](https://playwright.dev/)** - E2E testing framework
- **[Biome](https://biomejs.dev/)** - Linter and formatter
- **[Storybook](https://storybook.js.org/)** - Component development environment
- **[Prisma](https://www.prisma.io/)** - ORM
- **[TypeSpec](https://typespec.io/)** - API specification language

### Libraries & Utilities

- **[Better-auth](https://www.better-auth.com/)** - 認証ライブラリ
- **[Framer Motion](https://www.framer.com/motion/)** - アニメーションライブラリ
- **[GSAP](https://gsap.com/)** - 高度なアニメーション
- **[Radix UI](https://www.radix-ui.com/)** - アクセシブルなUIコンポーネント
- **[Three.js](https://threejs.org/)** - 3Dグラフィックスライブラリ
- **[Lucide React](https://lucide.dev/)** - アイコンライブラリ
- **[zod](https://zod.dev/)** - スキーマバリデーション

### Documentation

- **[Astro](https://astro.build/)** - Static site generator
- **[Starlight](https://starlight.astro.build/)** - Documentation theme for Astro

### Database & Infrastructure

- **[TiDB Cloud Serverless](https://tidbcloud.com/)** - MySQL互換分散データベース
- **[Redis Cloud](https://redis.com/cloud/)** - インメモリデータストア
- **[Pulumi](https://www.pulumi.com/)** - Infrastructure as Code

### Hosting & Deployment

- **[Cloudflare Pages](https://pages.cloudflare.com/)** - ホスティングプラットフォーム（Web, Admin, Wiki）
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - サーバーレスプラットフォーム（API）
- **[CircleCI](https://circleci.com/)** - CI/CDパイプライン（デプロイは自動化、ローカル実行禁止）
- **[Backblaze B2](https://www.backblaze.com/b2/)** - ビルドアーティファクトストレージ
