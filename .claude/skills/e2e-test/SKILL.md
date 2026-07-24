---
name: e2e-test
description: シナリオテスト（リポジトリ内 Playwright）または Browser Run E2E を実行します。
argument-hint: "[scenario|e2e|web|admin|file-pattern]"
allowed-tools: Bash, Read, Glob, Grep
---

# E2E / Scenario Test Skill

- **シナリオテスト**: リポジトリ内 Playwright（ローカル / CircleCI）。Worker デプロイ不要。
- **E2E**: Cloudflare Worker + Browser Run からデプロイ済みアプリへアクセス。

## シナリオテスト

```bash
bun run scenario
bun run scenario --filter=@portfolio/web
bun run scenario --filter=@portfolio/admin
bun run scenario --filter=@portfolio/web -- e2e/browse-blog.spec.ts
bun run scenario --filter=@portfolio/web -- --ui
```

## Browser Run E2E

```bash
bun run e2e -- \
  --web-base-url https://stg.www.ageha734.jp \
  --api-base-url https://stg.api.ageha734.jp
```

前提: `E2E_BASE_URL` / `E2E_TOKEN`（CircleCI Context `e2e`）、および `apps/e2e` Worker のデプロイ。

## 参考

- [シナリオ / E2E ガイド](docs/development/e2e-docker.md)
- [apps/e2e README](apps/e2e/README.md)
- [Browser Run Playwright](https://developers.cloudflare.com/browser-run/playwright/)
