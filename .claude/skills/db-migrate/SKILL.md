---
name: db-migrate
description: Prismaマイグレーションを実行します。スキーマ変更の適用やマイグレーション作成に使用。
argument-hint: "[dev|deploy|status|reset] [--name migration-name]"
allowed-tools: Bash, Read, Glob, Grep
---

# DB Migrate Skill

Prismaマイグレーションを実行します。

## 使用方法

```text
/db-migrate                          # ステータス確認
/db-migrate dev --name add-user      # 開発用マイグレーション作成
/db-migrate deploy                   # 本番適用
/db-migrate reset                    # DB初期化（開発用）
```

## 実行コマンド

### ステータス確認

```bash
cd packages/db && bun prisma migrate status
```

### 開発用マイグレーション

```bash
cd packages/db && bun prisma migrate dev --name {migration-name}
```

### 本番適用

```bash
cd packages/db && bun prisma migrate deploy
```

### DBリセット（開発用）

```bash
cd packages/db && bun prisma migrate reset
```

### 型生成のみ

```bash
bun run db:generate
```

## Prismaスキーマ構成

```text
packages/db/prisma/schema/
├── schema.prisma      # メイン（datasource, generator）
├── post.prisma        # Post
├── portfolio.prisma   # Portfolio
├── crm.prisma         # CRM
├── chat.prisma        # Chat
├── email.prisma       # Email
├── inquiry.prisma     # Inquiry
└── integration.prisma # 外部連携
```

## マイグレーションワークフロー

### 新規テーブル追加

1. スキーマファイル作成・編集
2. `/db-migrate dev --name create-table-name`
3. `bun run db:generate`
4. DB仕様書更新（`docs/specs/db/`）

### カラム追加

1. スキーマファイル編集
2. `/db-migrate dev --name add-column-name`
3. `bun run db:generate`

### カラム削除（危険）

1. 既存データのバックアップ確認
2. スキーマファイル編集
3. `/db-migrate dev --name remove-column-name`
4. `bun run db:generate`

## 危険な操作

以下は事前確認必須：

| 操作 | リスク | 確認コマンド |
| ---- | ------ | ------------ |
| カラム削除 | データ消失 | `SELECT COUNT(*) FROM table WHERE column IS NOT NULL` |
| 型変更 | 変換エラー | 既存データの互換性確認 |
| テーブル削除 | データ消失 | 依存関係確認 |
| reset | 全データ消失 | 開発環境のみ |

## Cloudflare D1対応

D1マイグレーション用コマンド：

```bash
# マイグレーションリスト
wrangler d1 migrations list {database-name}

# マイグレーション適用
wrangler d1 migrations apply {database-name}
```

## トラブルシューティング

| エラー | 原因 | 対処 |
| ------ | ---- | ---- |
| Migration failed | スキーマエラー | prisma validate 実行 |
| Drift detected | 手動変更あり | migrate reset または手動修正 |
| P3009 | マイグレーション競合 | 履歴を確認・解決 |

## バリデーション

```bash
cd packages/db && bun prisma validate
```
