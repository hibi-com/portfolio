---
title: "GET /api/crm/customers - 顧客一覧取得"
---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as API Server<br/>(Hono)
    participant Auth as 認証ミドルウェア
    participant Container as DIContainer
    participant UseCase as GetCustomersUseCase
    participant Repository as CustomerRepository
    participant DB as D1 Database

    Client->>API: GET /api/crm/customers
    API->>Auth: authenticate()
    alt 未認証の場合
        Auth-->>API: null
        API-->>Client: 401 { error: "Unauthorized" }
    else 認証済みの場合
        Auth-->>API: { userId: string }
        API->>Container: DIContainer作成(DB)
        Container->>UseCase: getGetCustomersUseCase()
        API->>UseCase: execute()
        UseCase->>Repository: findAll()
        Repository->>DB: SELECT * FROM customers
        DB-->>Repository: customers[]
        Repository-->>UseCase: Customer[]
        UseCase-->>API: Customer[]
        alt customersが空の場合
            API-->>Client: 200 []
        else エラーが発生した場合
            API-->>Client: 500 { error: "Failed to fetch customers" }
        else 正常な場合
            API-->>Client: 200 Customer[]
        end
    end
```
