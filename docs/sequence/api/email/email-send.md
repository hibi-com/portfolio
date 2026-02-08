---
title: "POST /api/email/send - メール送信"
---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as API Server<br/>(Hono)
    participant Auth as 認証ミドルウェア
    participant Validation as バリデーション
    participant Container as DIContainer
    participant UseCase as SendEmailUseCase
    participant Service as EmailService<br/>(Resend)
    participant Repository as EmailRepository
    participant DB as D1 Database
    participant Resend as Resend API

    Client->>API: POST /api/email/send
    API->>Auth: authenticate()
    alt 未認証の場合
        Auth-->>API: null
        API-->>Client: 401 { error: "Unauthorized" }
    else 認証済みの場合
        Auth-->>API: { userId: string }
        API->>Validation: validateSendEmailInput(body)
        alt バリデーションエラーの場合
            Validation-->>API: errors[]
            API-->>Client: 400 { error: "Validation failed" }
        else バリデーション成功の場合
            Validation-->>API: validatedInput
            API->>Container: DIContainer作成(DB)
            Container->>UseCase: getSendEmailUseCase()
            API->>UseCase: execute(input)
            UseCase->>Service: send(emailData)
            Service->>Resend: POST /emails
            Resend-->>Service: { id: string }
            Service->>Repository: createLog(logData)
            Repository->>DB: INSERT INTO email_logs
            DB-->>Repository: emailLog
            Repository-->>Service: EmailLog
            Service-->>UseCase: EmailLog
            UseCase-->>API: EmailLog
            API-->>Client: 200 EmailLog
        end
    end
```

## エンドポイント仕様

### リクエスト

- **Method**: POST
- **Path**: `/api/email/send`
- **認証**: 必要

### リクエストボディ

```typescript
interface SendEmailInput {
    to: string;             // 宛先メールアドレス
    subject: string;        // 件名
    body: string;           // 本文（HTML可）
    customerId?: string;    // 顧客ID（ログ用）
    from?: string;          // 送信元（オプション）
}
```

### レスポンス

| ステータス | 説明 | ボディ |
|-----------|------|--------|
| 200 | 送信成功 | `EmailLog` |
| 400 | バリデーションエラー | `{ error: "Validation failed" }` |
| 401 | 未認証 | `{ error: "Unauthorized" }` |
| 500 | 送信失敗 | `{ error: "Failed to send email" }` |
