# デプロイ手順書

**重要**: デプロイはCircleCIで自動実行されます。ローカルからの手動デプロイは禁止です。

## デプロイフロー

```
コミット→master → CI実行 → テスト → ビルド → B2アップロード
                                                       ↓
                                    RC環境 ← 手動承認 ← B2ダウンロード
                                    STG環境 ← 日次スケジュール(0:00 UTC)
                                    PRD環境 ← 日次スケジュール(12:00 UTC)
```

## 環境別デプロイ

### RC環境（リリース候補）

**トリガー**: masterブランチへのpush後、手動承認

**手順**:
1. masterブランチにマージ
2. CircleCIで `ci` workflowが実行される
3. テスト→ビルド→B2アップロードが完了
4. `deploy-rc` workflowが起動
5. CircleCIダッシュボードで承認ボタンをクリック
6. RC環境へデプロイ

**URL**:
- Web: https://rc.www.{domain}
- Admin: https://rc.admin.{domain}
- API: https://rc.api.{domain}

### STG環境（ステージング）

**トリガー**: 日次スケジュール（毎日0:00 UTC）

**手順**:
1. 自動的にworkflowが起動
2. テスト実行
3. B2からartifact取得
4. STG環境へデプロイ

**URL**:
- Web: https://stg.www.{domain}
- Admin: https://stg.admin.{domain}
- API: https://stg.api.{domain}

### PRD環境（本番）

**トリガー**: 日次スケジュール（毎日12:00 UTC = 21:00 JST）

**手順**:
1. 自動的にworkflowが起動
2. テスト実行
3. B2からartifact取得
4. PRD環境へデプロイ

**URL**:
- Web: https://www.{domain}
- Admin: https://admin.{domain}
- API: https://api.{domain}

## デプロイログ記録

デプロイ実行後は、以下のテンプレートを使ってログを記録してください：

```bash
# テンプレートをコピー
cp .claude/templates/deployment/deployment-log.md logs/deployment/YYYY-MM-DD-{environment}.md

# ログを記入
# 実行結果、エラー、備考を記載
```

## ローカルからのデプロイ禁止

**理由**:
- 環境変数の漏洩リスク
- デプロイ履歴の追跡不可
- ロールバックが困難
- チーム間の同期が取れない

**例外**: なし

すべてのデプロイはCircleCIを経由してください。

## トラブルシューティング

### デプロイが失敗した場合

1. CircleCIのビルドログを確認
2. エラーメッセージを確認
3. 以下のいずれかを実行：
   - ジョブを再実行
   - 問題を修正してコミット
   - ロールバック

### ロールバック手順

CircleCIから前回のデプロイを再実行：

1. CircleCIダッシュボードを開く
2. 成功した前回のビルドを選択
3. "Rerun workflow from failed" をクリック

または、Cloudflareダッシュボードから直接ロールバック：

```bash
# ローカルで実行（緊急時のみ）
wrangler pages deployment list --project-name portfolio-web
wrangler pages deployment rollback --project-name portfolio-web --deployment-id <id>
```

## デプロイ承認権限

| 環境 | 承認者 | 承認方法 |
| ---- | ------ | -------- |
| RC | 開発者全員 | CircleCIダッシュボード |
| STG | 自動 | スケジュール実行 |
| PRD | 自動 | スケジュール実行 |

## 関連ドキュメント

- [CircleCI設定](../../.circleci/config.yml)
- [CI/CDツール](../../docs/development/ci-cd-tools.md)
- [インフラ仕様書](../../docs/specs/infra/overview.md)

## デプロイ履歴

デプロイ履歴は `logs/deployment/` に記録されます：

```text
logs/deployment/
├── README.md (このファイル)
├── 2025-02-19-rc.md
├── 2025-02-19-stg.md
└── 2025-02-19-prd.md
```
