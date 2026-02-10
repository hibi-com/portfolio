# Portfolio Project

> Turborepo + Bun + Cloudflare で構築されたフルスタックポートフォリオサイト

## IMPORTANT: 最優先ルール

1. **実装前に仕様を確認** → `docs/sequence/`, `docs/specs/`, `docs/user-stories/` を読む
2. **不明点はユーザーに確認** → 推測で実装しない
3. **日本語でコミュニケーション** → 報告・計画・ドキュメントすべて日本語

## 頻出コマンド

```bash
bun install          # 依存関係インストール
bun run dev          # 開発サーバー起動
bun run test         # ユニットテスト
bun run lint         # リント
bun run e2e          # E2Eテスト
```

## アーキテクチャ

| パス | 技術スタック |
| ---- | ------------ |
| apps/api | Hono + DDD |
| apps/web | Remix + FSD |
| apps/admin | TanStack Router + FSD |
| packages/ | 共通パッケージ（db, api, auth, ui, validation） |

詳細 → `docs/architecture/`

## プロジェクト固有の罠（トリガー＆アクション）

### DB操作

- `schema.prisma` を変更するとき → `packages/db/prisma/schema/*.prisma` を編集して `bun run db:generate` を実行

### API実装

- 新しいAPIエンドポイントを追加するとき → `docs/sequence/api/` にシーケンス図を先に作成
- UseCaseを実装するとき → DIコンテナ経由でRepositoryを注入（直接newしない）

### フロントエンド

- Cloudflare環境で環境変数を使うとき → `process.env` ではなく `import.meta.env` を使用
- コンポーネントを作成するとき → FSD構造に従い `features/`, `entities/`, `shared/` に配置

### テスト

- 新機能を実装するとき → テストを先に書く（TDD: Red → Green → Refactor）
- Medium Testを書くとき → 対応するシーケンス図のパスを `@sequence` JSDocで記載

### Git

- コミットするとき → Conventional Commits形式（`feat:`, `fix:`, `docs:`, `refactor:`）
- PRを作成するとき → 全テスト通過を確認してから作成

## 禁止事項

- `vim`, `nano`, `emacs` → シェルがフリーズする
- `less`, `more` → `cat` を使用
- `rm -rf /`, `git push --force` → 破壊的操作
- 認証情報のハードコード → 環境変数を使用

## 作業ログ

作業完了時 → `.claude/log/YYYY-MM-DD-task-name.md` に記録
