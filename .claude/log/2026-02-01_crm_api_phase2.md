# CRM API実装 (Phase 2)

## 作業日時
2026-02-01

## 解釈した仕様

### 目的
CRMシステムのAPI層（Domain, Infra, Usecase, Interface）を実装する。

### 実装対象
1. **Customer API**: 顧客のCRUD操作
2. **Lead API**: リードのCRUD操作 + 商談への変換
3. **Pipeline API**: パイプラインとステージのCRUD操作
4. **Deal API**: 商談のCRUD操作 + ステージ移動

## 変更したファイル

### Domain層（インターフェース定義）
| ファイル | 説明 |
|---------|------|
| `apps/api/src/domain/customer.ts` | Customer, CustomerRepository インターフェース |
| `apps/api/src/domain/lead.ts` | Lead, LeadRepository インターフェース |
| `apps/api/src/domain/pipeline.ts` | Pipeline, PipelineStage, PipelineRepository インターフェース |
| `apps/api/src/domain/deal.ts` | Deal, DealRepository インターフェース |

### Infra層（Repository実装）
| ファイル | 説明 |
|---------|------|
| `apps/api/src/infra/customer.repository.ts` | CustomerRepositoryImpl |
| `apps/api/src/infra/lead.repository.ts` | LeadRepositoryImpl |
| `apps/api/src/infra/pipeline.repository.ts` | PipelineRepositoryImpl |
| `apps/api/src/infra/deal.repository.ts` | DealRepositoryImpl |

### Usecase層
| ディレクトリ | UseCase |
|-------------|---------|
| `apps/api/src/usecase/customer/` | GetCustomers, GetCustomerById, CreateCustomer, UpdateCustomer, DeleteCustomer |
| `apps/api/src/usecase/lead/` | GetLeads, GetLeadById, CreateLead, UpdateLead, DeleteLead, ConvertLeadToDeal |
| `apps/api/src/usecase/pipeline/` | GetPipelines, GetPipelineById, CreatePipeline, UpdatePipeline, DeletePipeline |
| `apps/api/src/usecase/deal/` | GetDeals, GetDealById, CreateDeal, UpdateDeal, DeleteDeal, MoveDealToStage |

### Interface層（REST API）
| ファイル | 説明 |
|---------|------|
| `apps/api/src/interface/rest/crm.ts` | CRM REST ハンドラー |
| `apps/api/src/interface/rest/index.ts` | ルーター設定追加 |

### DI層
| ファイル | 説明 |
|---------|------|
| `apps/api/src/di/container.ts` | CRM Repository/UseCase を追加 |

## API エンドポイント

### Customer
| Method | Path | 説明 |
|--------|------|------|
| GET | /api/crm/customers | 顧客一覧取得 |
| GET | /api/crm/customers/:id | 顧客詳細取得 |
| POST | /api/crm/customers | 顧客作成 |
| PUT | /api/crm/customers/:id | 顧客更新 |
| DELETE | /api/crm/customers/:id | 顧客削除 |

### Lead
| Method | Path | 説明 |
|--------|------|------|
| GET | /api/crm/leads | リード一覧取得 |
| GET | /api/crm/leads/:id | リード詳細取得 |
| POST | /api/crm/leads | リード作成 |
| PUT | /api/crm/leads/:id | リード更新 |
| DELETE | /api/crm/leads/:id | リード削除 |
| POST | /api/crm/leads/:id/convert | リード→商談変換 |

### Deal
| Method | Path | 説明 |
|--------|------|------|
| GET | /api/crm/deals | 商談一覧取得 |
| GET | /api/crm/deals/:id | 商談詳細取得 |
| POST | /api/crm/deals | 商談作成 |
| PUT | /api/crm/deals/:id | 商談更新 |
| DELETE | /api/crm/deals/:id | 商談削除 |
| PUT | /api/crm/deals/:id/stage | ステージ移動 |

### Pipeline
| Method | Path | 説明 |
|--------|------|------|
| GET | /api/crm/pipelines | パイプライン一覧取得 |
| GET | /api/crm/pipelines/:id | パイプライン詳細取得 |
| POST | /api/crm/pipelines | パイプライン作成 |
| PUT | /api/crm/pipelines/:id | パイプライン更新 |
| DELETE | /api/crm/pipelines/:id | パイプライン削除 |

## 検証した結果

1. **TypeScriptコンパイル**: エラーなし
2. **Prisma Client型**: Customer, Lead, Deal, Pipeline等の型が正しく生成

## 残っている課題

### 未実装
1. **Phase 3: Support API** - Inquiry, InquiryResponse
2. **Phase 4: Email** - Resend統合
3. **Phase 5: Chat** - Durable Objects/WebSocket
4. **Phase 6: freee連携** - OAuth, 同期
5. **Admin UI** - CRM/サポート画面

### 技術的な課題
- テスト環境（vitest + miniflare）がハングする問題
- Biome設定のネスト問題

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────┐
│                    Interface Layer                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │  REST Handlers (crm.ts)                          │   │
│  │  - getCustomers, createCustomer, ...            │   │
│  │  - getLeads, createLead, convertLeadToDeal, ... │   │
│  │  - getDeals, createDeal, moveDealToStage, ...   │   │
│  │  - getPipelines, createPipeline, ...            │   │
│  └─────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    Usecase Layer                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Customer: Get, GetById, Create, Update, Delete │   │
│  │  Lead: Get, GetById, Create, Update, Delete,    │   │
│  │        ConvertToDeal                            │   │
│  │  Deal: Get, GetById, Create, Update, Delete,    │   │
│  │        MoveToStage                              │   │
│  │  Pipeline: Get, GetById, Create, Update, Delete │   │
│  └─────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    Domain Layer                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Interfaces: CustomerRepository, LeadRepository, │   │
│  │              DealRepository, PipelineRepository  │   │
│  │  Types: Customer, Lead, Deal, Pipeline,          │   │
│  │         PipelineStage, *Input, *Status           │   │
│  └─────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    Infra Layer                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  CustomerRepositoryImpl (Prisma)                 │   │
│  │  LeadRepositoryImpl (Prisma)                     │   │
│  │  DealRepositoryImpl (Prisma)                     │   │
│  │  PipelineRepositoryImpl (Prisma)                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```
