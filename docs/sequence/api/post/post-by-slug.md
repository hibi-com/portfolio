---
title: "GET /api/post/:slug - 投稿詳細取得"
---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as API Server<br/>(Hono)
    participant Container as DIContainer
    participant UseCase as GetPostBySlugUseCase
    participant Repository as PostRepository
    participant DB as D1 Database

    Client->>API: GET /api/post/:slug
    API->>API: リクエスト受信<br/>slugパラメータ取得
    alt slugが無効な場合
        API-->>Client: 400 { error: "Invalid slug" }
    else DBが利用できない場合
        API-->>Client: 500 { error: "Database not available" }
    else 正常な場合
        API->>Container: DIContainer作成(DB)
        Container->>UseCase: getGetPostBySlugUseCase()
        API->>UseCase: execute(slug)
        UseCase->>Repository: findBySlug(slug)
        Repository->>DB: SELECT * FROM posts WHERE slug = ?
        DB-->>Repository: post | null
        Repository-->>UseCase: Post | null
        UseCase-->>API: Post | null
        alt postが見つからない場合
            API-->>Client: 404 { error: "Post not found" }
        else エラーが発生した場合
            API-->>Client: 500 { error: "Failed to fetch post" }
        else 正常な場合
            API-->>Client: 200 Post
        end
    end
```
