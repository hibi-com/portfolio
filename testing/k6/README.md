# k6 負荷試験（STG 専用）

**PRD / RC への負荷試験は禁止。** デフォルト・許可ホストは STG のみ。

```bash
docker compose -f compose.ci.yaml run --rm k6
# または
bun run loadtest

# API を叩く場合（STG のみ）
BASE_URL=https://stg.api.ageha734.jp docker compose -f compose.ci.yaml run --rm -e BASE_URL k6
```

結果はリポジトリルートの `load-test-results.json` に出力される。
