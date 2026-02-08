---
title: "POST /api/crm/leads/:id/convert - リードを商談に変換"
---

## Sequence Diagram

```mermaid
sequenceDiagram
    participant Client as クライアント
    participant API as API Server<br/>(Hono)
    participant Auth as 認証ミドルウェア
    participant Validation as バリデーション
    participant Container as DIContainer
    participant UseCase as ConvertLeadToDealUseCase
    participant LeadRepo as LeadRepository
    participant DealRepo as DealRepository
    participant DB as D1 Database

    Client->>API: POST /api/crm/leads/:id/convert
    API->>Auth: authenticate()
    alt 未認証の場合
        Auth-->>API: null
        API-->>Client: 401 { error: "Unauthorized" }
    else 認証済みの場合
        Auth-->>API: { userId: string }
        API->>Validation: validateConvertLeadInput(body)
        alt バリデーションエラーの場合
            Validation-->>API: errors[]
            API-->>Client: 400 { error: "Validation failed", details: errors }
        else バリデーション成功の場合
            Validation-->>API: validatedInput
            API->>Container: DIContainer作成(DB)
            Container->>UseCase: getConvertLeadToDealUseCase()
            API->>UseCase: execute(leadId, input)
            UseCase->>LeadRepo: findById(leadId)
            LeadRepo->>DB: SELECT * FROM leads WHERE id = ?
            DB-->>LeadRepo: lead | null
            alt リードが見つからない場合
                LeadRepo-->>UseCase: null
                UseCase-->>API: NotFoundError
                API-->>Client: 404 { error: "Lead not found" }
            else リードが既に変換済みの場合
                LeadRepo-->>UseCase: Lead (status: CONVERTED)
                UseCase-->>API: ConflictError
                API-->>Client: 409 { error: "Lead already converted" }
            else 正常な場合
                LeadRepo-->>UseCase: Lead
                UseCase->>LeadRepo: updateStatus(leadId, "CONVERTED")
                LeadRepo->>DB: UPDATE leads SET status = "CONVERTED"
                DB-->>LeadRepo: lead
                UseCase->>DealRepo: create(dealData)
                DealRepo->>DB: INSERT INTO deals
                DB-->>DealRepo: deal
                DealRepo-->>UseCase: Deal
                UseCase-->>API: { lead: Lead, deal: Deal }
                API-->>Client: 200 { lead: Lead, deal: Deal }
            end
        end
    end
```

## エンドポイント仕様

### リクエスト

- **Method**: POST
- **Path**: `/api/crm/leads/:id/convert`
- **認証**: 必要
- **Content-Type**: `application/json`

### パスパラメータ

| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | string | リードID |

### リクエストボディ

```typescript
interface ConvertLeadInput {
    stageId: string;           // 必須: 商談の初期ステージID
    dealName?: string;         // オプション: 商談名（デフォルト: リード名）
    value?: number;            // オプション: 商談金額
    expectedCloseDate?: string; // オプション: 予定クローズ日
}
```

### レスポンス

| ステータス | 説明 | ボディ |
|-----------|------|--------|
| 200 | 変換成功 | `{ lead: Lead, deal: Deal }` |
| 400 | バリデーションエラー | `{ error: "Validation failed", details: [] }` |
| 401 | 未認証 | `{ error: "Unauthorized" }` |
| 404 | リードが見つからない | `{ error: "Lead not found" }` |
| 409 | 既に変換済み | `{ error: "Lead already converted" }` |
| 500 | サーバーエラー | `{ error: "Failed to convert lead" }` |

## ビジネスルール

1. リードのステータスが `CONVERTED` の場合、再度変換できない
2. 変換時にリードのステータスを `CONVERTED` に更新
3. 変換時に `convertedAt` タイムスタンプを設定
4. 新しい商談はリードの `customerId` を継承
