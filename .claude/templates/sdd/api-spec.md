# API仕様書テンプレート

## IMPORTANT: このテンプレートに従って一貫した形式でAPI仕様書を作成すること

## ファイル配置規則

```text
docs/specs/api/{domain}.md
```

## 命名規則

| 要素 | 規則 | 例 |
| ---- | ---- | -- |
| ファイル名 | ケバブケース、ドメイン名 | `post.md`, `crm.md`, `inquiry.md` |

## テンプレート本体

```markdown
# {Domain} API

## 概要

{ドメインの目的と主要機能を1-3文で説明}

## ベースURL

\`\`\`
/api/{base-path}
\`\`\`

## 認証

{認証方式の説明}

- **方式**: {Bearer Token|Session|API Key|None}
- **ヘッダー**: `Authorization: Bearer {token}`

## エンドポイント一覧

| メソッド | パス | 説明 | 認証 | シーケンス図 |
| -------- | ---- | ---- | ---- | ------------ |
| GET | `/{path}` | {説明} | {Yes|No} | [{name}](../sequence/api/{domain}/{name}.md) |
| POST | `/{path}` | {説明} | {Yes|No} | [{name}](../sequence/api/{domain}/{name}.md) |
| PUT | `/{path}/:id` | {説明} | {Yes|No} | [{name}](../sequence/api/{domain}/{name}.md) |
| DELETE | `/{path}/:id` | {説明} | {Yes|No} | [{name}](../sequence/api/{domain}/{name}.md) |

## エンドポイント詳細

### GET /{path}

{エンドポイントの説明}

#### リクエスト

**クエリパラメータ**

| 名前 | 型 | 必須 | デフォルト | 説明 |
| ---- | -- | ---- | ---------- | ---- |
| page | number | No | 1 | ページ番号 |
| limit | number | No | 20 | 取得件数 |
| sort | string | No | createdAt | ソートフィールド |
| order | string | No | desc | ソート順序 |

#### レスポンス

**成功 (200)**

\`\`\`json
{
    "data": [],
    "meta": {
        "total": 100,
        "page": 1,
        "limit": 20,
        "totalPages": 5
    }
}
\`\`\`

### POST /{path}

{エンドポイントの説明}

#### リクエスト

**ボディ**

\`\`\`typescript
interface CreateRequest {
    name: string;       // 必須: 名前
    description?: string; // 任意: 説明
}
\`\`\`

#### レスポンス

**成功 (201)**

\`\`\`json
{
    "data": {
        "id": "xxx",
        "name": "xxx",
        "createdAt": "2025-01-01T00:00:00Z"
    }
}
\`\`\`

### PUT /{path}/:id

{エンドポイントの説明}

#### リクエスト

**パスパラメータ**

| 名前 | 型 | 説明 |
| ---- | -- | ---- |
| id | string | リソースID |

**ボディ**

\`\`\`typescript
interface UpdateRequest {
    name?: string;
    description?: string;
}
\`\`\`

#### レスポンス

**成功 (200)**

\`\`\`json
{
    "data": {
        "id": "xxx",
        "name": "updated",
        "updatedAt": "2025-01-01T00:00:00Z"
    }
}
\`\`\`

### DELETE /{path}/:id

{エンドポイントの説明}

#### リクエスト

**パスパラメータ**

| 名前 | 型 | 説明 |
| ---- | -- | ---- |
| id | string | リソースID |

#### レスポンス

**成功 (204)**

No Content

## 共通エラーレスポンス

\`\`\`typescript
interface ErrorResponse {
    error: {
        code: string;      // エラーコード
        message: string;   // エラーメッセージ
        details?: object;  // 詳細情報
    };
}
\`\`\`

| ステータス | コード | 説明 |
| ---------- | ------ | ---- |
| 400 | VALIDATION_ERROR | バリデーションエラー |
| 401 | UNAUTHORIZED | 認証が必要 |
| 403 | FORBIDDEN | アクセス権限がない |
| 404 | NOT_FOUND | リソースが見つからない |
| 409 | CONFLICT | リソースの競合 |
| 500 | INTERNAL_ERROR | サーバー内部エラー |

## 型定義

### {Entity}

\`\`\`typescript
interface {Entity} {
    id: string;
    // フィールド定義
    createdAt: Date;
    updatedAt: Date;
}
\`\`\`

## 関連

- DB仕様: [`docs/specs/db/{domain}.md`](./db/{domain}.md)
- シーケンス図: [`docs/sequence/api/{domain}/`](../sequence/api/{domain}/)
- バリデーション: `packages/validation/src/{domain}.ts`
```

## 作成手順チェックリスト

1. [ ] 概要が明確に記述されている
2. [ ] 全エンドポイントが一覧に含まれている
3. [ ] 各エンドポイントの詳細が記述されている
4. [ ] リクエスト/レスポンスの型が定義されている
5. [ ] エラーレスポンスが網羅されている
6. [ ] シーケンス図へのリンクがある
7. [ ] DB仕様へのリンクがある
