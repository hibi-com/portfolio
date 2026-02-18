---
title: "データベース管理"
---

このドキュメントでは、プロジェクトのデータベース管理方針とPrismaを使った開発ワークフローを説明します。

## データベース構成

| 項目 | 内容 |
| ---- | ---- |
| **データベース** | TiDB Cloud Serverless |
| **リージョン** | AWS ap-northeast-1（東京） |
| **互換性** | MySQL 8.0互換 |
| **ORM** | Prisma 7.x |
| **接続方法** | `@prisma/adapter-mariadb` |

## Prismaスキーマ構成

スキーマはドメイン別に分割管理されています：

```text
packages/db/prisma/schema/
├── schema.prisma       # メイン設定（datasource, generator）
├── auth.prisma         # 認証・認可
├── user.prisma         # ユーザー
├── post.prisma         # ブログ投稿
├── portfolio.prisma    # ポートフォリオ
├── crm.prisma          # CRM（顧客管理）
├── chat.prisma         # チャット
├── email.prisma        # メール
├── inquiry.prisma      # 問い合わせ
└── integration.prisma  # 外部連携
```

## マイグレーションコマンド

### 基本コマンド

```bash
# ステータス確認
bun --cwd packages/db x prisma migrate status

# 開発用マイグレーション（新規作成・適用）
bun --cwd packages/db x prisma migrate dev --name {migration-name}

# 本番適用
bun --cwd packages/db x prisma migrate deploy

# DBリセット（開発用のみ）
bun --cwd packages/db x prisma migrate reset

# スキーマバリデーション
bun --cwd packages/db x prisma validate
```

### 型生成

```bash
# Prisma Clientの型生成
bun run generate --filter=@portfolio/db
```

### Prisma Studio（GUIツール）

```bash
# Prisma Studioを起動
bun --cwd packages/db run studio
```

## 開発ワークフロー

### 1. スキーマ変更

1. `packages/db/prisma/schema/` の該当ファイルを編集
2. スキーマをバリデーション

```bash
bun --cwd packages/db x prisma validate
```

### 2. マイグレーション作成

```bash
# マイグレーションファイルを生成してDBに適用
bun --cwd packages/db x prisma migrate dev --name add-user-role
```

これにより以下が実行されます：

- マイグレーションファイル生成（`packages/db/prisma/migrations/`）
- DBへの適用
- Prisma Client型の再生成

### 3. 型生成の確認

```bash
# 生成された型を確認
bun run typecheck --filter=@portfolio/db
```

### 4. コミット

```bash
# マイグレーションファイルとスキーマをコミット
git add packages/db/prisma/schema/ packages/db/prisma/migrations/
git commit -m "feat(db): ユーザーロール機能を追加"
```

## 本番環境へのデプロイ

### CI/CDでのマイグレーション適用

```bash
# 本番DBにマイグレーション適用
bun --cwd packages/db x prisma migrate deploy
```

**注意**:

- `migrate deploy` は既存のマイグレーションファイルのみを適用
- 新規マイグレーションは事前に `migrate dev` で作成しておく必要がある
- ロールバックは自動化されていないため、慎重に実行

## トラブルシューティング

### マイグレーションの状態がおかしい

```bash
# マイグレーション履歴を確認
bun --cwd packages/db x prisma migrate status

# 開発環境でリセット（データ削除）
bun --cwd packages/db x prisma migrate reset
```

### 型生成が反映されない

```bash
# Prisma Clientを再生成
bun run generate --filter=@portfolio/db

# キャッシュクリア
bun --cwd packages/db run clean:cache
bun run generate --filter=@portfolio/db
```

### 接続エラーが発生する

1. 環境変数 `DATABASE_URL` が正しく設定されているか確認
2. TiDB Cloudのクラスターが起動しているか確認
3. IPホワイトリストに開発環境が登録されているか確認

## DB仕様書との対応

- **DB仕様書**: `docs/specs/db/` - テーブル設計・リレーション
- **実装**: `packages/db/prisma/schema/` - Prismaスキーマ

DB仕様書とPrismaスキーマは1:1で対応しています。変更時は両方を更新してください。

## 関連ドキュメント

- [DB仕様書](../specs/db/) - テーブル設計
- [Prismaドキュメント](https://www.prisma.io/docs/)
- [TiDB Cloud](https://docs.pingcap.com/tidbcloud/)
- [インフラ仕様書](../specs/infra/overview.md) - データベース要件

## スキル

データベース操作は以下のスキルを使用：

- `/db-migrate` - マイグレーション実行
