# Portfolio Project

個人ポートフォリオサイト。ブログ、ポートフォリオ、CRM機能を持つフルスタックアプリケーション。

## IMPORTANT: 最優先ルール

1. **実装前に仕様を確認** → `docs/sequence/`, `docs/specs/`, `docs/user-stories/` を読む
2. **不明点はユーザーに確認** → 推測で実装しない
3. **日本語でコミュニケーション** → 報告・計画・ドキュメントすべて日本語

## WHAT: プロジェクト構造

```text
apps/
├── api/      # Hono + DDD - REST APIサーバー（Cloudflare Workers）
├── web/      # Remix + FSD - 公開サイト（Cloudflare Pages）
└── admin/    # TanStack Router + FSD - 管理画面（Cloudflare Pages）

packages/
├── db/         # Prisma - データベーススキーマ・クライアント
├── api/        # Hono RPC - 型安全APIクライアント
├── validation/ # Zod - バリデーションスキーマ
├── auth/       # 認証ユーティリティ
└── ui/         # shadcn/ui - 共通UIコンポーネント

docs/
├── sequence/   # シーケンス図 - 実装フローの可視化
├── specs/      # API・DB仕様書
└── user-stories/ # ユーザーストーリー
```

## WHY: 設計思想

- **Monorepo（Turborepo）**: パッケージ間の型共有、一括ビルド・テスト
- **DDD（API）**: ドメイン知識の集約、依存関係の明確化
- **FSD（Frontend）**: 機能単位のモジュール化、レイヤー間依存の制御
- **Cloudflare**: エッジでの高速配信、D1/KVによるデータ管理

## HOW: 変更の検証

変更が正しいか確認するコマンド:

```bash
bun run fmt:check    # ① フォーマット - スタイル違反がないこと
bun run lint         # ② リント - スタイル違反がないこと
bun run typecheck    # ③ 型チェック - 型エラーがないこと
bun run test         # ④ ユニットテスト - 全テスト通過
bun run build        # ⑤ ビルド - 本番ビルドが成功すること
```

すべてのコマンドが成功 = 変更OK

## 開発コマンド

```bash
bun install          # 依存関係インストール
bun run dev          # 開発サーバー起動（全アプリ）
bun run db:generate  # Prisma型生成
bun run e2e          # E2Eテスト（Playwright）
```

## 重要な規約

| 状況 | 行動 |
| ---- | ---- |
| 実装前 | `docs/sequence/`, `docs/specs/` を確認 |
| 不明点 | 推測せずユーザーに質問 |
| コミット | Conventional Commits形式 |

詳細 → `.claude/rules/`

## 禁止

- `vim`, `nano`, `less`, `more` → シェルがフリーズ
- `rm -rf /`, `git push --force` → 破壊的操作
- 認証情報のハードコード

## 作業ログ

作業完了時 → `.claude/log/YYYY-MM-DD-task-name.md` に記録
