# Fix gitleaks read-only report path

## 原因

`compose.ci.yaml` の gitleaks（および trivy / snyk）が `./:/workspace:ro` のまま `--report-path gitleaks-report.json` に書き込もうとしていた。

## 対応

レポート出力が必要なサービスのみ rw マウントに変更。レポート JSON を `.gitignore` に追加。

## 確認

`docker compose -f compose.ci.yaml run --rm gitleaks` → レポート作成成功（FTL 解消）。検知自体で exit 1 は従来どおり。
