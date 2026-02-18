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
- [x] ビルド成果物がBackblaze B2に存在することを確認
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
- [ ] Backblaze B2にartifactが存在
- [ ] Cloudflare環境変数が設定済み
- [ ] データベースマイグレーションが適用済み（必要な場合）

### デプロイ中

- [ ] CircleCI workflow `deploy-{environment}` が正常に実行
- [ ] Cloudflare Pages/Workersへのデプロイが成功

### デプロイ後

- [ ] 各アプリのURLにアクセス可能
- [ ] ヘルスチェックが正常
- [ ] Sentry/Grafana Cloudでエラーがないことを確認

## トラブルシューティング

### Backblaze B2からのダウンロード失敗

**エラー**: `Failed to download artifacts from B2`

**原因**:

- B2認証情報が正しくない
- Artifactが存在しない
- ネットワークエラー

**解決策**:

1. CircleCIのContext設定を確認
2. B2バケットにファイルが存在するか確認
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
- [Backblaze B2 Console](https://secure.backblaze.com/)
