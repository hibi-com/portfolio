# STG Runner（負荷試験 / DAST）

Cloudflare Workers + Queues で **Pod 相当の消費者**を増減させ、STG のみにアクセスする。

- 負荷試験: 正常系 **シナリオ**（マルチステップ fetch）。非 2xx が出た時点で失敗（e2e / Playwright は使わない）
- DAST: Worker から SQLi / XSS 等のプローブを送信（ZAP/Nuclei バイナリは使わない）

## 設定

| ファイル | 用途 |
| -------- | ---- |
| `testing/load/stg.yaml` | 負荷試験 |
| `testing/dast/stg.yaml` | 脆弱性診断 |

YAML キーは次のとおり（k8s 感覚の Pod スケール）。

- `peakParallelism` … ピーク時のクラスタ全体並列数
- `opsPerWorker` … 1 Pod あたり OPS（0=無制限）
- `initialWorkers` … 開始時 Pod 数
- `maxWorkers` … 最大 Pod 数（<=300）
- `rampParallelismPerSec` … 並列増加速度（0=一定）
- `duration` … 実行時間（例: `5m`）

## 実行

```bash
# 要: RUNNER_BASE_URL / RUNNER_TOKEN
bun run --filter=@portfolio/runner orchestrate --config testing/load/stg.yaml
bun run --filter=@portfolio/runner orchestrate --config testing/dast/stg.yaml
```

CircleCI の `load-test` / `dast` ジョブが同じオーケストレータを呼ぶ。
