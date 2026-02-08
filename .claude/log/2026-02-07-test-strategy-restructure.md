# テスト戦略再構築 作業ログ

**日付**: 2026-02-07
**タスク**: Googleテストサイズに基づくテスト戦略の再構築

## 解釈した仕様

### 目的
1. Googleのテストサイズ（Small/Medium/Large）に基づいてテストを分類
2. Integrationテストをシーケンス図と1:1で対応させる
3. E2Eテストをユーザーストーリーに基づいて再構築
4. 未文書化ドメインの仕様書を整備

### テストサイズ定義
| サイズ | 特徴 | 実行時間 | 命名規則 |
|-------|------|---------|---------|
| Small | 単一プロセス、モック | < 100ms | `*.test.ts` |
| Medium | 複数プロセス可、DB接続可 | < 1秒 | `*.medium.test.ts` |
| Large | 実システム全体 | < 10秒 | `*.large.spec.ts` |

## 変更したファイル

### フェーズ1: 基盤整備
- `docs/development/testing.md` - テスト戦略ドキュメント更新
- `apps/api/tests/medium/setup/db.setup.ts` - テストDB初期化
- `apps/api/tests/medium/setup/container.setup.ts` - DIコンテナ初期化
- `apps/api/tests/vitest.medium.config.ts` - Medium Test設定

### フェーズ2: Post/Portfolio
- `apps/api/tests/medium/post/posts-list.medium.test.ts`
- `apps/api/tests/medium/post/post-by-slug.medium.test.ts`
- `apps/api/tests/medium/portfolio/portfolios-list.medium.test.ts`
- `apps/api/tests/medium/portfolio/portfolio-by-slug.medium.test.ts`

### フェーズ3: CRMドメイン
**シーケンス図:**
- `docs/sequence/api/crm/customers-list.md`
- `docs/sequence/api/crm/customer-create.md`
- `docs/sequence/api/crm/lead-convert.md`
- `docs/sequence/api/crm/deal-move-stage.md`

**仕様書:**
- `docs/specs/api/crm.md`
- `docs/specs/db/crm.md`

**Medium Test:**
- `apps/api/tests/medium/crm/customer-crud.medium.test.ts`
- `apps/api/tests/medium/crm/lead-conversion.medium.test.ts`
- `apps/api/tests/medium/crm/deal-pipeline.medium.test.ts`

### フェーズ4: その他ドメイン
**シーケンス図:**
- `docs/sequence/api/chat/chat-room-create.md`
- `docs/sequence/api/email/email-send.md`
- `docs/sequence/api/inquiry/inquiry-create.md`
- `docs/sequence/api/integration/freee-auth.md`

**API仕様書:**
- `docs/specs/api/chat.md`
- `docs/specs/api/email.md`
- `docs/specs/api/inquiry.md`
- `docs/specs/api/integration.md`

**Medium Test:**
- `apps/api/tests/medium/chat/chat-flow.medium.test.ts`
- `apps/api/tests/medium/inquiry/inquiry-flow.medium.test.ts`

### フェーズ5: ユーザーストーリー
**ユーザーストーリー:**
- `docs/user-stories/README.md`
- `docs/user-stories/visitor/browse-blog.md`
- `docs/user-stories/visitor/browse-portfolio.md`
- `docs/user-stories/visitor/submit-inquiry.md`

**Large Test:**
- `apps/web/e2e/large/visitor/browse-blog.large.spec.ts`
- `apps/web/e2e/large/visitor/browse-portfolio.large.spec.ts`

## 検証結果

### 作成したファイル数
- ドキュメント: 19ファイル
- テストファイル: 13ファイル
- 設定ファイル: 3ファイル

### ディレクトリ構造
```
docs/
├── development/testing.md (更新)
├── sequence/api/
│   ├── crm/ (新規)
│   ├── chat/ (新規)
│   ├── email/ (新規)
│   ├── inquiry/ (新規)
│   └── integration/ (新規)
├── specs/
│   ├── api/ (新規)
│   └── db/ (新規)
└── user-stories/ (新規)

apps/api/tests/
├── medium/ (新規)
│   ├── setup/
│   ├── post/
│   ├── portfolio/
│   ├── crm/
│   ├── chat/
│   └── inquiry/
└── vitest.medium.config.ts (新規)

apps/web/e2e/
└── large/ (新規)
    └── visitor/
```

## 残っている課題

1. **Medium Testの型エラー修正**: 一部のテストで暗黙的anyの警告あり
2. **Email/Integration Medium Test**: EmailとIntegrationのMedium Testは未作成（外部依存が複雑なため）
3. **Admin/CRM UserのLarge Test**: 管理者とCRMユーザーのLarge Testは未作成
4. **既存E2Eのマイグレーション**: 既存のE2Eテストをlarge/ディレクトリに移動する作業は未実施
5. **CI/CDスクリプトの更新**: package.jsonへのtest:medium, test:largeスクリプト追加は未実施

## 次のステップ

1. `bun run lint` でフォーマットと静的解析を実行
2. `bun run test` で既存テストの通過を確認
3. Medium Testの型エラーを修正
4. CI/CDパイプラインにMedium Test/Large Testの実行を追加
