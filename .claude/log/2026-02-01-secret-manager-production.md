# Secret Manager（本番環境）連携

## 解釈した仕様

- compose のファイルベース secrets に加え、**Secret Manager（例: AWS Secrets Manager）から環境変数を取得してイメージに渡す**本番環境向けフローを構築する。
- 各イメージ（api / web）には **環境変数優先 → Secret Manager 由来の environment → /run/secrets ファイル** の順で値を注入する。

## 変更したファイル

| ファイル | 変更内容 |
|----------|----------|
| `apps/api/docker-entrypoint.sh` | 既存の環境変数が未設定のときのみ `/run/secrets/*` から読むように変更。 |
| `apps/web/docker-entrypoint.sh` | 同上（NODE_ENV のみ）。 |
| `scripts/secrets/fetch-aws-secrets.sh` | 新規。AWS Secrets Manager からシークレットを取得し、KEY=value 形式で標準出力。env_file や `--env-file` にそのまま渡せる。 |
| `compose.yaml` | api / web に `environment: DATABASE_URL: ${DATABASE_URL:-}` 等を追加。本番で `--env-file .env.production` を渡すとここに注入される。 |
| `.gitignore` | `.env.production` を追加。 |
| `secrets/README.md` | 優先順位、ローカル（ファイル）と本番（Secret Manager）の使い分け、AWS 利用例を追記。 |
| `docs/development/deployment.md` | 「本番環境での Secret Manager（例: AWS Secrets Manager）」セクションを追加。起動手順とスクリプト利用例を記載。 |

## 検証結果

- entrypoint: 環境変数が既に設定されている場合はファイルを読まない。未設定時のみ `/run/secrets/*` を読む。
- compose: `environment: VAR: ${VAR:-}` により、`docker compose --env-file .env.production up` で渡した値がコンテナに渡る。
- `scripts/secrets/fetch-aws-secrets.sh`: aws CLI と jq を前提に、SecretString（JSON オブジェクト）を KEY=value 行に変換。実行権限を付与済み。

## 残っている課題

- AWS Secrets Manager のシークレット名・リージョンは環境ごとに要設定。CI やオーケストレーターでの `fetch-aws-secrets.sh` 呼び出し手順は環境に応じて整備する。
- 他プロバイダ（GCP Secret Manager、Doppler 等）を使う場合は、同様の「KEY=value を出力するスクリプト」を用意し、`--env-file` で compose に渡す形で統一できる。
