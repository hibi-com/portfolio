# Local database (libSQL / sqld)

本番は Cloudflare D1。ローカル Docker では同じ Prisma スキーマを **libSQL サーバー（sqld）** で提供します。

## 構成

| 項目 | 内容 |
| ---- | ---- |
| イメージ | `ghcr.io/tursodatabase/libsql-server` |
| サービス名 | `sqlite` |
| コンテナ内 URL | `http://sqlite:8080` |
| ホスト URL | `http://127.0.0.1:8081` |
| DB ファイル | volume `portfolio_sqlite_data` → `/var/lib/sqld/portfolio.db` |
| マイグレーション | `packages/db/migration/**/migration.sql`（`setup-db` が適用） |
| シード | `.docker/db/sql/*.sql` |

`file:./dev.db` は使いません。アプリ・Prisma は HTTP 経由で sqld に接続します。

## 使い方

```bash
# DB のみ
docker compose up setup-db sqlite

# API ごと（sqlite healthy 待ち）
docker compose up api
```

ホストからの Prisma / ローカル開発:

```bash
export DATABASE_URL=http://127.0.0.1:8081
bun --cwd packages/db run studio
```

## シードの再適用

```bash
docker compose down
docker volume rm portfolio_sqlite_data
docker compose up setup-db sqlite
```
