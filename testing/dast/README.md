# DAST / 脆弱性診断（STG / Workers）

実体は Cloudflare Workers（`apps/runner`）からのプローブ送信。  
ZAP/Nuclei バイナリは使わず、Worker 内蔵ペイロード（SQLi / XSS 等）で診断する。

```bash
bun run dast
# または
bun run --filter=@portfolio/runner orchestrate -- --config testing/dast/stg.yaml
```

設定は `testing/dast/stg.yaml`（Pod スケール項目は負荷試験と同じキー）。
