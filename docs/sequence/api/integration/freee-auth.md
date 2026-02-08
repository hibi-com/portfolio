---
title: "GET /api/freee/auth - Freee OAuth認証URL取得"
---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as API Server<br/>(Hono)
    participant Auth as 認証ミドルウェア
    participant Container as DIContainer
    participant UseCase as GetFreeeAuthUrlUseCase
    participant OAuthService as FreeeOAuthService

    Client->>API: GET /api/freee/auth
    API->>Auth: authenticate()
    alt 未認証の場合
        Auth-->>API: null
        API-->>Client: 401 { error: "Unauthorized" }
    else 認証済みの場合
        Auth-->>API: { userId: string }
        API->>Container: DIContainer作成
        Container->>UseCase: getGetFreeeAuthUrlUseCase()
        API->>UseCase: execute(redirectUri)
        UseCase->>OAuthService: getAuthorizationUrl(redirectUri)
        OAuthService-->>UseCase: authUrl
        UseCase-->>API: { authUrl: string }
        API-->>Client: 200 { authUrl: string }
    end
```

## エンドポイント仕様

### リクエスト

- **Method**: GET
- **Path**: `/api/freee/auth`
- **認証**: 必要

### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| redirectUri | string | YES | OAuth認証後のリダイレクト先 |

### レスポンス

| ステータス | 説明 | ボディ |
|-----------|------|--------|
| 200 | 成功 | `{ authUrl: string }` |
| 401 | 未認証 | `{ error: "Unauthorized" }` |

---

# POST /api/freee/callback - OAuth コールバック

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as API Server<br/>(Hono)
    participant Auth as 認証ミドルウェア
    participant Container as DIContainer
    participant UseCase as HandleFreeeCallbackUseCase
    participant OAuthService as FreeeOAuthService
    participant Repository as FreeeRepository
    participant Freee as Freee API
    participant DB as D1 Database

    Client->>API: POST /api/freee/callback
    API->>Auth: authenticate()
    alt 未認証の場合
        Auth-->>API: null
        API-->>Client: 401 { error: "Unauthorized" }
    else 認証済みの場合
        Auth-->>API: { userId: string }
        API->>Container: DIContainer作成(DB)
        Container->>UseCase: getHandleFreeeCallbackUseCase()
        API->>UseCase: execute(code, redirectUri)
        UseCase->>OAuthService: exchangeCodeForTokens(code, redirectUri)
        OAuthService->>Freee: POST /oauth/token
        Freee-->>OAuthService: tokens
        OAuthService-->>UseCase: { accessToken, refreshToken }
        UseCase->>OAuthService: getCompanyInfo(accessToken)
        OAuthService->>Freee: GET /api/1/users/me
        Freee-->>OAuthService: companyInfo
        OAuthService-->>UseCase: companyInfo
        UseCase->>Repository: createIntegration(integrationData)
        Repository->>DB: INSERT INTO freee_integrations
        DB-->>Repository: integration
        Repository-->>UseCase: FreeeIntegration
        UseCase-->>API: FreeeIntegration
        API-->>Client: 200 FreeeIntegration
    end
```

## ビジネスルール

1. 認証コードは一度のみ使用可能
2. トークンは暗号化して保存
3. 既存の連携がある場合は上書き更新
