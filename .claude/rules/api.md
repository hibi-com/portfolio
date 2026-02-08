---
files: ["apps/api/**/*"]
---

# API (Hono + DDD) ルール

## 依存関係（内側から外側へ）

```text
Domain → UseCase → Infrastructure → Interface
```

- Domain層を変更するとき → 他層への依存を作らない
- UseCase層を変更するとき → Domain層のみ参照可
- Infrastructure層を変更するとき → Domain, UseCase参照可

## トリガー＆アクション

| トリガー | アクション |
| -------- | ---------- |
| 新規エンドポイント追加 | 1. `docs/sequence/api/` にシーケンス図作成 → 2. UseCase → Repository → Handler の順で実装 |
| Repository実装 | DIコンテナ経由で注入（`di/container.ts`）、直接newしない |
| エラーを返すとき | `AppError` を使用: `throw new AppError("NOT_FOUND", "...", 404)` |
| 統合テスト追加 | `tests/medium/{domain}/` に `*.medium.test.ts` で作成 |

## ディレクトリ構造

| パス | 役割 |
| ---- | ---- |
| `src/domain/` | エンティティ、値オブジェクト |
| `src/usecase/` | ユースケース |
| `src/infra/` | リポジトリ実装、外部サービス |
| `src/interface/rest/` | REST APIハンドラー |
| `src/di/` | DIコンテナ |
