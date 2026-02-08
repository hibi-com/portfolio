# プロジェクトコンテキスト

> 旧 `docs/prompts.md` の内容を移行・整理

## プロジェクト概要

**Turborepo + Bun Workspaces** を採用したモノレポ構造のポートフォリオプロジェクト。

### アーキテクチャ

| アプリ | アーキテクチャ | 技術スタック |
| ------ | -------------- | ------------ |
| apps/web | Feature-Sliced Design (FSD) | Remix + Cloudflare Pages |
| apps/admin | Feature-Sliced Design (FSD) | TanStack Router + Vite |
| apps/api | Domain-Driven Design (DDD) | Hono + Cloudflare Workers + D1 |

詳細は `docs/architecture/` を参照。

## FSDレイヤー構造

```text
app/
├── routes/      # ページレイヤー（Remix/Tanstack Router）
├── widgets/     # 大きなUIブロック
├── features/    # ユーザー機能
├── entities/    # ドメインモデル
└── shared/      # 共通リソース
```

詳細は `docs/architecture/feature-sliced.md` を参照。

## テスト戦略

| テストタイプ | ツール | 命名規則 |
| ------------ | ------ | -------- |
| ユニットテスト (Small) | Vitest | `*.test.ts` |
| 統合テスト (Medium) | Vitest | `*.medium.test.ts` |
| E2Eテスト (Large) | Playwright | `*.large.spec.ts` |
| アクセシビリティテスト | Playwright + axe-core | `*.a11y.spec.ts` |

詳細は `docs/development/testing.md` を参照。

## 重要なルール

### 命名規則

| 禁止 | 推奨 | 理由 |
| ---- | ---- | ---- |
| `utils/` | `lib/`, `shared/`, `infra/` | 曖昧な名前は責務が不明確になる |

### ディレクトリ構造

| 層 | ソースルート | 理由 |
| -- | ------------ | ---- |
| アプリケーション層 (`apps/*`) | `app/` | FSD構造に従う |
| パッケージ層 (`packages/*`) | `src/` | 一般的な慣習に従う |

### インポートルール

- FSDのインポートルールに従う（上位→下位のみ）
- パスエイリアス `~` を使用（例: `~/shared/*`, `~/features/*`）

## 開発ワークフロー

### 機能追加時

1. ユーザーストーリーを作成
2. シーケンス図を作成
3. API仕様を作成
4. テストコードを作成（Red）
5. 実装（Green）
6. リファクタリング
7. コードレビュー

### バグ修正時

1. バグを再現するテストを追加
2. バグを修正
3. 既存テストが通ることを確認
4. コードレビュー

### リファクタリング時

1. 既存テストが通ることを確認
2. リファクタリングを実施
3. テストを更新（必要に応じて）
4. ドキュメントを更新（必要に応じて）

## コード品質チェック

### 必須チェック

```bash
bun run fmt:check   # フォーマット
bun run lint        # リント
bun run typecheck   # 型チェック
bun run test        # テスト
```

### カバレッジ目標

| 対象 | 目標 |
| ---- | ---- |
| 全体 | 80%以上 |
| 新規コード | 90%以上 |

## 参考資料

| リソース | URL |
| -------- | --- |
| Feature-Sliced Design | https://feature-sliced.design/ |
| Domain-Driven Design | https://www.domainlanguage.com/ddd/ |
| Turborepo | https://turbo.build/repo/docs |
| Bun | https://bun.sh/docs |
