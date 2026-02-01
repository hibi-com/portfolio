# CRM/Support テスト作成作業ログ

## 日付
2026-02-01

## 概要
CRM/Supportシステムに関するテストコードの作成とディレクトリ構造のリファクタリングを実施。

## 完了タスク

### 1. Portfolio/Post Usecaseディレクトリ移動 (Task #31)
- `apps/api/src/usecase/portfolio/` ディレクトリを作成
- `apps/api/src/usecase/post/` ディレクトリを作成
- 既存のusecaseファイルをそれぞれのディレクトリに移動
- `apps/api/src/di/container.ts` のインポートパスを更新

### 2. CRM API Usecaseテスト作成 (Task #32)
作成したテストファイル:
- `apps/api/src/usecase/customer/getCustomers.test.ts`
- `apps/api/src/usecase/customer/getCustomerById.test.ts`
- `apps/api/src/usecase/customer/createCustomer.test.ts`
- `apps/api/src/usecase/customer/updateCustomer.test.ts`
- `apps/api/src/usecase/customer/deleteCustomer.test.ts`
- `apps/api/src/usecase/lead/getLeads.test.ts`
- `apps/api/src/usecase/lead/createLead.test.ts`
- `apps/api/src/usecase/lead/convertLeadToDeal.test.ts`
- `apps/api/src/usecase/deal/getDeals.test.ts`
- `apps/api/src/usecase/deal/createDeal.test.ts`
- `apps/api/src/usecase/deal/moveDealToStage.test.ts`

### 3. Support API Usecaseテスト作成 (Task #33)
作成したテストファイル:
- `apps/api/src/usecase/inquiry/getInquiries.test.ts`
- `apps/api/src/usecase/inquiry/createInquiry.test.ts`
- `apps/api/src/usecase/inquiry/closeInquiry.test.ts`
- `apps/api/src/usecase/inquiry/addInquiryResponse.test.ts`

### 4. E2Eテスト分離 (Task #34)
作成したE2Eテストファイル:
- `apps/api/e2e/customers.spec.ts`
- `apps/api/e2e/leads.spec.ts`
- `apps/api/e2e/deals.spec.ts`
- `apps/api/e2e/pipelines.spec.ts`
- `apps/api/e2e/inquiries.spec.ts`

### 5. Admin UIテスト作成 (Task #35)
作成したUIテストファイル:
- `apps/admin/app/features/crm/ui/CustomersList.test.tsx`
- `apps/admin/app/features/crm/ui/DealsKanban.test.tsx`
- `apps/admin/app/features/crm/ui/LeadsList.test.tsx`
- `apps/admin/app/features/support/ui/InquiriesList.test.tsx`

## テストパターン

### Usecaseテスト
- VitestとVi.fnを使用したモック
- `createMockRepository`ヘルパー関数でリポジトリをモック
- 各テストでリポジトリメソッドの呼び出しを検証

### E2Eテスト
- Playwrightを使用
- APIエンドポイントへのHTTPリクエストをテスト
- ステータスコードとレスポンスボディを検証

### UIテスト
- @testing-library/reactを使用
- @tanstack/react-routerでテスト用ルーターを作成
- カスタムフックをvi.mockでモック
- ローディング、エラー、空状態、データ表示をテスト

## 残存課題
- テスト実行環境のセットアップ確認が必要（miniflare環境の設定）
- E2Eテストの実行には実際のAPIサーバーが必要

## 検証方法
1. Unit Tests: `pnpm --filter @portfolio/cms test`
2. E2E Tests: `pnpm --filter @portfolio/cms e2e`
3. Admin UI Tests: `pnpm --filter admin test`
