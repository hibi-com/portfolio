# 2026-07-24: E2E / シナリオテスト分離

## 背景

リポジトリ内 Playwright はローカルと同質で、真の外部 E2E ではない。ユーザー方針に従い分離した。

## 変更

1. `apps/e2e` → `apps/scenario`（`@portfolio/scenario`）
   - シナリオテスト用。Worker/Pages デプロイ対象から除外（portal Pages / DNS 削除）
   - `bun run scenario` / CircleCI job `scenario`
   - Docker イメージ `.docker/scenario`（旧 `.docker/e2e`）

2. 新規 `apps/e2e`（`@portfolio/e2e`）
   - Cloudflare Worker + Browser binding + `@cloudflare/playwright`
   - デプロイ済みアプリへクリティカルシナリオを実行
   - `bun run e2e` / CircleCI Context `e2e`（`E2E_BASE_URL`, `E2E_TOKEN`）
   - デプロイ検証・post-deploy で利用

## 構成

```
CircleCI → E2E Worker → Browser Run (Playwright) → デプロイ済み App
```

参照: https://developers.cloudflare.com/browser-run/playwright/

## 残作業（運用）

- KV namespace 作成と `apps/e2e/wrangler.toml` の id 更新
- `wrangler secret put E2E_TOKEN`
- CircleCI Context `e2e` 設定
- E2E Worker デプロイ
