# QAシート

## 概要

このドキュメントは、テストで担保している品質保証項目を一覧化したものです。

### 実装進捗サマリー

| テストタイプ | 実装済 | 未実装 | 進捗 |
| ------------ | ------ | ------ | ---- |
| Small Tests | 9パッケージ | 0 | ✅ 100% |
| Medium Tests | 9ドメイン | 2 | 🔄 82% |
| Large Tests | 3シナリオ | 6 | 🔄 33% |

> **注**: テストハニカム戦略により、Large Testsは最小限を目指しています。

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
| ⭐⭐⭐ | Medium Tests | サービス間インタラクション検証 | シーケンス図と1:1対応（必須） |
| ⭐ | Small Tests | 複雑なロジック検証 | 複雑な計算・変換・解析のみ |
| ⚠️ | Large Tests | クリティカルパス検証 | ユーザーストーリーの主要パスのみ |

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

### Medium Tests（統合テスト）- 最重視 ⭐⭐⭐

> **重要**: すべての機能に対してMedium Testを作成。シーケンス図と1:1で対応。

| ドメイン | テストファイル | 対応シーケンス図 | 状態 |
| -------- | -------------- | ---------------- | ---- |
| Post | `posts-list.medium.test.ts` | `docs/sequence/api/post/posts-list.md` | ✅ 実装済 |
| Post | `post-by-slug.medium.test.ts` | `docs/sequence/api/post/post-by-slug.md` | ✅ 実装済 |
| Portfolio | `portfolios-list.medium.test.ts` | `docs/sequence/api/portfolio/portfolios-list.md` | ✅ 実装済 |
| Portfolio | `portfolio-by-slug.medium.test.ts` | `docs/sequence/api/portfolio/portfolio-by-slug.md` | ✅ 実装済 |
| CRM | `customer-crud.medium.test.ts` | `docs/sequence/api/crm/customer-*.md` | ✅ 実装済 |
| CRM | `lead-conversion.medium.test.ts` | `docs/sequence/api/crm/lead-convert.md` | ✅ 実装済 |
| CRM | `deal-pipeline.medium.test.ts` | `docs/sequence/api/crm/deal-*.md` | ✅ 実装済 |
| Chat | `chat-flow.medium.test.ts` | `docs/sequence/api/chat/*.md` | ✅ 実装済 |
| Inquiry | `inquiry-flow.medium.test.ts` | `docs/sequence/api/inquiry/*.md` | ✅ 実装済 |
| Email | `email-send.medium.test.ts` | `docs/sequence/api/email/*.md` | ⏳ 未実装 |
| Integration | `freee-sync.medium.test.ts` | `docs/sequence/api/integration/*.md` | ⏳ 未実装 |

### Large Tests（E2Eテスト）- 最小限 ⚠️

> **注意**: 外部依存は壊れやすいため、クリティカルパスのみに限定。

| ペルソナ | テストファイル | 対応ユーザーストーリー | 状態 |
| -------- | -------------- | ---------------------- | ---- |
| Visitor | `browse-blog.large.spec.ts` | `docs/user-stories/visitor/browse-blog.md` | ✅ 実装済 |
| Visitor | `browse-portfolio.large.spec.ts` | `docs/user-stories/visitor/browse-portfolio.md` | ✅ 実装済 |
| Visitor | `submit-inquiry.large.spec.ts` | `docs/user-stories/visitor/submit-inquiry.md` | ✅ 実装済 |
| Admin | `manage-posts.large.spec.ts` | `docs/user-stories/admin/manage-posts.md` | ⏳ 未実装 |
| Admin | `manage-portfolios.large.spec.ts` | `docs/user-stories/admin/manage-portfolios.md` | ⏳ 未実装 |
| Admin | `manage-inquiries.large.spec.ts` | `docs/user-stories/admin/manage-inquiries.md` | ⏳ 未実装 |
| CRM User | `manage-customers.large.spec.ts` | `docs/user-stories/crm-user/manage-customers.md` | ⏳ 未実装 |
| CRM User | `manage-leads.large.spec.ts` | `docs/user-stories/crm-user/manage-leads.md` | ⏳ 未実装 |
| CRM User | `manage-deals.large.spec.ts` | `docs/user-stories/crm-user/manage-deals.md` | ⏳ 未実装 |

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

### WCAG 2.1 AA準拠チェック

| カテゴリ | テスト項目 | 自動化 | 状態 |
| -------- | ---------- | ------ | ---- |
| 知覚可能 | 画像の代替テキスト | axe-core | - |
| 知覚可能 | カラーコントラスト | axe-core | - |
| 操作可能 | キーボードナビゲーション | Playwright | - |
| 操作可能 | フォーカス管理 | Playwright | - |
| 理解可能 | フォームラベル | axe-core | - |
| 堅牢 | HTML構造 | axe-core | - |

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
# Small Tests
bun run test

# Medium Tests
bun vitest run -c apps/api/tests/vitest.medium.config.ts

# Large Tests
bun run e2e

# カバレッジレポート
bun run coverage

# アクセシビリティテスト
bun run test:a11y
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
