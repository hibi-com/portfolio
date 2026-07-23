# DAST / 脆弱性診断（STG 専用）

稼働中エンドポイントに対する動的脆弱性診断。**対象は STG のみ**（PRD / RC 禁止）。

| ツール | 用途 |
| ------ | ---- |
| OWASP ZAP | baseline スキャン（Web） |
| Nuclei | 既知脆弱性テンプレートスキャン（Web / API） |

負荷試験は `testing/k6/`。依存関係スキャンは `compose.ci.yaml` の Trivy / Snyk / Gitleaks。

## 実行

```bash
# 対象ホスト検証
docker compose -f compose.ci.yaml run --rm dast-guard

# ZAP baseline
docker compose -f compose.ci.yaml run --rm zap

# Nuclei
docker compose -f compose.ci.yaml run --rm nuclei
```

レポートはリポジトリルートに出力される（gitignore 済み）。

## 注意

STG が Cloudflare Access で保護されている場合、バイパス用認証情報の設定が必要になることがある。
