# QAシート

## 概要

このドキュメントは、テストで担保している品質保証項目を一覧化したものです。

### 実装進捗サマリー

| テストタイプ | 実装済 | 未実装 | 進捗 |
| ------------ | ------ | ------ | ---- |
| Small Tests | 9パッケージ | 0 | ✅ 100% |
| Integration Tests (API) | 9ドメイン | 2 | 🔄 82% |
| Integration Tests (Admin) | 5ファイル | 2 | 🔄 71% |
| Integration Tests (Web) | 4ファイル | 0 | ✅ 100% |
| E2E Tests (Web) | 3シナリオ | 0 | ✅ 100% |
| E2E Tests (Admin) | 4ファイル | 0 | ✅ 100% |
| E2E Tests (独立) | 4カテゴリ | 0 | ✅ 100% |

> **注**: テストハニカム戦略により、E2E Testsは最小限を目指しています。

## テスト戦略：テストハニカム

[Spotify Testing Honeycomb](https://engineering.atspotify.com/2018/01/testing-of-microservices) に基づき、**Medium Tests（Integration Tests）を最重視**します。

```text
        ┌───────────┐
        │  Large    │  ← 最小限
        ├───────────┤
    ┌───┴───────────┴───┐
    │     Medium        │  ← 最重視 ⭐⭐⭐
    ├───────────────────┤
        │   Small   │  ← 限定的
        └───────────┘
```

### テスト優先順位

| 優先度 | テストタイプ | 目的 | 作成基準 |
| ------ | ----------- | ---- | -------- |
| ⭐⭐⭐ | Integration Tests | サービス間インタラクション検証 | シーケンス図と1:1対応（必須） |
| ⭐ | Small Tests | 複雑なロジック検証 | 複雑な計算・変換・解析のみ |
| ⚠️ | E2E Tests | クリティカルパス検証 | ユーザーストーリーの主要パスのみ |

### Small Test作成基準

| ✅ 書くべき | ❌ 書かない |
| ---------- | ----------- |
| 複雑なビジネスロジック | 単純なCRUD操作 |
| 多くの分岐を持つ関数 | 他への委譲だけのラッパー |
| ユーティリティ関数 | フレームワーク機能を呼ぶだけ |
| エッジケースが多い処理 | 実装の詳細に依存するテスト |

## テストカバレッジ目標

| メトリクス | 目標 | 現状 |
| ---------- | ---- | ---- |
| Lines | 90% | - |
| Functions | 90% | - |
| Statements | 90% | - |
| Branches | 100% | - |

## テストタイプ別カバレッジ

### Small Tests（ユニットテスト）- 限定的 ⭐

> **注意**: 複雑なロジックのみ対象。単純なCRUD/委譲にはSmall Testは不要。

| パッケージ | ファイルパターン | 対象 | 状態 |
| ---------- | ---------------- | ---- | ---- |
| @portfolio/validation | `*.test.ts` | バリデーションスキーマ | ✅ 実装済 |
| @portfolio/log | `*.test.ts` | エラー処理、ロギング | ✅ 実装済 |
| @portfolio/auth | `*.test.ts` | 認証ユーティリティ | ✅ 実装済 |
| @portfolio/ui | `*.test.ts` | UIユーティリティ | ✅ 実装済 |
| @portfolio/db | `*.test.ts` | DBクライアント | ✅ 実装済 |
| @portfolio/api | `*.test.ts` | APIクライアント | ✅ 実装済 |
| apps/api | `*.test.ts` | UseCase、Repository | ✅ 実装済 |
| apps/web | `*.test.ts` | コンポーネント、フック | ✅ 実装済 |
| apps/admin | `*.test.ts` | コンポーネント、フック | ✅ 実装済 |

### Integration Tests（API）- 最重視 ⭐⭐⭐

> **重要**: すべての機能に対してIntegration Testを作成。シーケンス図と1:1で対応。
> **配置**: `apps/api/integration/{domain}/*.integration.test.ts`

| ドメイン | テストファイル | 対応シーケンス図 | 状態 |
| -------- | -------------- | ---------------- | ---- |
| Post | `posts-list.integration.test.ts` | `docs/sequence/api/post/posts-list.md` | ✅ 実装済 |
| Post | `post-by-slug.integration.test.ts` | `docs/sequence/api/post/post-by-slug.md` | ✅ 実装済 |
| Portfolio | `portfolios-list.integration.test.ts` | `docs/sequence/api/portfolio/portfolios-list.md` | ✅ 実装済 |
| Portfolio | `portfolio-by-slug.integration.test.ts` | `docs/sequence/api/portfolio/portfolio-by-slug.md` | ✅ 実装済 |
| CRM | `customer-crud.integration.test.ts` | `docs/sequence/api/crm/customer-*.md` | ✅ 実装済 |
| CRM | `lead-conversion.integration.test.ts` | `docs/sequence/api/crm/lead-convert.md` | ✅ 実装済 |
| CRM | `deal-pipeline.integration.test.ts` | `docs/sequence/api/crm/deal-*.md` | ✅ 実装済 |
| Chat | `chat-flow.integration.test.ts` | `docs/sequence/api/chat/*.md` | ✅ 実装済 |
| Inquiry | `inquiry-flow.integration.test.ts` | `docs/sequence/api/inquiry/*.md` | ✅ 実装済 |
| Email | `email-send.integration.test.ts` | `docs/sequence/api/email/*.md` | ⏳ 未実装 |
| Integration | `freee-sync.integration.test.ts` | `docs/sequence/api/integration/*.md` | ⏳ 未実装 |

### Integration Tests（Admin）- 最重視 ⭐⭐⭐

> **配置**: `apps/admin/integration/*.integration.test.tsx`

| 機能 | テストファイル | 対応シーケンス図 | 状態 |
| ---- | -------------- | ---------------- | ---- |
| 顧客一覧 | `customers-list.integration.test.tsx` | `docs/sequence/admin/crm/customers-list.md` | ✅ 実装済 |
| ポートフォリオ一覧 | `portfolios-list.integration.test.tsx` | `docs/sequence/admin/portfolios/portfolios-list.md` | ✅ 実装済 |
| 投稿一覧 | `posts-list.integration.test.tsx` | `docs/sequence/admin/posts/posts-list.md` | ✅ 実装済 |
| ダッシュボード | `dashboard-load.integration.test.tsx` | `docs/sequence/admin/dashboard/dashboard-load.md` | ✅ 実装済 |
| 問い合わせ一覧 | `inquiries-list.integration.test.tsx` | `docs/sequence/admin/inquiries/inquiries-list.md` | ✅ 実装済 |
| 投稿作成 | `post-create.integration.test.tsx` | `docs/sequence/admin/posts/post-create.md` | ⏳ 未実装 |
| 投稿編集 | `post-edit.integration.test.tsx` | `docs/sequence/admin/posts/post-edit.md` | ⏳ 未実装 |

### Integration Tests（Web）- 最重視 ⭐⭐⭐

> **配置**: `apps/web/integration/*.integration.test.ts`

| 機能 | テストファイル | 対応シーケンス図 | 状態 |
| ---- | -------------- | ---------------- | ---- |
| ブログ一覧 | `blog-list.integration.test.ts` | `docs/sequence/web/blog/blog-list.md` | ✅ 実装済 |
| ブログ詳細 | `blog-detail.integration.test.ts` | `docs/sequence/web/blog/blog-detail.md` | ✅ 実装済 |
| ポートフォリオ一覧 | `portfolio-list.integration.test.ts` | `docs/sequence/web/portfolio/portfolio-list.md` | ✅ 実装済 |
| ポートフォリオ詳細 | `portfolio-detail.integration.test.ts` | `docs/sequence/web/portfolio/portfolio-detail.md` | ✅ 実装済 |

### E2E Tests（Web）- 最小限 ⚠️

> **配置**: `apps/web/e2e/pages/*.spec.ts`

| ペルソナ | テストファイル | 対応ユーザーストーリー | 状態 |
| -------- | -------------- | ---------------------- | ---- |
| Visitor | `browse-blog.spec.ts` | `docs/user-stories/visitor/browse-blog.md` | ✅ 実装済 |
| Visitor | `browse-portfolio.spec.ts` | `docs/user-stories/visitor/browse-portfolio.md` | ✅ 実装済 |
| Visitor | `submit-inquiry.spec.ts` | `docs/user-stories/visitor/submit-inquiry.md` | ✅ 実装済 |

### E2E Tests（Admin）- 最小限 ⚠️

> **配置**: `apps/admin/e2e/*.spec.ts`

| 機能 | テストファイル | 対応ユーザーストーリー | 状態 |
| ---- | -------------- | ---------------------- | ---- |
| 投稿管理 | `posts.spec.ts` | `docs/user-stories/admin/manage-posts.md` | ✅ 実装済 |
| ポートフォリオ管理 | `portfolios.spec.ts` | `docs/user-stories/admin/manage-portfolios.md` | ✅ 実装済 |
| 問い合わせ管理 | `manage-inquiries.spec.ts` | `docs/user-stories/admin/manage-inquiries.md` | ✅ 実装済 |
| ナビゲーション | `navigation.spec.ts` | - | ✅ 実装済 |

### E2E Tests（API）- 最小限 ⚠️

> **配置**: `apps/api/e2e/*.spec.ts`

| 機能 | テストファイル | 対応ユーザーストーリー | 状態 |
| ---- | -------------- | ---------------------- | ---- |
| 顧客管理 | `customers.spec.ts` | `docs/user-stories/crm-user/manage-customers.md` | ✅ 実装済 |
| リード管理 | `leads.spec.ts` | `docs/user-stories/crm-user/manage-leads.md` | ✅ 実装済 |
| 案件管理 | `deals.spec.ts` | `docs/user-stories/crm-user/manage-deals.md` | ✅ 実装済 |
| パイプライン | `pipelines.spec.ts` | - | ✅ 実装済 |
| 問い合わせ | `inquiries.spec.ts` | - | ✅ 実装済 |

### E2E Tests（独立プロジェクト）- apps/e2e

> **配置**: `apps/e2e/e2e/**/*.spec.ts`
> **用途**: 本番環境に対する独立したE2Eテスト

| カテゴリ | テストファイル | 目的 | 状態 |
| -------- | -------------- | ---- | ---- |
| アクセシビリティ | `accessibility/*.spec.ts` | WCAG 2.1 AA準拠チェック | ✅ 実装済 |
| モンキーテスト | `monkey/*.spec.ts` | ランダム操作による安定性テスト | ✅ 実装済 |
| Web API | `web-api/*.spec.ts` | Web BFF APIテスト | ✅ 実装済 |
| Admin API | `admin-api/*.spec.ts` | Admin APIテスト | ✅ 実装済 |
| ビジュアル | `storybook/visual/*.spec.ts` | スクリーンショット比較 | ✅ 実装済 |
| インタラクション | `storybook/interactions/*.spec.ts` | Storybookインタラクションテスト | ✅ 実装済 |

## 機能別テストマトリクス

> **凡例**: ⭐ = 必須（Medium優先）、○ = 複雑なロジックのみ、△ = クリティカルパスのみ

### 認証機能

| テスト項目 | Small | Medium | Large | 状態 |
| ---------- | ----- | ------ | ----- | ---- |
| ログイン成功 | ○ | ⭐ | △ | ✅ Small |
| ログイン失敗（無効な認証情報） | ○ | ⭐ | - | ✅ Small |
| セッション有効期限 | ○ | ⭐ | - | ✅ Small |
| ログアウト | - | ⭐ | △ | ⏳ 未実装 |
| パスワードリセット | - | ⭐ | - | ⏳ 未実装 |

### ブログ機能

| テスト項目 | Small | Medium | Large | 状態 |
| ---------- | ----- | ------ | ----- | ---- |
| 記事一覧取得 | ○ | ⭐ | △ | ✅ 全サイズ |
| 記事詳細取得 | ○ | ⭐ | △ | ✅ 全サイズ |
| タグでフィルタリング | ○ | ⭐ | - | ✅ Small/Medium |
| 記事作成 | - | ⭐ | △ | ⏳ Large未実装 |
| 記事更新 | - | ⭐ | △ | ⏳ Large未実装 |
| 記事削除 | - | ⭐ | - | ⏳ Large未実装 |

### ポートフォリオ機能

| テスト項目 | Small | Medium | Large | 状態 |
| ---------- | ----- | ------ | ----- | ---- |
| プロジェクト一覧取得 | ○ | ⭐ | △ | ✅ 全サイズ |
| プロジェクト詳細取得 | ○ | ⭐ | △ | ✅ 全サイズ |
| 画像アップロード | ○ | ⭐ | - | ✅ Small/Medium |
| プロジェクト作成 | - | ⭐ | △ | ⏳ Large未実装 |
| プロジェクト更新 | - | ⭐ | - | ⏳ Large未実装 |

### CRM機能

| テスト項目 | Small | Medium | Large | 状態 |
| ---------- | ----- | ------ | ----- | ---- |
| 顧客一覧取得 | ○ | ⭐ | △ | ✅ Small/Medium |
| 顧客作成 | ○ | ⭐ | △ | ✅ Small/Medium |
| 顧客更新 | ○ | ⭐ | - | ✅ Small/Medium |
| リード一覧取得 | ○ | ⭐ | △ | ✅ Small/Medium |
| リード→顧客変換 | ○ | ⭐ | - | ✅ Small/Medium |
| 案件一覧取得 | ○ | ⭐ | △ | ✅ Small/Medium |
| 案件ステージ移動 | ○ | ⭐ | - | ✅ Small/Medium |
| パイプライン管理 | - | ⭐ | - | ✅ Medium |

### お問い合わせ機能

| テスト項目 | Small | Medium | Large | 状態 |
| ---------- | ----- | ------ | ----- | ---- |
| お問い合わせ送信 | ○ | ⭐ | △ | ✅ 全サイズ |
| バリデーションエラー | ○ | ⭐ | - | ✅ Small/Medium |
| 返信追加 | ○ | ⭐ | - | ✅ Small/Medium |
| ステータス更新 | ○ | ⭐ | - | ✅ Small/Medium |

## バリデーションテスト

### 入力検証テストケース

| スキーマ | テストケース | 期待結果 | 状態 |
| -------- | ------------ | -------- | ---- |
| postSchema | 有効なデータ | 成功 | ✅ 実装済 |
| postSchema | タイトル空 | 失敗 | ✅ 実装済 |
| postSchema | スラッグ空 | 失敗 | ✅ 実装済 |
| postSchema | 日付形式不正 | 失敗 | ✅ 実装済 |
| portfolioSchema | 有効なデータ | 成功 | ✅ 実装済 |
| portfolioSchema | タイトル空 | 失敗 | ✅ 実装済 |
| urlSchema | 有効なURL | 成功 | ✅ 実装済 |
| urlSchema | 無効なURL | 失敗 | ✅ 実装済 |

### API検証テストケース

| 関数 | テストケース | 期待結果 | 状態 |
| ---- | ------------ | -------- | ---- |
| isValidSlug | 英数字とハイフン | true | ✅ 実装済 |
| isValidSlug | 特殊文字含む | false | ✅ 実装済 |
| isValidUuid | 有効なUUID v4 | true | ✅ 実装済 |
| isValidUuid | 無効な形式 | false | ✅ 実装済 |
| isValidImageContentType | image/jpeg | true | ✅ 実装済 |
| isValidImageContentType | text/html | false | ✅ 実装済 |

## エラーハンドリングテスト

### エラーコードテストケース

| エラーコード | テストケース | HTTPステータス | 状態 |
| ------------ | ------------ | -------------- | ---- |
| AUTH_INVALID_TOKEN | 無効なトークン | 401 | ✅ 実装済 |
| AUTH_FORBIDDEN | 権限なし | 403 | ✅ 実装済 |
| VALIDATION_MISSING_FIELD | 必須フィールド欠落 | 400 | ✅ 実装済 |
| NOT_FOUND_POST | 存在しない記事 | 404 | ✅ 実装済 |
| RATE_LIMIT_EXCEEDED | レート制限超過 | 429 | ✅ 実装済 |
| DATABASE_CONNECTION_ERROR | DB接続エラー | 500 | ✅ 実装済 |

## アクセシビリティテスト

> **配置**: `apps/e2e/e2e/accessibility/*.spec.ts`

### WCAG 2.1 AA準拠チェック

| カテゴリ | テスト項目 | テストファイル | 状態 |
| -------- | ---------- | -------------- | ---- |
| 知覚可能 | 画像の代替テキスト | `images.spec.ts` | ✅ 実装済 |
| 知覚可能 | カラーコントラスト | `contrast.spec.ts` | ✅ 実装済 |
| 操作可能 | キーボードナビゲーション | `keyboard.spec.ts` | ✅ 実装済 |
| 操作可能 | フォーカス管理 | `keyboard.spec.ts` | ✅ 実装済 |
| 理解可能 | フォームラベル | `forms.spec.ts` | ✅ 実装済 |
| 理解可能 | ボタン/リンクラベル | `labels.spec.ts` | ✅ 実装済 |
| 堅牢 | HTML構造/見出し階層 | `semantic.spec.ts` | ✅ 実装済 |
| 堅牢 | ナビゲーション | `navigation.spec.ts` | ✅ 実装済 |

## パフォーマンステスト

### レスポンス時間目標

| エンドポイント | 目標 | 実測 | 状態 |
| -------------- | ---- | ---- | ---- |
| GET /api/posts | < 200ms | - | - |
| GET /api/portfolios | < 200ms | - | - |
| POST /api/inquiries | < 500ms | - | - |
| ページ初期表示 | < 3s | - | - |

## セキュリティテスト

### OWASP Top 10対応

| カテゴリ | テスト項目 | 自動化 | 状態 |
| -------- | ---------- | ------ | ---- |
| A01 | アクセス制御テスト | 手動 | - |
| A03 | SQLインジェクション | 自動 | - |
| A03 | XSS | 自動 | - |
| A07 | 認証フローテスト | 手動 | - |

## テスト実行コマンド

```bash
# Small Tests（ユニットテスト）
bun run test

# Integration Tests（API）
cd apps/api && bun run test:integration

# Integration Tests（Admin）
cd apps/admin && bun vitest run -c vitest.integration.config.ts

# Integration Tests（Web）
cd apps/web && bun vitest run -c vitest.integration.config.ts

# E2E Tests（Web）
cd apps/web && bun run e2e

# E2E Tests（Admin）
cd apps/admin && bun run e2e

# E2E Tests（独立）
cd apps/e2e && BASE_URL=https://example.com bun run accessibility
cd apps/e2e && BASE_URL=https://example.com bun run monkey
cd apps/e2e && BASE_URL=https://example.com bun run e2e:web

# カバレッジレポート
bun run coverage
```

## CI/CDパイプライン

| ステージ | テストタイプ | トリガー |
| -------- | ------------ | -------- |
| コミット | Small Tests | 常時 |
| PR | Small + Medium Tests | 常時 |
| マージ前 | Small + Medium + Large Tests | 常時 |
| デプロイ後 | スモークテスト | 本番のみ |

## 関連ドキュメント

- [テスト戦略（テストハニカム）](../development/testing.md)
- [Spotify Testing Honeycomb](https://engineering.atspotify.com/2018/01/testing-of-microservices)
- [シーケンス図](../sequence/) - Medium Testと1:1対応
- [ユーザーストーリー](../user-stories/) - Large Testと1:1対応
