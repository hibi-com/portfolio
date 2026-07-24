# E2E (Cloudflare Browser Run)

デプロイ済みアプリケーションに対し、Cloudflare Worker から [Browser Run + Playwright](https://developers.cloudflare.com/browser-run/playwright/) で外部 E2E を実行します。

リポジトリ内 Playwright（旧 `apps/e2e`）は **シナリオテスト**（`apps/scenario`）へ分離しています。シナリオテストは Worker デプロイ不要で、ローカル / CircleCI 上で実行します。

## 構成

```
CircleCI
  │
  ▼
E2E 実行用 Cloudflare Worker (@portfolio/e2e)
  │
  ▼
Cloudflare Browser Run
  └─ Headless Chrome + @cloudflare/playwright
  │
  ▼（インターネット経由）
デプロイ済み Application Workers / Pages
```

## いつ動くか

CircleCI では **rc / stg / prd へのアプリケーションリリース（`deploy-*`）直後** に実行します。

```
deploy-rc  → e2e-rc  →（承認）→ … → deploy-stg → e2e-stg →（承認）→ … → deploy-prd → e2e-prd
```

リリース前の validate / smoke では E2E は走らせません。

## セットアップ

```bash
# KV
wrangler kv namespace create RUNS
# wrangler.toml の id を更新

# Secret
wrangler secret put E2E_TOKEN

# デプロイ
bun run --filter=@portfolio/e2e build   # dry-run
cd apps/e2e && bunx wrangler deploy
```

CircleCI Context `e2e` に以下を設定:

- `E2E_BASE_URL` … E2E Worker の URL
- `E2E_TOKEN` … Bearer トークン

## 実行

```bash
# STG 向け
bun run e2e -- \
  --web-base-url https://stg.www.ageha734.jp \
  --api-base-url https://stg.api.ageha734.jp

# または環境変数
E2E_BASE_URL=... E2E_TOKEN=... \
E2E_WEB_BASE_URL=... E2E_API_BASE_URL=... \
  bun run --filter=@portfolio/e2e orchestrate
```

## API

- `POST /runs` … `{ webBaseUrl, apiBaseUrl }` でクリティカルシナリオ実行
- `GET /runs/:id` … 結果参照
- `GET /health` … ヘルスチェック
