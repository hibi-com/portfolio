# Compose 用シークレット（Doppler 同期ソース）

このディレクトリのファイルは docker compose の `secrets` としてコンテナにマウントされ、**infra の Doppler 同期のソース**にもなります。

## ファイル一覧（Doppler 同期対象）

| ファイル               | 環境変数キー       | 利用サービス   |
|------------------------|--------------------|----------------|
| `database_url`         | DATABASE_URL       | api            |
| `redis_url`            | REDIS_URL          | api            |
| `node_env`             | NODE_ENV           | api, web, admin, wiki |
| `api_base_url`         | API_BASE_URL       | admin, web     |
| `better_auth_secret`   | BETTER_AUTH_SECRET | api            |
| `better_auth_url`      | BETTER_AUTH_URL    | api            |
| `google_client_id`     | GOOGLE_CLIENT_ID   | api            |
| `google_client_secret` | GOOGLE_CLIENT_SECRET | api          |
| `cloudflare_account_id` | CLOUDFLARE_ACCOUNT_ID | (infra)     |
| `cloudflare_api_token` | CLOUDFLARE_API_TOKEN | (infra)     |
| `vite_base_url`        | VITE_BASE_URL      | web            |
| `sentry_dsn`           | SENTRY_DSN         | api, web       |
| `sentry_org`           | SENTRY_ORG         | (infra)        |
| `sentry_project`       | SENTRY_PROJECT     | (infra)        |
| `sentry_auth_token`    | SENTRY_AUTH_TOKEN  | (infra)        |
| `app_version`          | APP_VERSION        | api            |

## Secret Manager に載せない項目（compose environment のみ）

次の項目は **compose の `environment` に直書き**しており、.docker/secrets には置きません。

- `VITE_GOOGLE_ANALYTICS_ENABLED`
- `VITE_GOOGLE_TAG_MANAGER_ENABLED`
- `VITE_XSTATE_INSPECTOR_ENABLED`
- `VITE_SENTRY_ENVIRONMENT`
- `VITE_SENTRY_TRACES_SAMPLE_RATE`
- `VITE_SENTRY_REPLAY_SAMPLE_RATE`
- `VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE`

## 初回セットアップ

`bun run workspace setup` で不足しているファイルだけ開発用デフォルトが作成されます。手動で作る場合は 1 行 1 ファイル（改行なし）。

```bash
echo -n "mysql://user:password@tidb:4000/portfolio" > .docker/secrets/database_url
echo -n "redis://:password@cache:6379"              > .docker/secrets/redis_url
# ... 他も同様
```

## Doppler への同期

infra で `syncDopplerSecrets: true` のとき、`pulumi up` がこのディレクトリの内容を Doppler に反映します。

```bash
# .docker/secrets/ を編集したあと
cd infra && pulumi up
```

## 注意

- このディレクトリ内のファイル（README.md を除く）は `.gitignore` で除外し、リポジトリにコミットしないこと。
