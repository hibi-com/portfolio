# Apps セキュリティ最大化 - 実装ログ

## 実施日
2026-01-31

## 解釈した仕様

ユーザーが提示したセキュリティ強化プランに基づき、以下の5フェーズで実装を行った：

1. **API認証の適用**: `uploadPortfolioImage` エンドポイントへの認証必須化
2. **セキュリティヘッダー・CORS設定**: secureHeaders、CORSミドルウェアの追加
3. **入力検証・アップロード堅牢化**: slug/UUID検証、Content-Type/マジックバイト検証
4. **サーバー側サニタイズ**: packages/ui のサニタイズ処理をサーバー側でも実行
5. **レート制限**: POSTエンドポイントへの簡易レート制限の実装

## 変更したファイル

### apps/api
- `src/index.ts`: secureHeaders、CORSミドルウェアを追加
- `src/interface/rest/index.ts`: 認証ミドルウェアとレート制限を適用
- `src/interface/rest/portfolios.ts`: 入力検証（slug, UUID, Content-Type, マジックバイト）を追加
- `src/interface/middleware/rateLimit.ts`: 新規作成 - レート制限ミドルウェア
- `src/lib/validation.ts`: 新規作成 - バリデーションユーティリティ

### apps/web
- `app/entry.server.tsx`: セキュリティヘッダーを追加
- `public/_headers`: 新規作成 - Cloudflare Pages用ヘッダー設定

### apps/admin
- `public/_headers`: 新規作成 - Cloudflare Pages用ヘッダー設定

### apps/wiki
- `public/_headers`: 新規作成 - Cloudflare Pages用ヘッダー設定

### packages/api
- `generated/mutator.ts`: `withCredentials: true` を追加

### packages/ui
- `src/libs/sanitize.ts`: サーバー側でもサニタイズするよう修正

## テストファイル
- `apps/api/src/interface/rest/index.test.ts`: 認証テスト
- `apps/api/src/security.test.ts`: セキュリティヘッダー・CORSテスト
- `apps/api/src/lib/validation.test.ts`: バリデーションテスト
- `apps/api/src/interface/middleware/rateLimit.test.ts`: レート制限テスト
- `packages/ui/src/libs/sanitize.test.ts`: サニタイズテスト

## テスト結果

### apps/api
- 16ファイル、134テストすべて成功

### packages/ui
- 14ファイル、57テストすべて成功

## 残っている課題

1. **本番環境の CORS_ORIGINS 設定**: 環境変数 `CORS_ORIGINS` に本番の admin/web オリジンを設定する必要がある
2. **本番環境の Cloudflare Access**: `infra/src/resources/access.ts` で本番環境のアクセス制御を検討
3. **CSP の導入**: Content-Security-Policy は既存のインラインスクリプト/スタイルとの整合性確認が必要なため、今回は未導入。段階的な導入を推奨
4. **レート制限の永続化**: 現在のメモリベース実装は Worker のインスタンス間で共有されない。Cloudflare Rate Limiting（有料）またはKV/Durable Objects を使用した永続化を検討

## セキュリティ改善サマリー

| 項目 | 改善前 | 改善後 |
|------|--------|--------|
| API認証 | 未適用 | POSTエンドポイントに適用 |
| セキュリティヘッダー | なし | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, X-XSS-Protection |
| CORS | なし | 許可オリジン制限、credentials対応 |
| 入力検証 | なし | slug/UUID形式検証 |
| アップロード検証 | なし | Content-Type, 拡張子, マジックバイト検証 |
| サニタイズ | クライアントのみ | サーバー・クライアント両方 |
| レート制限 | なし | 10リクエスト/分（POSTエンドポイント） |
