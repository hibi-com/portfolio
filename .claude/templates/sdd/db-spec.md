# DB仕様書テンプレート

## IMPORTANT: このテンプレートに従って一貫した形式でDB仕様書を作成すること

## ファイル配置規則

```text
docs/specs/db/{domain}.md
```

## 対応するPrismaスキーマ

```text
packages/db/prisma/schema/{domain}.prisma
```

## テンプレート本体

```markdown
# {Domain} DB仕様

## 概要

{ドメインのデータモデルの目的を1-2文で説明}

## ER図

\`\`\`mermaid
erDiagram
    {Table1} ||--o{ {Table2} : "{relation}"
    {Table1} {
        string id PK
        string name
        datetime createdAt
        datetime updatedAt
    }
    {Table2} {
        string id PK
        string table1Id FK
        string field
        datetime createdAt
        datetime updatedAt
    }
\`\`\`

## テーブル定義

### {TableName}

{テーブルの目的を1文で説明}

#### カラム

| カラム名 | 型 | NULL | デフォルト | 説明 |
| -------- | -- | ---- | ---------- | ---- |
| id | String | No | cuid() | 主キー |
| {name} | {Type} | {Yes/No} | {default} | {説明} |
| createdAt | DateTime | No | now() | 作成日時 |
| updatedAt | DateTime | No | @updatedAt | 更新日時 |

#### インデックス

| 名前 | カラム | 種類 | 用途 |
| ---- | ------ | ---- | ---- |
| {table}_pkey | id | PRIMARY | 主キー |
| {table}_{column}_idx | {column} | INDEX | {検索用途} |
| {table}_{col1}_{col2}_idx | {col1}, {col2} | COMPOSITE | {複合検索用途} |
| {table}_{column}_key | {column} | UNIQUE | {一意制約用途} |

#### リレーション

| 関連テーブル | 関係 | 外部キー | 説明 |
| ------------ | ---- | -------- | ---- |
| {RelatedTable} | {1:N / N:1 / N:N} | {fkColumn} | {説明} |

#### Prisma定義

\`\`\`prisma
model {TableName} {
    id        String   @id @default(cuid())
    {field}   {Type}   {modifiers}
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    // Relations
    {relation} {RelatedModel}? @relation(fields: [{fk}], references: [id])

    // Indexes
    @@index([{column}])
    @@map("{table_name}")
}
\`\`\`

## 制約

### ビジネスルール

| ルール | 説明 | 実装 |
| ------ | ---- | ---- |
| {rule1} | {説明} | {CHECK/TRIGGER/APP} |

### データ整合性

| 制約 | カラム | 説明 |
| ---- | ------ | ---- |
| NOT NULL | {columns} | 必須フィールド |
| UNIQUE | {columns} | 一意制約 |
| FOREIGN KEY | {columns} | 外部キー制約 |
| CHECK | {columns} | 値の範囲制約 |

## マイグレーション履歴

| 日付 | マイグレーション名 | 内容 |
| ---- | ------------------ | ---- |
| {date} | {name} | {変更内容} |

## クエリパターン

### よく使うクエリ

#### {Pattern1}: {説明}

\`\`\`typescript
// Prisma
const result = await prisma.{table}.findMany({
    where: { {condition} },
    include: { {relations} },
    orderBy: { {column}: '{order}' },
});
\`\`\`

## パフォーマンス考慮

### インデックス戦略

| クエリパターン | 使用インデックス | 備考 |
| -------------- | ---------------- | ---- |
| {pattern} | {index} | {備考} |

### N+1問題の回避

\`\`\`typescript
// NG: N+1問題
const items = await prisma.{table}.findMany();
for (const item of items) {
    const related = await prisma.{related}.findMany({ where: { {fk}: item.id } });
}

// OK: includeで一括取得
const items = await prisma.{table}.findMany({
    include: { {relation}: true }
});
\`\`\`

## 関連

- API仕様: [`docs/specs/api/{domain}.md`](./api/{domain}.md)
- Prismaスキーマ: `packages/db/prisma/schema/{domain}.prisma`
- Repository: `apps/api/src/infrastructure/repositories/{domain}/`
```

## 作成手順チェックリスト

1. [ ] 概要が明確に記述されている
2. [ ] ER図が作成されている
3. [ ] 全テーブルのカラム定義がある
4. [ ] インデックス定義がある
5. [ ] リレーション定義がある
6. [ ] Prisma定義が含まれている
7. [ ] 制約が文書化されている
8. [ ] クエリパターンが含まれている
9. [ ] API仕様へのリンクがある
