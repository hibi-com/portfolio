---
title: "Inquiry (Support) API 仕様"
---

サポートチケット管理システムのAPI仕様書です。

## 概要

Inquiry APIは以下の機能を提供します:

- **Inquiry**: 問い合わせの管理
- **InquiryResponse**: 問い合わせ返信の管理
- **ステータス管理**: 問い合わせの状態遷移

## 認証

一部のエンドポイントは認証不要（顧客からの問い合わせ作成）です。

## エンドポイント一覧

| Method | Path | 説明 | 認証 |
|--------|------|------|------|
| GET | `/api/support/inquiries` | 問い合わせ一覧取得 | 必要 |
| POST | `/api/support/inquiries` | 問い合わせ作成 | 不要 |
| GET | `/api/support/inquiries/:id` | 問い合わせ詳細取得 | 必要 |
| PUT | `/api/support/inquiries/:id` | 問い合わせ更新 | 必要 |
| DELETE | `/api/support/inquiries/:id` | 問い合わせ削除 | 必要 |
| POST | `/api/support/inquiries/:id/resolve` | 問い合わせ解決 | 必要 |
| POST | `/api/support/inquiries/:id/close` | 問い合わせクローズ | 必要 |
| GET | `/api/support/inquiries/:id/responses` | 返信一覧取得 | 必要 |
| POST | `/api/support/inquiries/:id/responses` | 返信追加 | 必要 |

## データモデル

### Inquiry

```typescript
interface Inquiry {
    id: string;
    customerId?: string;
    assigneeId?: string;
    subject: string;
    content: string;
    status: InquiryStatus;
    priority: InquiryPriority;
    category: InquiryCategory;
    tags?: string[];
    source?: string;
    resolvedAt?: string;
    closedAt?: string;
    createdAt: string;
    updatedAt: string;
}

type InquiryStatus = "OPEN" | "IN_PROGRESS" | "WAITING_CUSTOMER" | "RESOLVED" | "CLOSED";
type InquiryPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type InquiryCategory = "GENERAL" | "TECHNICAL" | "BILLING" | "SALES" | "COMPLAINT" | "FEATURE_REQUEST" | "OTHER";
```

### InquiryResponse

```typescript
interface InquiryResponse {
    id: string;
    inquiryId: string;
    userId?: string;
    content: string;
    isInternal: boolean;
    attachments?: string[];
    createdAt: string;
}
```

## 状態遷移

```
OPEN → IN_PROGRESS → WAITING_CUSTOMER → RESOLVED → CLOSED
                   ↳ RESOLVED → CLOSED
```

## 関連シーケンス図

- [問い合わせ作成](../sequence/api/inquiry/inquiry-create.md)
- [問い合わせ返信](../sequence/api/inquiry/inquiry-response-add.md)
- [問い合わせクローズ](../sequence/api/inquiry/inquiry-close.md)
