---
title: "GET /portfolio - ポートフォリオ一覧ページ"
---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Browser as ブラウザ
    participant Remix as Remix Server<br/>(Cloudflare Pages)
    participant Loader as portfolio.tsx loader<br/>(api.portfolio.ts)
    participant APIClient as API Client<br/>(@portfolio/api)
    participant API as API Server<br/>(Hono)
    participant Container as DIContainer
    participant UseCase as GetPortfoliosUseCase
    participant Repository as PortfolioRepository
    participant DB as D1 Database

    Browser->>Remix: GET /portfolio
    Remix->>Loader: loader実行
    Loader->>Loader: API URL取得<br/>(VITE_API_URL)
    Loader->>APIClient: createApiClient(apiUrl)
    Loader->>APIClient: api.portfolios.listPortfolios()
    APIClient->>API: GET /api/portfolios
    API->>Container: DIContainer作成(DB)
    Container->>UseCase: getGetPortfoliosUseCase()
    API->>UseCase: execute()
    UseCase->>Repository: findAll()
    Repository->>DB: SELECT * FROM portfolios
    DB-->>Repository: portfolios[]
    Repository-->>UseCase: Portfolio[]
    UseCase-->>API: Portfolio[]
    API-->>APIClient: 200 Portfolio[]
    APIClient-->>Loader: response.data
    alt portfoliosが空の場合
        Loader-->>Remix: 404 Response
        Remix-->>Browser: 404 Error Page
    else 正常な場合
        Loader-->>Remix: Portfolio[]
        Remix->>Remix: コンポーネントレンダリング
        Remix-->>Browser: HTML (Portfolio一覧ページ)
    end
```
