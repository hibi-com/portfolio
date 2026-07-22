---
title: "GET /api/posts - 投稿一覧取得"
---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as API Server<br/>(Hono)
    participant Container as DIContainer
    participant UseCase as GetPostsUseCase
    participant Repository as PostRepository
    participant DB as D1 Database

    Client->>API: GET /api/posts
    API->>API: リクエスト受信
    API->>Container: DIContainer作成(DB)
    Container->>UseCase: getGetPostsUseCase()
    API->>UseCase: execute()
    UseCase->>Repository: findAll()
    Repository->>DB: SELECT * FROM posts
    DB-->>Repository: posts[]
    Repository-->>UseCase: Post[]
    UseCase-->>API: Post[]
    alt postsが空の場合
        API-->>Client: 404 { error: "Posts not found" }
    else エラーが発生した場合
        API-->>Client: 500 { error: "Failed to fetch posts" }
    else 正常な場合
        API-->>Client: 200 Post[]
    end
```
