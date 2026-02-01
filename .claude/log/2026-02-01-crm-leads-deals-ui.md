# CRM リード・商談管理 UI 実装ログ

## 日付
2026-02-01

## 実装内容

### 1. リード管理機能

**useLeads フック (`lib/useLeads.ts`):**
- リード一覧取得
- リード作成
- リード更新
- リード削除
- リード→商談変換

**LeadsList コンポーネント (`ui/LeadsList.tsx`):**
- テーブル形式でのリード一覧表示
- ステータス別カラーバッジ (NEW, CONTACTED, QUALIFIED, UNQUALIFIED, CONVERTED)
- 削除・編集・変換アクション
- 新規リード作成リンク

**Lead ステータス:**
- NEW: 新規リード
- CONTACTED: コンタクト済み
- QUALIFIED: 見込みあり
- UNQUALIFIED: 見込みなし
- CONVERTED: 商談化済み

### 2. 商談管理機能

**useDeals フック (`lib/useDeals.ts`):**
- 商談一覧取得
- パイプライン一覧取得
- 商談作成
- 商談更新
- 商談削除
- ステージ移動

**DealsKanban コンポーネント (`ui/DealsKanban.tsx`):**
- カンバンボード形式での商談管理
- パイプラインステージごとのカラム表示
- ステージごとの合計金額表示
- 商談カードでの概要表示
- 削除・編集アクション

**Deal ステータス:**
- OPEN: 進行中
- WON: 成約
- LOST: 失注
- ABANDONED: 破棄

### 3. ルートファイル

- `crm.leads.tsx`: リード一覧ページ
- `crm.deals.tsx`: 商談カンバンページ

## ファイル構造

```
apps/admin/app/features/crm/
├── index.ts (更新: 新規エクスポート追加)
├── lib/
│   ├── useCustomers.ts
│   ├── useDeals.ts (新規)
│   └── useLeads.ts (新規)
└── ui/
    ├── CustomerForm.tsx
    ├── CustomersList.tsx
    ├── DealsKanban.tsx (新規)
    └── LeadsList.tsx (新規)

apps/admin/app/routes/
├── crm.tsx
├── crm.customers.tsx
├── crm.customers.new.tsx
├── crm.deals.tsx (新規)
└── crm.leads.tsx (新規)
```

## 型定義 (crm-api.ts)

```typescript
// リード
export interface Lead {
    id: string;
    customerId?: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    status: "NEW" | "CONTACTED" | "QUALIFIED" | "UNQUALIFIED" | "CONVERTED";
    score?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// 商談
export interface Deal {
    id: string;
    customerId?: string;
    leadId?: string;
    pipelineId: string;
    stageId: string;
    name: string;
    value?: number;
    currency?: string;
    status: "OPEN" | "WON" | "LOST" | "ABANDONED";
    probability?: number;
    expectedCloseDate?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// パイプライン
export interface Pipeline {
    id: string;
    name: string;
    description?: string;
    isDefault: boolean;
    stages: PipelineStage[];
    createdAt: string;
    updatedAt: string;
}
```

## 検証状況

- [x] コンポーネント作成
- [x] フック実装
- [x] ルートファイル作成
- [ ] TanStack Router ルートツリー再生成待ち
- [ ] E2E テスト

## 残課題

1. リード作成/編集フォーム (LeadForm.tsx)
2. 商談作成/編集フォーム (DealForm.tsx)
3. ドラッグ&ドロップでのステージ移動
4. パイプライン管理画面
5. 顧客詳細からのリード・商談一覧表示
