# Local database (libSQL / sqld)

本番は Cloudflare D1。ローカル Docker では同じ Prisma スキーマを **libSQL サーバー（sqld）** で提供します。

## 構成

| 項目 | 内容 |
| ---- | ---- |
| イメージ | `ghcr.io/tursodatabase/libsql-server` |
| サービス名 | `sqlite` |
| コンテナ内 URL | `http://sqlite:8080` |
| ホスト URL | `http://127.0.0.1:8081` |
| データ | volume `portfolio_sqlite_data`（sqld 管理） |
| マイグレーション / シード | `setup-db` が HTTP 経由で適用 |

`file:./dev.db` は使いません。アプリ・Prisma は HTTP 経由で sqld に接続します。

## 使い方

```bash
docker compose up sqlite setup-db
# または
docker compose up api
```

ホストからの Prisma / ローカル開発:

```bash
export DATABASE_URL=http://127.0.0.1:8081
bun --cwd packages/db run studio
```

## シードの再適用

```bash
docker compose down -v
docker compose up sqlite setup-db
```
