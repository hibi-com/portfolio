---
files: ["apps/admin/**/*"]
---

# Admin (TanStack Router + FSD) ルール

## レイヤー依存関係

```text
routes → widgets → features → entities → shared
```

## トリガー＆アクション

| トリガー | アクション |
| -------- | ---------- |
| 新規ページ追加 | 1. `docs/sequence/admin/` にシーケンス図作成 → 2. TanStack Routerでルート実装 |
| ルート作成 | `createFileRoute` を使用 |
| サーバー状態管理 | TanStack Query のカスタムフック（`usePosts`, `useCustomers` 等） |
| クライアント状態管理 | Zustand を使用 |
| API呼び出し | `@portfolio/api` クライアント経由 |
| 統合テスト追加 | `integration/` に `*.integration.test.tsx` で作成 |

## ディレクトリ

| パス | 役割 |
| ---- | ---- |
| `app/routes/` | TanStack Routerルート |
| `app/features/` | 機能単位モジュール |
| `app/entities/` | ビジネスエンティティ |
| `app/shared/` | 共通ユーティリティ |
