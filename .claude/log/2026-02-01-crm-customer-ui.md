# CRM 顧客管理 UI 実装ログ

## 日付
2026-02-01

## 実装内容

### 1. UI コンポーネント追加 (@portfolio/ui)

以下の shadcn/ui ベースのコンポーネントを packages/ui に追加:

- `Badge.tsx` - ステータス表示用バッジ
- `Table.tsx` - テーブル表示コンポーネント群
- `Input.tsx` - フォーム入力
- `Label.tsx` - フォームラベル
- `Textarea.tsx` - テキストエリア
- `Select.tsx` - セレクトボックス

### 2. CRM Feature 実装 (apps/admin)

**ディレクトリ構造:**
```
apps/admin/app/
├── entities/customer/
│   ├── index.ts
│   └── model/types.ts
├── features/crm/
│   ├── index.ts
│   ├── lib/useCustomers.ts
│   ├── model/types.ts
│   └── ui/
│       ├── CustomersList.tsx
│       └── CustomerForm.tsx
├── routes/
│   ├── crm.tsx (CRM ダッシュボード)
│   ├── crm.customers.tsx (顧客一覧)
│   └── crm.customers.new.tsx (新規顧客作成)
└── shared/lib/crm-api.ts (API クライアント)
```

### 3. 型定義

**Customer 型:**
```typescript
export type CustomerStatus = "ACTIVE" | "INACTIVE" | "PROSPECT" | "CHURNED";

export interface Customer {
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
```

### 4. API クライアント (crm-api.ts)

CRM API エンドポイントへの fetch ラッパーを実装:
- `crmApi.customers.list()` - 顧客一覧取得
- `crmApi.customers.getById(id)` - 顧客詳細取得
- `crmApi.customers.create(data)` - 顧客作成
- `crmApi.customers.update(id, data)` - 顧客更新
- `crmApi.customers.delete(id)` - 顧客削除

### 5. 依存関係追加

**packages/ui/package.json:**
- `@radix-ui/react-label`: 2.1.7
- `@radix-ui/react-select`: 2.2.5

## 検証状況

- [x] UI コンポーネントのビルド成功
- [x] TypeScript コンパイル (ルート定義エラー以外)
- [ ] TanStack Router ルートツリー再生成待ち (`vite dev` 実行時に自動生成)
- [ ] E2E テスト

## 残課題

1. **TanStack Router ルート生成**: `vite dev` または `vite build` を実行してルートツリーを再生成する必要あり
2. **顧客詳細ページ**: `crm.customers.$id.tsx` の実装
3. **顧客編集ページ**: `crm.customers.$id.edit.tsx` の実装
4. **リード管理 UI**: Task #29
5. **サポートチケット管理 UI**: Task #30

## 変更ファイル一覧

### 新規作成
- `packages/ui/src/components/Badge.tsx`
- `packages/ui/src/components/Table.tsx`
- `packages/ui/src/components/Input.tsx`
- `packages/ui/src/components/Label.tsx`
- `packages/ui/src/components/Textarea.tsx`
- `packages/ui/src/components/Select.tsx`
- `apps/admin/app/entities/customer/index.ts`
- `apps/admin/app/entities/customer/model/types.ts`
- `apps/admin/app/features/crm/index.ts`
- `apps/admin/app/features/crm/lib/useCustomers.ts`
- `apps/admin/app/features/crm/model/types.ts`
- `apps/admin/app/features/crm/ui/CustomersList.tsx`
- `apps/admin/app/features/crm/ui/CustomerForm.tsx`
- `apps/admin/app/routes/crm.tsx`
- `apps/admin/app/routes/crm.customers.tsx`
- `apps/admin/app/routes/crm.customers.new.tsx`
- `apps/admin/app/shared/lib/crm-api.ts`

### 更新
- `packages/ui/src/index.ts` - 新規コンポーネントのエクスポート追加
- `packages/ui/package.json` - Radix UI 依存関係追加
- `apps/admin/app/widgets/admin-layout/model/config.ts` - CRM ナビゲーション追加
