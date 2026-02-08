# QAシート

## 概要

このドキュメントは、テストで担保している品質保証項目を一覧化したものです。

## テストカバレッジ目標

| メトリクス | 目標 | 現状 |
| ---------- | ---- | ---- |
| Lines | 90% | - |
| Functions | 90% | - |
| Statements | 90% | - |
| Branches | 100% | - |

## テストタイプ別カバレッジ

### Small Tests（ユニットテスト）

| パッケージ | ファイルパターン | 対象 | カバレッジ |
| ---------- | ---------------- | ---- | ---------- |
| @portfolio/validation | `*.test.ts` | バリデーションスキーマ | - |
| @portfolio/log | `*.test.ts` | エラー処理、ロギング | - |
| @portfolio/auth | `*.test.ts` | 認証ユーティリティ | - |
| apps/api | `*.test.ts` | UseCase、Repository | - |
| apps/web | `*.test.ts` | コンポーネント、フック | - |
| apps/admin | `*.test.ts` | コンポーネント、フック | - |

### Medium Tests（統合テスト）

| ドメイン | テストファイル | 対応シーケンス図 | 状態 |
| -------- | -------------- | ---------------- | ---- |
| Post | `posts-list.medium.test.ts` | `docs/sequence/api/post/posts-list.md` | 計画 |
| Post | `post-by-slug.medium.test.ts` | `docs/sequence/api/post/post-by-slug.md` | 計画 |
| Portfolio | `portfolios-list.medium.test.ts` | `docs/sequence/api/portfolio/portfolios-list.md` | 計画 |
| Portfolio | `portfolio-by-slug.medium.test.ts` | `docs/sequence/api/portfolio/portfolio-by-slug.md` | 計画 |
| CRM | `customer-crud.medium.test.ts` | `docs/sequence/api/crm/customer-*.md` | 計画 |
| CRM | `lead-conversion.medium.test.ts` | `docs/sequence/api/crm/lead-convert.md` | 計画 |
| CRM | `deal-pipeline.medium.test.ts` | `docs/sequence/api/crm/deal-*.md` | 計画 |
| Chat | `chat-flow.medium.test.ts` | `docs/sequence/api/chat/*.md` | 計画 |
| Inquiry | `inquiry-flow.medium.test.ts` | `docs/sequence/api/inquiry/*.md` | 計画 |
| Email | `email-send.medium.test.ts` | `docs/sequence/api/email/*.md` | 計画 |
| Integration | `freee-sync.medium.test.ts` | `docs/sequence/api/integration/*.md` | 計画 |

### Large Tests（E2Eテスト）

| ペルソナ | テストファイル | 対応ユーザーストーリー | 状態 |
| -------- | -------------- | ---------------------- | ---- |
| Visitor | `browse-blog.large.spec.ts` | `docs/user-stories/visitor/browse-blog.md` | 計画 |
| Visitor | `browse-portfolio.large.spec.ts` | `docs/user-stories/visitor/browse-portfolio.md` | 計画 |
| Visitor | `submit-inquiry.large.spec.ts` | `docs/user-stories/visitor/submit-inquiry.md` | 計画 |
| Admin | `manage-posts.large.spec.ts` | `docs/user-stories/admin/manage-posts.md` | 計画 |
| Admin | `manage-portfolios.large.spec.ts` | `docs/user-stories/admin/manage-portfolios.md` | 計画 |
| Admin | `manage-inquiries.large.spec.ts` | `docs/user-stories/admin/manage-inquiries.md` | 計画 |
| CRM User | `manage-customers.large.spec.ts` | `docs/user-stories/crm-user/manage-customers.md` | 計画 |
| CRM User | `manage-leads.large.spec.ts` | `docs/user-stories/crm-user/manage-leads.md` | 計画 |
| CRM User | `manage-deals.large.spec.ts` | `docs/user-stories/crm-user/manage-deals.md` | 計画 |

## 機能別テストマトリクス

### 認証機能

| テスト項目 | Small | Medium | Large | 状態 |
| ---------- | ----- | ------ | ----- | ---- |
| ログイン成功 | - | - | - | - |
| ログイン失敗（無効な認証情報） | - | - | - | - |
| セッション有効期限 | - | - | - | - |
| ログアウト | - | - | - | - |
| パスワードリセット | - | - | - | - |

### ブログ機能

| テスト項目 | Small | Medium | Large | 状態 |
| ---------- | ----- | ------ | ----- | ---- |
| 記事一覧取得 | - | - | - | - |
| 記事詳細取得 | - | - | - | - |
| タグでフィルタリング | - | - | - | - |
| 記事作成 | - | - | - | - |
| 記事更新 | - | - | - | - |
| 記事削除 | - | - | - | - |

### ポートフォリオ機能

| テスト項目 | Small | Medium | Large | 状態 |
| ---------- | ----- | ------ | ----- | ---- |
| プロジェクト一覧取得 | - | - | - | - |
| プロジェクト詳細取得 | - | - | - | - |
| 画像アップロード | - | - | - | - |
| プロジェクト作成 | - | - | - | - |
| プロジェクト更新 | - | - | - | - |

### CRM機能

| テスト項目 | Small | Medium | Large | 状態 |
| ---------- | ----- | ------ | ----- | ---- |
| 顧客一覧取得 | - | - | - | - |
| 顧客作成 | - | - | - | - |
| 顧客更新 | - | - | - | - |
| リード一覧取得 | - | - | - | - |
| リード→顧客変換 | - | - | - | - |
| 案件一覧取得 | - | - | - | - |
| 案件ステージ移動 | - | - | - | - |
| パイプライン管理 | - | - | - | - |

### お問い合わせ機能

| テスト項目 | Small | Medium | Large | 状態 |
| ---------- | ----- | ------ | ----- | ---- |
| お問い合わせ送信 | - | - | - | - |
| バリデーションエラー | - | - | - | - |
| 返信追加 | - | - | - | - |
| ステータス更新 | - | - | - | - |

## バリデーションテスト

### 入力検証テストケース

| スキーマ | テストケース | 期待結果 | 状態 |
| -------- | ------------ | -------- | ---- |
| postSchema | 有効なデータ | 成功 | - |
| postSchema | タイトル空 | 失敗 | - |
| postSchema | スラッグ空 | 失敗 | - |
| postSchema | 日付形式不正 | 失敗 | - |
| portfolioSchema | 有効なデータ | 成功 | - |
| portfolioSchema | タイトル空 | 失敗 | - |
| urlSchema | 有効なURL | 成功 | - |
| urlSchema | 無効なURL | 失敗 | - |

### API検証テストケース

| 関数 | テストケース | 期待結果 | 状態 |
| ---- | ------------ | -------- | ---- |
| isValidSlug | 英数字とハイフン | true | - |
| isValidSlug | 特殊文字含む | false | - |
| isValidUuid | 有効なUUID v4 | true | - |
| isValidUuid | 無効な形式 | false | - |
| isValidImageContentType | image/jpeg | true | - |
| isValidImageContentType | text/html | false | - |

## エラーハンドリングテスト

### エラーコードテストケース

| エラーコード | テストケース | HTTPステータス | 状態 |
| ------------ | ------------ | -------------- | ---- |
| AUTH_INVALID_TOKEN | 無効なトークン | 401 | - |
| AUTH_FORBIDDEN | 権限なし | 403 | - |
| VALIDATION_MISSING_FIELD | 必須フィールド欠落 | 400 | - |
| NOT_FOUND_POST | 存在しない記事 | 404 | - |
| RATE_LIMIT_EXCEEDED | レート制限超過 | 429 | - |
| DATABASE_CONNECTION_ERROR | DB接続エラー | 500 | - |

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

- [テスト戦略](../development/testing.md)
- [シーケンス図](../sequence/)
- [ユーザーストーリー](../user-stories/)
