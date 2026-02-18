---
title: Portfolio Documentation
description: ポートフォリオプロジェクトの開発ドキュメント
template: splash
hero:
  tagline: Turborepo + Bun + Cloudflare で構築されたフルスタックポートフォリオサイト
  actions:
    - text: クイックスタート
      link: "#quick-start"
      icon: rocket
    - text: アーキテクチャ
      link: /architecture/overview/
      icon: right-arrow
      variant: minimal
---

> 仕様駆動開発 (SDD) + テスト駆動開発 (TDD) を採用したMonorepoプロジェクト

## Quick Start

### 開発環境のセットアップ

```bash
# 1. リポジトリをクローン
git clone https://github.com/ageha734/portfolio.git
cd portfolio

# 2. 依存関係をインストール
bun install

# 3. 開発サーバーを起動
bun run dev
```

### 頻出コマンド

| コマンド | 説明 |
| -------- | ---- |
| `bun run dev` | 開発サーバー起動 |
| `bun run test` | ユニットテスト実行 |
| `bun run lint` | リント実行 |
| `bun run typecheck` | 型チェック実行 |
| `bun run integration` | E2Eテスト実行 |
| `bun run e2e` | E2Eテスト実行 |
| `bun run build` | プロダクションビルド |

## Tech Stack

技術スタックの一覧は [技術スタック](./development/tech-stack.md) で単一管理。  
変更時はそのファイルのみ更新する。

## Documentation Map

### 設計・仕様

| カテゴリ | 説明 | パス |
| -------- | ---- | ---- |
| [アーキテクチャ](./architecture/overview.md) | システム全体の設計 | `docs/architecture/` |
| [API仕様](./specs/api/) | REST API仕様書 | `docs/specs/api/` |
| [DB仕様](./specs/db/) | データベーススキーマ | `docs/specs/db/` |
| [シーケンス図](./sequence/) | 処理フロー図 | `docs/sequence/` |
| [ユーザーストーリー](./user-stories/) | BDDユーザーストーリー | `docs/user-stories/` |

### 開発ガイド

| カテゴリ | 説明 | パス |
| -------- | ---- | ---- |
| [技術スタック](./development/tech-stack.md) | アプリ・パッケージ・基盤（単一参照先） | `docs/development/tech-stack.md` |
| [コーディング規約](./development/coding-standards.md) | 命名規則・スタイル | `docs/development/` |
| [ドキュメント運用方針](./development/documentation-policy.md) | 何を書くか・避けるべきパターン | `docs/development/documentation-policy.md` |
| [テストガイド](./testing/testing-guide.md) | テストの書き方・実行方法・戦略詳細 | `docs/testing/testing-guide.md` |
| [環境変数](./development/environment-variables.md) | 環境設定 | `docs/development/environment-variables.md` |
| [デプロイ](./development/deployment.md) | CI/CD・デプロイ手順 | `docs/development/deployment.md` |
| [開発ワークフロー](./development/workflow.md) | 新機能開発・バグ修正・品質チェック | `docs/development/workflow.md` |

### 品質・セキュリティ

| カテゴリ | 説明 | パス |
| -------- | ---- | ---- |
| [セキュリティ](./security/) | セキュリティガイドライン | `docs/security/` |
| [バリデーション](./specs/validation.md) | 入力検証仕様 | `docs/specs/validation.md` |
| [エラーコード](./specs/error-codes.md) | エラー定義一覧 | `docs/specs/error-codes.md` |
| [テスト戦略](./testing/testing-strategy.md) | テストサイズ・ドキュメント対応・カバレッジ | `docs/testing/testing-strategy.md` |
| [QAシート](./testing/qa-sheet.md) | テストカバレッジ | `docs/testing/qa-sheet.md` |

フロントは FSD、バックエンド API は DDD を採用しています。  
レイヤーやディレクトリの詳細は [アーキテクチャ](./architecture/overview.md) およびリポジトリのソースを参照してください。

## Development Workflow

新機能開発（SDD + TDD）・バグ修正・コード品質チェックの手順は [開発ワークフロー](./development/workflow.md) で管理する。

## Testing Strategy

テストのサイズ区分・ドキュメント対応・カバレッジ目標は [テスト戦略](./testing/testing-strategy.md) で管理する。

## Important Rules

- **禁止事項・命名規則**: [コーディング規約](./development/coding-standards.md) で管理。
- **コミットメッセージ**: [Git Commit ガイドライン](./development/git-commit.md) で管理。

## Support

### 質問・フィードバック

- Claude Code: `/help` コマンドで使い方を確認

### 参考資料

| リソース | リンク |
| -------- | ------ |
| Feature-Sliced Design | [feature-sliced.design](https://feature-sliced.design/) |
| Domain-Driven Design | [domainlanguage.com](https://www.domainlanguage.com/ddd/) |
| Turborepo | [turbo.build/repo](https://turbo.build/repo/docs) |
| Bun | [bun.sh](https://bun.sh/docs) |
| Cloudflare Workers | [developers.cloudflare.com](https://developers.cloudflare.com/workers/) |
| Hono | [hono.dev](https://hono.dev/) |
| Remix | [remix.run](https://remix.run/docs) |
| TanStack Router | [tanstack.com/router](https://tanstack.com/router) |
