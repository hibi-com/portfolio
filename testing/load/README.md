# 負荷試験設定（STG / Workers）

実体は Cloudflare Workers（`apps/runner`）。Queue 消費者 = Pod。

```bash
bun run loadtest
# または
bun run --filter=@portfolio/runner orchestrate -- --config testing/load/stg.yaml
```

設定は `testing/load/stg.yaml`。正常系のみ。e2e シナリオは使わない。
