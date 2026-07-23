# 負荷試験設定（STG / Workers）

実体は Cloudflare Workers（`apps/runner`）。Queue 消費者 = Pod。

```bash
bun run loadtest
```

## シナリオ

`testing/load/stg.yaml` の `scenarios` に **正常系マルチステップ** を書く。

- Playwright / e2e は使わない（ブラウザ操作ではなく HTTP ステップ）
- 各ステップは `expectStatus` が 2xx であること
- 途中失敗（非 2xx・capture 失敗）でその VU は失敗扱いになり、負荷試験全体も失敗
- `{{var}}` と `capture` でステップ間の ID 引き継ぎが可能

EC サイトなら「会員登録 → ログイン → 購入」のようなシナリオを同じ形式で追加する。  
本リポジトリ（ポートフォリオ）は閲覧・API 読み取り系を定義している。
