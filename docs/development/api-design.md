---
title: "API設計ガイドライン"
---

このプロジェクトでは、TypeSpecで定義したOpenAPI仕様からOrvalでTypeScriptクライアントを生成し、HonoでREST APIエンドポイントを実装しています。

## アーキテクチャ概要

- **API仕様**: TypeSpecで定義し、OpenAPI仕様を生成
- **クライアント生成**: OrvalでOpenAPI仕様からTypeScriptクライアントを生成（axios使用）
- **バックエンド**: HonoでREST APIエンドポイント実装（BFFとして機能）

## REST APIエンドポイント

### Posts API

- `GET /api/posts` - 投稿一覧取得
- `GET /api/post/:slug` - 投稿詳細取得

### Portfolios API

- `GET /api/portfolios` - ポートフォリオ一覧取得
- `GET /api/portfolio/:slug` - ポートフォリオ詳細取得

## TypeSpecスキーマ定義

### エンドポイント定義

```typescript
// packages/api/src/schema/models/api.tsp
@route("/api")
namespace Posts {
    @get
    @route("/posts")
    @summary("Get all posts")
    op listPosts(): Post[];

    @get
    @route("/post/{slug}")
    @summary("Get a post by slug")
    op getPostBySlug(@path slug: string): Post | ErrorResponse;
}
```

### モデル定義

```typescript
// packages/api/src/schema/models/post.tsp
model Post {
    id: string;
    title: string;
    slug: string;
    date: string;
    description?: string;
    content: PostContent;
    imageTemp: string;
    tags: string[];
    sticky: boolean;
    intro?: string;
    createdAt?: string;
    updatedAt?: string;
    images?: Asset[];
}
```

## Orval設定

`packages/api/orval.config.ts` でOrvalの設定を定義しています。

```typescript
// packages/api/orval.config.ts
import type { Config } from "orval";

const config: Config = {
    api: {
        input: {
            target: "../../apps/wiki/reference/openapi.yaml",
        },
        output: {
            target: "./src/generated/api.ts",
            client: "axios",
            httpClient: "axios",
            mode: "tags-split",
            override: {
                mutator: {
                    path: "./src/generated/mutator.ts",
                    name: "customInstance",
                },
            },
        },
    },
};

export default config;
```

### クライアント生成

```bash
# TypeSpecからOpenAPI仕様を生成し、Orvalでクライアントを生成
cd packages/api
bun run generate
# orval.config.tsはpackages/apiディレクトリに配置されています
```

## Hono REST API実装

### エンドポイントハンドラー

```typescript
// apps/api/src/interface/rest/posts.ts
import type { Context } from "hono";
import { DIContainer } from "~/di/container";

export async function getPosts(c: Context) {
    const db = c.env.DB;
    if (!db) {
        return c.json({ error: "Database not available" }, 500);
    }

    try {
        const container = new DIContainer(db);
        const useCase = container.getGetPostsUseCase();
        const posts = await useCase.execute();

        if (!posts || posts.length === 0) {
            return c.json({ error: "Posts not found" }, 404);
        }

        return c.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return c.json(
            {
                error: "Failed to fetch posts",
                details: error instanceof Error ? error.message : String(error),
            },
            500,
        );
    }
}
```

### ルーター統合

```typescript
// apps/api/src/interface/rest/index.ts
import { Hono } from "hono";
import { getPortfolioBySlug, getPortfolios } from "./portfolios";
import { getPostBySlug, getPosts } from "./posts";

export const restRouter = new Hono();

restRouter.get("/posts", getPosts);
restRouter.get("/post/:slug", getPostBySlug);
restRouter.get("/portfolios", getPortfolios);
restRouter.get("/portfolio/:slug", getPortfolioBySlug);
```

## クライアント側の使用

### APIクライアントの作成

```typescript
// apps/web/app/shared/lib/api.ts
import { PostsApi, PortfoliosApi } from "@portfolio/api/generated/api";
import { customInstance } from "@portfolio/api/generated/mutator";

export const createApiClient = (apiUrl?: string) => {
    const baseURL = getBaseUrl(apiUrl);
    return {
        posts: new PostsApi(undefined, baseURL, customInstance as never),
        portfolios: new PortfoliosApi(undefined, baseURL, customInstance as never),
    };
};
```

### 使用例

```typescript
// apps/web/app/shared/api/blog.ts
import { createApiClient } from "~/shared/lib/api";

export const loader: LoaderFunction = async (args) => {
    const apiUrl = (args.context.cloudflare?.env as { VITE_API_URL?: string })?.VITE_API_URL;
    const api = createApiClient(apiUrl);

    const response = await api.posts.listPosts();
    const posts = response.data as Post[];

    return Response.json({ posts, tags });
};
```

## エラーハンドリング

### エラーレスポンス形式

```typescript
{
    error: string;
    details?: unknown;
}
```

### ステータスコード

- `200` - 成功
- `400` - バリデーションエラー（Invalid slugなど）
- `404` - リソース未検出
- `500` - サーバーエラー

### エラーハンドリングの実装

```typescript
export async function getPostBySlug(c: Context) {
    const slug = c.req.param("slug");
    if (!slug) {
        return c.json({ error: "Invalid slug" }, 400);
    }

    try {
        const post = await useCase.execute(slug);
        if (!post) {
            return c.json({ error: "Post not found" }, 404);
        }
        return c.json(post);
    } catch (error) {
        return c.json(
            {
                error: "Failed to fetch post",
                details: error instanceof Error ? error.message : String(error),
            },
            500,
        );
    }
}
```

## 入力バリデーション

### Zodスキーマの使用

クライアント側では、Orval生成クライアントが型安全性を提供します。サーバー側では、必要に応じてZodスキーマを使用してバリデーションを行います。

```typescript
// apps/web/app/shared/validation.ts
import { z } from "zod";

export const slugSchema = z.string().min(1).regex(/^[a-z0-9-]+$/);
```

## 型の共有

### 生成された型定義

Orvalで生成されたクライアントには、OpenAPI仕様から型定義が自動的に含まれます。

```typescript
// packages/api/src/generated/api.ts (自動生成)
export interface Post {
    id: string;
    title: string;
    slug: string;
    // ...
}
```

### 型の使用

```typescript
import type { Post } from "@portfolio/api/generated/api";

const response = await api.posts.listPosts();
const posts = response.data as Post[];
```

## ベストプラクティス

### 1. エラーメッセージの明確化

```typescript
// ✅ Good: 明確なエラーメッセージ
return c.json({ error: "Post not found" }, 404);

// ❌ Bad: 曖昧なエラーメッセージ
return c.json({ error: "Error" }, 404);
```

### 2. 適切なHTTPステータスコードの使用

```typescript
// リソースが見つからない場合
return c.json({ error: "Post not found" }, 404);

// バリデーションエラーの場合
return c.json({ error: "Invalid slug" }, 400);

// サーバーエラーの場合
return c.json({ error: "Internal server error" }, 500);
```

### 3. ログの記録

```typescript
try {
    const posts = await useCase.execute();
    return c.json(posts);
} catch (error) {
    console.error("Error fetching posts:", error);
    return c.json({ error: "Failed to fetch posts" }, 500);
}
```

## テスト

### E2Eテスト

```typescript
// apps/api/e2e/posts.spec.ts
test("should return posts list", async ({ request }) => {
    const response = await request.get(`${API_URL}/api/posts`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
});
```

### モック

```typescript
// testing/msw/src/handlers/rest.ts
export const restHandlers: HttpHandler[] = [
    http.get(`${API_URL}/api/posts`, () => {
        return HttpResponse.json(mockPosts);
    }),
];
```

## TypeSpec設定

`packages/api/tspconfig.yaml` にTypeSpecの設定が定義されています。

```yaml
emit:
- '@typespec/openapi3'

options:
    '@typespec/openapi3':
        output-file: '../../apps/wiki/reference/openapi.yaml'
```

### 使用方法

```bash
# TypeSpecスキーマからOpenAPI仕様を生成（api パッケージで実行）
bun --cwd packages/api x tsp compile .
```

## 参考資料

- [TypeSpec ドキュメント](https://typespec.io/)
- [Orval ドキュメント](https://orval.dev/)
- [Hono ドキュメント](https://hono.dev/)
- [OpenAPI 仕様](https://swagger.io/specification/)
