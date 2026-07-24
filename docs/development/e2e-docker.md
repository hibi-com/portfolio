---
title: "シナリオテスト / E2E 実行ガイド"
---

このドキュメントでは、リポジトリ内 Playwright（シナリオテスト）と、Cloudflare Browser Run による真の E2E の違いと実行方法を説明します。

## 用語の整理

| 名称 | 内容 | 実行場所 | Worker デプロイ |
| ---- | ---- | -------- | --------------- |
| **シナリオテスト**（旧 E2E） | リポジトリ内 Playwright。ローカルと同質 | ローカル / CircleCI | 不要 |
| **E2E** | Worker → [Browser Run + Playwright](https://developers.cloudflare.com/browser-run/playwright/) → デプロイ済みアプリ | Cloudflare | `apps/e2e` が必要 |

```
CircleCI
  │
  ▼
E2E 実行用 Cloudflare Worker (@portfolio/e2e)
  │
  ▼
Cloudflare Browser Run
  └─ Headless Chrome + Playwright
  │
  ▼（インターネット経由）
デプロイ済み Application Worker / Pages
```

## シナリオテスト

- **テストフレームワーク**: Playwright
- **実行方法**: Turborepo / Docker（`.docker/scenario`）
- **対象**: `apps/web`, `apps/admin`, `apps/api` の Playwright スイート、および `apps/scenario`（ポータル UI・pkg）
- **共通設定**: `@portfolio/playwright-config`

### 基本実行

```bash
bun run dev          # 開発サーバー
bun run scenario     # シナリオテスト
```

### 特定アプリ

```bash
bun run scenario --filter=@portfolio/web
bun run scenario --filter=@portfolio/admin
bun run scenario --filter=@portfolio/cms
```

### Docker イメージ

```bash
docker build -t scenario -f .docker/scenario/Dockerfile .
```

詳細な Playwright オプション・トラブルシュートは従来どおり `docs/playwright/report` を参照してください。

## E2E（Browser Run）

詳細は [`apps/e2e/README.md`](../../apps/e2e/README.md) を参照。

```bash
# Context / 環境変数: E2E_BASE_URL, E2E_TOKEN
bun run e2e -- \
  --web-base-url https://stg.www.ageha734.jp \
  --api-base-url https://stg.api.ageha734.jp
```

CircleCI では **rc / stg / prd の `deploy-*` 直後**（`e2e-rc` / `e2e-stg` / `e2e-prd`）に Browser Run E2E を実行します。PR CI のゲートはシナリオテストです。
