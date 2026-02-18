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

ルートの package.json の script を優先する。マイグレーションは @portfolio/db のコンテキストで実行する。

```bash
# 型生成のみ（ルートの generate で @portfolio/db を指定）
bun run generate --filter=@portfolio/db

# ステータス確認（db パッケージで prisma を実行）
bun --cwd packages/db x prisma migrate status

# 開発用マイグレーション（新規作成・適用。-- で引数を渡す場合は migrate dev の前に指定）
bun --cwd packages/db x prisma migrate dev --name {migration-name}

# 本番適用
bun --cwd packages/db x prisma migrate deploy

# DBリセット（開発用）
bun --cwd packages/db x prisma migrate reset

# バリデーション
bun --cwd packages/db x prisma validate
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
