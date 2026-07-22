---
title: "データベース管理"
---

このドキュメントでは、プロジェクトのデータベース管理方針とPrismaを使った開発ワークフローを説明します。

## データベース構成

| 項目 | 内容 |
| ---- | ---- |
| **データベース** | Cloudflare D1（本番） / libSQL sqld（ローカル Docker） |
| **互換性** | SQLite |
| **ORM** | Prisma 7.x |
| **接続方法** | `@prisma/adapter-d1`（Workers） / `@prisma/adapter-libsql`（ローカル `http://127.0.0.1:8081`） |

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
bun --cwd packages/db x prisma migrate
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

**注意**:

- 新規マイグレーションは事前に `migrate` で作成しておく必要がある
- ロールバックは自動化されていないため、慎重に実行

## トラブルシューティング

### マイグレーションの状態がおかしい

```bash
# マイグレーション履歴を確認
bun --cwd packages/db x prisma migrate status
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

1. ローカル: libSQL（`http://127.0.0.1:8081`）が起動しているか確認（`docker compose up sqlite`）
2. 本番: Cloudflare D1 バインディング（`DB`）と `wrangler.toml` の database_id / name が一致しているか確認
3. マイグレーション適用済みか確認（ローカルは `setup-db`、本番は `wrangler d1 migrations apply`）

## DB仕様書との対応

- **DB仕様書**: `docs/specs/db/` - テーブル設計・リレーション
- **実装**: `packages/db/prisma/schema/` - Prismaスキーマ

DB仕様書とPrismaスキーマは1:1で対応しています。変更時は両方を更新してください。

## 関連ドキュメント

- [DB仕様書](../specs/db/) - テーブル設計
- [Prismaドキュメント](https://www.prisma.io/docs/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [ローカル Docker DB](../../.docker/db/README.md)
- [インフラ仕様書](../specs/infra/overview.md) - データベース要件
