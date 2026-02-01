# Support チケット管理 UI 実装ログ

## 日付
2026-02-01

## 実装内容

### 1. Support API クライアント (`shared/lib/support-api.ts`)

**エンドポイント:**
- `supportApi.inquiries.list()` - 問い合わせ一覧取得
- `supportApi.inquiries.getById(id)` - 問い合わせ詳細取得
- `supportApi.inquiries.create(data)` - 問い合わせ作成
- `supportApi.inquiries.update(id, data)` - 問い合わせ更新
- `supportApi.inquiries.respond(id, data)` - 返信追加
- `supportApi.inquiries.close(id)` - 問い合わせクローズ

### 2. Support Feature 実装

**ディレクトリ構造:**
```
apps/admin/app/features/support/
├── index.ts
├── lib/
│   └── useInquiries.ts
└── ui/
    ├── InquiriesList.tsx
    └── InquiryDetail.tsx
```

### 3. useInquiries フック

**機能:**
- 問い合わせ一覧の取得・キャッシュ
- 問い合わせ作成
- 問い合わせ更新
- 問い合わせクローズ

**useInquiryDetail フック:**
- 問い合わせ詳細取得
- 返信追加

### 4. InquiriesList コンポーネント

**機能:**
- テーブル形式での問い合わせ一覧表示
- ステータス・優先度バッジ
- 詳細リンク・クローズアクション
- 新規問い合わせ作成リンク

**ステータス:**
- OPEN: 未対応
- PENDING: 対応中
- RESOLVED: 解決済み
- CLOSED: クローズ

**優先度:**
- LOW: 低
- MEDIUM: 中
- HIGH: 高
- URGENT: 緊急

### 5. InquiryDetail コンポーネント

**機能:**
- 問い合わせ詳細表示
- 返信履歴のチャット形式表示
- 返信フォーム（内部メモ対応）
- 顧客情報サイドバー
- メタ情報表示

### 6. ルートファイル

- `support.tsx`: サポートダッシュボード
- `support.inquiries.tsx`: 問い合わせ一覧
- `support.inquiries.$id.tsx`: 問い合わせ詳細

## 型定義

```typescript
export type InquiryStatus = "OPEN" | "PENDING" | "RESOLVED" | "CLOSED";
export type InquiryPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type InquiryType = "GENERAL" | "SUPPORT" | "SALES" | "FEEDBACK" | "BUG_REPORT";

export interface Inquiry {
    id: string;
    customerId?: string;
    subject: string;
    description: string;
    type: InquiryType;
    status: InquiryStatus;
    priority: InquiryPriority;
    email?: string;
    name?: string;
    phone?: string;
    assigneeId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface InquiryResponse {
    id: string;
    inquiryId: string;
    message: string;
    isInternal: boolean;
    senderId?: string;
    senderType: "STAFF" | "CUSTOMER";
    createdAt: string;
}
```

## ファイル一覧

### 新規作成
- `apps/admin/app/shared/lib/support-api.ts`
- `apps/admin/app/features/support/index.ts`
- `apps/admin/app/features/support/lib/useInquiries.ts`
- `apps/admin/app/features/support/ui/InquiriesList.tsx`
- `apps/admin/app/features/support/ui/InquiryDetail.tsx`
- `apps/admin/app/routes/support.tsx`
- `apps/admin/app/routes/support.inquiries.tsx`
- `apps/admin/app/routes/support.inquiries.$id.tsx`

## 検証状況

- [x] コンポーネント作成
- [x] フック実装
- [x] API クライアント実装
- [x] ルートファイル作成
- [ ] TanStack Router ルートツリー再生成待ち
- [ ] E2E テスト

## 残課題

1. 問い合わせ作成フォーム
2. リアルタイムチャット UI (WebSocket)
3. 担当者アサイン機能
4. メール通知連携
5. 検索・フィルター機能
