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

```bash
# ステータス確認
cd packages/db && bun prisma migrate status

# 開発用マイグレーション
cd packages/db && bun prisma migrate dev --name {migration-name}

# 本番適用
cd packages/db && bun prisma migrate deploy

# DBリセット（開発用）
cd packages/db && bun prisma migrate reset

# 型生成のみ
bun run db:generate

# バリデーション
cd packages/db && bun prisma validate
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

## 参考ドキュメント

Prismaスキーマ設計、マイグレーション戦略の詳細については以下を参照：

- [データベース](docs/development/database.md) - Prisma設定、マイグレーションワークフロー、D1/TiDB対応
