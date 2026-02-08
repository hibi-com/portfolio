---
title: "CRM API 仕様"
---

顧客関係管理（CRM）システムのAPI仕様書です。顧客、リード、商談、パイプラインの管理機能を提供します。

## 概要

CRM APIは以下のドメインを管理します:

- **Customer（顧客）**: 顧客情報の管理
- **Lead（リード）**: 見込み客の管理
- **Deal（商談）**: 営業案件の管理
- **Pipeline（パイプライン）**: 営業プロセスの管理

## 認証

すべてのCRM APIエンドポイントは認証が必要です。

```text
Authorization: Bearer <token>
```

## エンドポイント一覧

### Customer（顧客）

| Method | Path | 説明 |
| ------ | ---- | ---- |
| GET | `/api/crm/customers` | 顧客一覧取得 |
| GET | `/api/crm/customers/:id` | 顧客詳細取得 |
| POST | `/api/crm/customers` | 顧客作成 |
| PUT | `/api/crm/customers/:id` | 顧客更新 |
| DELETE | `/api/crm/customers/:id` | 顧客削除 |

### Lead（リード）

| Method | Path | 説明 |
| ------ | ---- | ---- |
| GET | `/api/crm/leads` | リード一覧取得 |
| GET | `/api/crm/leads/:id` | リード詳細取得 |
| POST | `/api/crm/leads` | リード作成 |
| PUT | `/api/crm/leads/:id` | リード更新 |
| DELETE | `/api/crm/leads/:id` | リード削除 |
| POST | `/api/crm/leads/:id/convert` | リードを商談に変換 |

### Deal（商談）

| Method | Path | 説明 |
| ------ | ---- | ---- |
| GET | `/api/crm/deals` | 商談一覧取得 |
| GET | `/api/crm/deals/:id` | 商談詳細取得 |
| POST | `/api/crm/deals` | 商談作成 |
| PUT | `/api/crm/deals/:id` | 商談更新 |
| DELETE | `/api/crm/deals/:id` | 商談削除 |
| PUT | `/api/crm/deals/:id/stage` | 商談ステージ移動 |

### Pipeline（パイプライン）

| Method | Path | 説明 |
| ------ | ---- | ---- |
| GET | `/api/crm/pipelines` | パイプライン一覧取得 |
| GET | `/api/crm/pipelines/:id` | パイプライン詳細取得 |
| POST | `/api/crm/pipelines` | パイプライン作成 |
| PUT | `/api/crm/pipelines/:id` | パイプライン更新 |
| DELETE | `/api/crm/pipelines/:id` | パイプライン削除 |

---

## データモデル

### Customer

```typescript
interface Customer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    website?: string;
    address?: string;
    notes?: string;
    status: CustomerStatus;
    tags?: string[];
    customFields?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

type CustomerStatus = "ACTIVE" | "INACTIVE" | "PROSPECT" | "CHURNED";
```

### Lead

```typescript
interface Lead {
    id: string;
    customerId?: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    status: LeadStatus;
    score?: number;
    notes?: string;
    convertedAt?: string;
    createdAt: string;
    updatedAt: string;
}

type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "UNQUALIFIED" | "CONVERTED";
```

### Deal

```typescript
interface Deal {
    id: string;
    customerId?: string;
    leadId?: string;
    stageId: string;
    name: string;
    value?: number;
    currency: string;
    expectedCloseDate?: string;
    actualCloseDate?: string;
    status: DealStatus;
    notes?: string;
    lostReason?: string;
    createdAt: string;
    updatedAt: string;
}

type DealStatus = "OPEN" | "WON" | "LOST" | "STALLED";
```

### Pipeline

```typescript
interface Pipeline {
    id: string;
    name: string;
    description?: string;
    isDefault: boolean;
    stages: PipelineStage[];
    createdAt: string;
    updatedAt: string;
}

interface PipelineStage {
    id: string;
    pipelineId: string;
    name: string;
    order: number;
    probability?: number;
    color?: string;
    createdAt: string;
    updatedAt: string;
}
```

---

## リクエスト/レスポンス仕様

### POST /api/crm/customers - 顧客作成

**リクエスト:**

```json
{
    "name": "山田太郎",
    "email": "yamada@example.com",
    "phone": "03-1234-5678",
    "company": "株式会社Example",
    "status": "PROSPECT"
}
```

**レスポンス (201 Created):**

```json
{
    "id": "cust_123",
    "name": "山田太郎",
    "email": "yamada@example.com",
    "phone": "03-1234-5678",
    "company": "株式会社Example",
    "status": "PROSPECT",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/crm/leads/:id/convert - リード変換

**リクエスト:**

```json
{
    "stageId": "stage_123",
    "dealName": "新規案件",
    "value": 1000000,
    "expectedCloseDate": "2024-03-31"
}
```

**レスポンス (200 OK):**

```json
{
    "lead": {
        "id": "lead_123",
        "name": "山田太郎",
        "status": "CONVERTED",
        "convertedAt": "2024-01-15T00:00:00.000Z"
    },
    "deal": {
        "id": "deal_456",
        "name": "新規案件",
        "stageId": "stage_123",
        "value": 1000000,
        "status": "OPEN"
    }
}
```

### PUT /api/crm/deals/:id/stage - 商談ステージ移動

**リクエスト:**

```json
{
    "stageId": "stage_456"
}
```

**レスポンス (200 OK):**

```json
{
    "id": "deal_123",
    "name": "新規案件",
    "stageId": "stage_456",
    "status": "OPEN",
    "updatedAt": "2024-01-20T00:00:00.000Z"
}
```

---

## エラーハンドリング

### エラーレスポンス形式

```typescript
interface ErrorResponse {
    error: string;
    details?: Array<{
        field: string;
        message: string;
    }>;
}
```

### 共通エラーコード

| ステータス | 説明 |
| --------- | ---- |
| 400 | バリデーションエラー |
| 401 | 未認証 |
| 403 | 権限不足 |
| 404 | リソースが見つからない |
| 409 | コンフリクト（既に変換済み等） |
| 500 | サーバーエラー |

---

## 関連シーケンス図

- [顧客一覧取得](../sequence/api/crm/customers-list.md)
- [顧客作成](../sequence/api/crm/customer-create.md)
- [顧客更新](../sequence/api/crm/customer-update.md)
- [リード一覧取得](../sequence/api/crm/leads-list.md)
- [リード変換](../sequence/api/crm/lead-convert.md)
- [商談一覧取得](../sequence/api/crm/deals-list.md)
- [商談ステージ移動](../sequence/api/crm/deal-move-stage.md)
- [パイプライン一覧取得](../sequence/api/crm/pipelines-list.md)
