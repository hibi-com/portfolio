---
title: "GET /blog/:slug - ブログ詳細ページ"
---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Browser as ブラウザ
    participant Remix as Remix Server<br/>(Cloudflare Pages)
    participant Loader as blog_.$slug.tsx loader<br/>(api.blog.$slug.ts)
    participant Validation as slugSchema
    participant APIClient as API Client<br/>(@portfolio/api)
    participant API as API Server<br/>(Hono)
    participant Container as DIContainer
    participant UseCase as GetPostBySlugUseCase
    participant Repository as PostRepository
    participant DB as D1 Database

    Browser->>Remix: GET /blog/:slug
    Remix->>Loader: loader実行(params.slug)
    Loader->>Validation: slugSchema.safeParse(slug)
    alt slugが無効な場合
        Validation-->>Loader: { success: false }
        Loader-->>Remix: 400 Response
        Remix-->>Browser: 400 Error Page
    else 正常な場合
        Validation-->>Loader: { success: true, data: slug }
        Loader->>Loader: API URL取得<br/>(VITE_API_URL)
        Loader->>APIClient: createApiClient(apiUrl)
        Loader->>APIClient: api.posts.getPostBySlug(slug)
        APIClient->>API: GET /api/post/:slug
        API->>Container: DIContainer作成(DB)
        Container->>UseCase: getGetPostBySlugUseCase()
        API->>UseCase: execute(slug)
        UseCase->>Repository: findBySlug(slug)
        Repository->>DB: SELECT * FROM posts WHERE slug = ?
        DB-->>Repository: post | null
        Repository-->>UseCase: Post | null
        UseCase-->>API: Post | null
        alt postが見つからない場合
            API-->>APIClient: 404 Error
            APIClient-->>Loader: Error
            Loader-->>Remix: 404 Response
            Remix-->>Browser: 404 Error Page
        else 正常な場合
            API-->>APIClient: 200 Post
            APIClient-->>Loader: response.data
            Loader-->>Remix: Post
            Remix->>Remix: コンポーネントレンダリング<br/>(Wysiwyg表示)
            Remix-->>Browser: HTML (Blog詳細ページ)
        end
    end
```
