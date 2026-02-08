---
title: "GET /api/portfolio - API経由でポートフォリオ一覧取得"
---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Client as クライアント<br/>(API経由)
    participant Remix as Remix Server<br/>(Cloudflare Pages)
    participant Loader as api+/portfolio.ts loader
    participant APIClient as API Client<br/>(@portfolio/api)
    participant API as API Server<br/>(Hono)
    participant Container as DIContainer
    participant UseCase as GetPortfoliosUseCase
    participant Repository as PortfolioRepository
    participant DB as D1 Database

    Client->>Remix: GET /api/portfolio
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
        Remix-->>Client: 404 JSON
    else 正常な場合
        Loader-->>Remix: Portfolio[]
        Remix-->>Client: 200 JSON Portfolio[]
    end
```
