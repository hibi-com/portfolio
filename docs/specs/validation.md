# バリデーション仕様

## 概要

このプロジェクトでは **Zod** を使用してスキーマベースのバリデーションを実装しています。

## バリデーションパッケージ

### パッケージ構成

```text
packages/validation/
├── src/
│   ├── index.ts           # エクスポート
│   ├── lib/
│   │   └── validation.ts  # バリデーションユーティリティ
│   ├── shared.ts          # 共通スキーマ
│   ├── post.ts            # ブログ投稿スキーマ
│   ├── portfolio.ts       # ポートフォリオスキーマ
│   └── graphql.ts         # GraphQLスキーマ
└── tests/
    └── *.test.ts          # テストファイル
```

## コアバリデーション関数

### ValidationResult インターフェース

```typescript
interface ValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: ZodError;
}
```

### validate()

安全なバリデーション。エラーをスローせずに結果オブジェクトを返す。

```typescript
import { validate, postSchema } from "@portfolio/validation";

const result = validate(postSchema, data);
if (result.success) {
    // result.data を使用
} else {
    // result.errors を処理
}
```

### validateOrThrow()

バリデーション失敗時にZodErrorをスローする。

```typescript
import { validateOrThrow, postSchema } from "@portfolio/validation";

try {
    const data = validateOrThrow(postSchema, input);
} catch (error) {
    if (error instanceof ZodError) {
        // バリデーションエラー処理
    }
}
```

## スキーマ定義

### 共通スキーマ（shared.ts）

| スキーマ名 | 説明 | 検証内容 |
| ---------- | ---- | -------- |
| `urlSchema` | URL形式 | URLコンストラクタで検証 |
| `assetSchema` | アセット | URLプロパティを持つオブジェクト |
| `tagSchema` | タグ | 空でない名前文字列 |
| `enumValueSchema` | 列挙値 | 名前を持つ値 |
| `typeInfoSchema` | 型情報 | オプションで列挙値を持つ |

```typescript
// urlSchema
const urlSchema = z.string().refine(
    (val) => {
        try {
            new URL(val);
            return true;
        } catch {
            return false;
        }
    },
    { message: "Invalid URL format" }
);

// assetSchema
const assetSchema = z.object({
    url: urlSchema,
});

// tagSchema
const tagSchema = z.object({
    name: z.string().min(1),
});
```

### ブログ投稿スキーマ（post.ts）

| スキーマ名 | 説明 |
| ---------- | ---- |
| `postSchema` | 完全なブログ投稿 |
| `postContentSchema` | HTMLコンテンツ |
| `blogDataSchema` | ブログデータコレクション |

```typescript
const postSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    slug: z.string().min(1),
    date: z.string(), // ISO 8601形式
    description: z.string().optional(),
    content: postContentSchema,
    images: z.array(assetSchema).optional(),
    tags: z.array(tagSchema).optional(),
    sticky: z.boolean().optional(),
});

const postContentSchema = z.object({
    html: z.string(),
    raw: z.unknown().optional(),
});

const blogDataSchema = z.object({
    posts: z.array(postSchema),
    featured: z.array(postSchema).optional(),
});
```

### ポートフォリオスキーマ（portfolio.ts）

| スキーマ名 | 説明 |
| ---------- | ---- |
| `portfolioSchema` | ポートフォリオプロジェクト |
| `portfolioContentSchema` | HTMLコンテンツ |

```typescript
const portfolioSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    slug: z.string().min(1),
    company: z.string().optional(),
    date: z.string(),
    current: z.boolean().optional(),
    overview: z.string().optional(),
    description: portfolioContentSchema.optional(),
    images: z.array(assetSchema).optional(),
});
```

### GraphQLスキーマ（graphql.ts）

| スキーマ名 | 説明 |
| ---------- | ---- |
| `graphQLRequestSchema` | GraphQLリクエスト |
| `graphQLResponseSchema` | GraphQLレスポンス |
| `graphQLErrorSchema` | GraphQLエラー |
| `errorResponseSchema` | 汎用エラーレスポンス |

```typescript
const graphQLRequestSchema = z.object({
    query: z.string(),
    variables: z.record(z.unknown()).optional(),
});

const graphQLErrorSchema = z.object({
    message: z.string(),
    locations: z.array(z.object({
        line: z.number(),
        column: z.number(),
    })).optional(),
    path: z.array(z.union([z.string(), z.number()])).optional(),
});

const graphQLResponseSchema = z.object({
    data: z.unknown().optional(),
    errors: z.array(graphQLErrorSchema).optional(),
});
```

## APIバリデーション関数

### apps/api/src/lib/validation.ts

| 関数名 | 説明 | 戻り値 |
| ------ | ---- | ------ |
| `isValidSlug(slug)` | スラッグ形式を検証 | boolean |
| `isValidUuid(id)` | UUID v4形式を検証 | boolean |
| `isValidImageContentType(type)` | 画像Content-Typeを検証 | boolean |
| `isValidImageExtension(ext)` | 画像拡張子を検証 | boolean |
| `validateImageMagicBytes(buffer)` | マジックバイトで画像種別を判定 | string \| null |
| `sanitizeFilename(name)` | ファイル名をサニタイズ | string |
| `getFileExtension(name)` | 拡張子を取得 | string |

### スラッグ検証

```typescript
function isValidSlug(slug: string): boolean {
    // 英数字、ハイフン、アンダースコアのみ許可
    return /^[a-zA-Z0-9_-]+$/.test(slug);
}
```

### UUID検証

```typescript
function isValidUuid(id: string): boolean {
    // UUID v4形式
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}
```

### 画像検証

#### 許可されるContent-Type

- `image/jpeg`
- `image/png`
- `image/gif`
- `image/webp`

#### 許可される拡張子

- `.jpg`, `.jpeg`
- `.png`
- `.gif`
- `.webp`

#### マジックバイト検出

| 形式 | マジックバイト |
| ---- | -------------- |
| JPEG | `FF D8 FF` |
| PNG | `89 50 4E 47 0D 0A 1A 0A` |
| GIF | `47 49 46 38` |
| WebP | `52 49 46 46 ... 57 45 42 50` |

## バリデーションパターン

### APIルートでのバリデーション

```typescript
// apps/api/src/interface/rest/crm.ts
import { AppError, ErrorCodes } from "@portfolio/log";
import { isValidUuid } from "../../lib/validation";

app.get("/customers/:id", async (c) => {
    const id = c.req.param("id");

    // 事前バリデーション
    if (!id || !isValidUuid(id)) {
        const error = AppError.fromCode(
            ErrorCodes.VALIDATION_MISSING_FIELD,
            "Invalid customer ID format",
            { metadata: { field: "id", receivedValue: id } }
        );
        return c.json(error.toJSON(), error.httpStatus);
    }

    // ... 処理続行
});
```

### UseCaseでのバリデーション

```typescript
// apps/api/src/application/usecases/portfolio/uploadImage.ts
import { AppError, ErrorCodes } from "@portfolio/log";
import { isValidImageContentType } from "../../../lib/validation";

async execute(portfolioId: string, imageFile: File) {
    if (!imageFile.type.startsWith("image/")) {
        throw AppError.fromCode(
            ErrorCodes.VALIDATION_INVALID_TYPE,
            "File must be an image",
            { metadata: { contentType: imageFile.type } }
        );
    }

    if (!isValidImageContentType(imageFile.type)) {
        throw AppError.fromCode(
            ErrorCodes.VALIDATION_INVALID_FORMAT,
            "Unsupported image format",
            { metadata: { contentType: imageFile.type } }
        );
    }

    // ... 処理続行
}
```

### フロントエンドでのバリデーション

```typescript
// apps/web/app/shared/lib/validation.ts
import { z } from "zod";

export const contactFormSchema = z.object({
    name: z.string().min(1, "名前は必須です"),
    email: z.string().email("有効なメールアドレスを入力してください"),
    message: z.string().min(10, "メッセージは10文字以上入力してください"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

## テスト

### バリデーションテストの例

```typescript
// packages/validation/tests/post.test.ts
import { describe, expect, test } from "vitest";
import { validate, postSchema } from "../src";

describe("postSchema", () => {
    test("正常系: 有効な投稿データ", () => {
        const data = {
            id: "1",
            title: "Test Post",
            slug: "test-post",
            date: "2024-01-01",
            content: { html: "<p>Content</p>" },
        };

        const result = validate(postSchema, data);
        expect(result.success).toBe(true);
    });

    test("異常系: タイトルが空", () => {
        const data = {
            id: "1",
            title: "",
            slug: "test-post",
            date: "2024-01-01",
            content: { html: "<p>Content</p>" },
        };

        const result = validate(postSchema, data);
        expect(result.success).toBe(false);
    });
});
```

## 関連ドキュメント

- [エラーコード仕様](./error-codes.md)
- [API仕様](./api/)
- [テスト戦略](../development/testing.md)
