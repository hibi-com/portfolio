# @portfolio/prisma-migration

Prisma スキーマを基準に、`packages/db/migration` へタイムスタンプ付きの増分 SQL を出力する CLI ツールです。

## 使い方

- **packages/db から実行**（推奨）: `cd packages/db && bun run migrate`
- **ルートから実行**: `bunx @portfolio/prisma-migration --db-dir packages/db`

## オプション

| オプション | 説明 |
|------------|------|
| `--db-dir <path>` | DB パッケージのルート（デフォルト: `process.cwd()`） |
| `--no-generate` | 実行前に `bun run generate` を実行しない |

## 動作

1. **初回**（`migration/` 配下に既存マイグレーションがない）  
   `prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema --script` でフルスキーマの SQL を 1 ファイルに出力します。shadow データベースは不要です。

2. **2 回目以降**（既存マイグレーションあり）  
   `prisma migrate diff --from-migrations ./migration --to-schema-datamodel ./prisma/schema --script` で差分のみ出力します。**このときは shadow データベースが必須**です。

## Shadow データベース（増分生成時）

増分生成時（`migration/` に既存ファイルがあるとき）は、Prisma の仕様で **shadow データベース** が必要です。

- **環境変数**: `SHADOW_DATABASE_URL` を設定する。
- **未設定時**: `DATABASE_URL` から DB 名に `_shadow` を付けた URL を自動派生します（例: `.../portfolio` → `.../portfolio_shadow`）。  
  利用する DB が shadow 用の作成を許可している場合のみ有効です。

未設定かつ派生もできない場合は、次のメッセージで終了します。

```
増分生成時は SHADOW_DATABASE_URL を設定するか、DATABASE_URL から派生できるようにしてください。
```

## 出力形式

- 出力先: `packages/db/migration/<YYYYMMDDHHmmss>_migration/migration.sql`
- 各 SQL の先頭に `USE portfolio;` を付与します。

## .docker/db/sql との関係

マイグレーション SQL は **packages/db/migration** のみに出力します。Docker で同じ SQL を使う場合は、別スクリプトや手順で `.docker/db/sql/` へコピーしてください。
