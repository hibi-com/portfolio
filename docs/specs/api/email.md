---
title: "Email API 仕様"
---

メール送信システムのAPI仕様書です。Resend APIを使用したメール配信機能を提供します。

## 概要

Email APIは以下の機能を提供します:

- **EmailLog**: 送信ログの管理
- **EmailTemplate**: メールテンプレートの管理
- **Send**: メール送信

## 認証

すべてのEmail APIエンドポイントは認証が必要です。

## エンドポイント一覧

| Method | Path | 説明 |
|--------|------|------|
| GET | `/api/email/logs` | 送信ログ一覧取得 |
| GET | `/api/email/logs/:id` | 送信ログ詳細取得 |
| GET | `/api/email/templates` | テンプレート一覧取得 |
| POST | `/api/email/templates` | テンプレート作成 |
| PUT | `/api/email/templates/:id` | テンプレート更新 |
| DELETE | `/api/email/templates/:id` | テンプレート削除 |
| POST | `/api/email/send` | メール送信 |
| POST | `/api/email/send-with-template` | テンプレート使用メール送信 |

## データモデル

### EmailLog

```typescript
interface EmailLog {
    id: string;
    customerId?: string;
    to: string;
    from: string;
    subject: string;
    body: string;
    status: "PENDING" | "SENT" | "DELIVERED" | "BOUNCED" | "FAILED";
    externalId?: string;
    errorMessage?: string;
    sentAt?: string;
    createdAt: string;
}
```

### EmailTemplate

```typescript
interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    category: "MARKETING" | "TRANSACTIONAL" | "SUPPORT" | "NOTIFICATION";
    variables?: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
```

## 関連シーケンス図

- [メール送信](../sequence/api/email/email-send.md)
