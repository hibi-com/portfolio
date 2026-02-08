---
files: ["apps/web/**/*"]
---

# Web (Remix + FSD) ルール

## レイヤー依存関係

```text
routes → widgets → features → entities → shared
```

- 下位レイヤーから上位レイヤーをインポートしない

## トリガー＆アクション

| トリガー | アクション |
| -------- | ---------- |
| 新規ページ追加 | 1. `docs/user-stories/` にストーリー作成 → 2. `docs/sequence/web/` にシーケンス図作成 → 3. ルート実装 |
| コンポーネント作成 | FSD構造に従い配置: `features/`, `entities/`, `shared/` |
| データ取得 | `loader` でサーバーサイドフェッチ、`@portfolio/api` クライアント使用 |
| 環境変数使用 | `process.env` ではなく `import.meta.env` を使用（Cloudflare対応） |
| E2Eテスト追加 | `e2e/large/` に `*.large.spec.ts` で作成 |

## ディレクトリ

| パス | 役割 |
| ---- | ---- |
| `app/routes/` | Remixルート |
| `app/features/` | 機能単位モジュール |
| `app/entities/` | ビジネスエンティティ |
| `app/shared/` | 共通ユーティリティ |
