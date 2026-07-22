# 2026-07-23 packages/db MySQL → SQLite(D1) 移行

## 概要

`packages/db` の Prisma provider を MySQL/TiDB から SQLite（Cloudflare D1）へ移行した。

## 変更内容

- Prisma schema: `provider = "sqlite"`、`@db.Text` / `@db.Decimal` / prefix index を除去
- クライアント: `mysql.ts` → `d1.ts`（`@prisma/adapter-d1` + `@prisma/adapter-libsql`）
- 依存関係: `@prisma/adapter-mariadb` 削除、D1/libsql 系を追加
- `packages/auth`: Better Auth provider を `sqlite` に変更、`d1` を `createPrismaClient` に渡す
- マイグレーション: 旧 MySQL migration 削除、SQLite 初期 migration と README を追加

## 残作業

- `bun install` 後に `bun run generate` で Prisma Client 再生成
- 必要に応じて `prisma migrate diff` で migration SQL を再生成して checksum を揃える
