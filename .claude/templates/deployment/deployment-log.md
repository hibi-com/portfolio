# デプロイ履歴ログ

**日付**: {DATE}
**環境**: {ENVIRONMENT} (rc / stg / prd)
**実行者**: {EXECUTOR}
**コミットSHA**: {COMMIT_SHA}
**CircleCI Build**: {BUILD_NUMBER}

## デプロイ対象

| アプリ | バージョン | デプロイ先 |
| ------ | ---------- | ---------- |
| web | {WEB_VERSION} | Cloudflare Pages |
| admin | {ADMIN_VERSION} | Cloudflare Pages |
| wiki | {WIKI_VERSION} | Cloudflare Pages |
| api | {API_VERSION} | Cloudflare Workers |

## デプロイ手順

### 1. 事前確認

- [x] 全テストが通過していることを確認
- [x] ビルド成果物が CircleCI Artifacts / workspace に存在することを確認
- [x] 環境変数がCloudflareに設定されていることを確認

### 2. デプロイ実行

```bash
# CircleCIで自動実行
# workflow: deploy-{environment}
```

**実行時刻**: {START_TIME}
**完了時刻**: {END_TIME}
**所要時間**: {DURATION}

### 3. デプロイ結果

| アプリ | 状態 | URL | 備考 |
| ------ | ---- | --- | ---- |
| web | {WEB_STATUS} | {WEB_URL} | {WEB_NOTE} |
| admin | {ADMIN_STATUS} | {ADMIN_URL} | {ADMIN_NOTE} |
| wiki | {WIKI_STATUS} | {WIKI_URL} | {WIKI_NOTE} |
| api | {API_STATUS} | {API_URL} | {API_NOTE} |

## デプロイ後確認

- [ ] 各アプリが正常に起動していることを確認
- [ ] ヘルスチェックエンドポイントが200を返すことを確認
- [ ] エラーログに異常がないことを確認
- [ ] パフォーマンスが期待通りであることを確認

## エラー・警告

{ERRORS_WARNINGS}

## ロールバック

{ROLLBACK_INFO}

## 備考

{NOTES}

## チェックリスト

### デプロイ前

- [ ] `bun run check` で全品質チェックが通過
- [ ] CircleCI Artifacts に artifact が存在（またはデプロイ workflow で再ビルド）
- [ ] Cloudflare環境変数が設定済み
- [ ] D1 マイグレーションが適用済み（必要な場合）

### デプロイ中

- [ ] CircleCI workflow `deploy-{environment}` が正常に実行
- [ ] Cloudflare Pages/Workersへのデプロイが成功

### デプロイ後

- [ ] 各アプリのURLにアクセス可能
- [ ] ヘルスチェックが正常
- [ ] Sentryでエラーがないことを確認

## トラブルシューティング

### CircleCI Artifacts からの取得失敗

**エラー**: `Failed to download / restore artifacts`

**原因**:

- 上流の build ジョブが失敗している
- workspace / Artifacts に成果物が無い
- ネットワークエラー

**解決策**:

1. CircleCI の build ジョブと `store_artifacts` / `persist_to_workspace` を確認
2. Artifacts タブにファイルがあるか確認
3. CircleCIジョブを再実行

### Cloudflareデプロイ失敗

**エラー**: `wrangler deploy failed`

**原因**:

- Cloudflare API認証エラー
- プロジェクト名が間違っている
- 環境変数が不足

**解決策**:

1. Cloudflare APIトークンを確認
2. `wrangler.toml` の設定を確認
3. Cloudflare環境変数を確認（`env.yaml`から設定）

## 参考リンク

- [デプロイ手順書](../../logs/deployment)
- [CircleCI設定](.circleci/config.yml)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [Sentry](https://sentry.io/)
