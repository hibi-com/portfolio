# Gitleaks allowlist aligned with Trivy ignore

## 方針

- パス除外の SoT: `trivy.yaml`（`skip-dirs` / `skip-files`）
- CVE 単位: `.trivyignore`
- シークレットスキャン: `.gitleaks.toml` の allowlist を上記パスと対応
- ドキュメントのプレースホルダー例（`sk_live_…`）は regex allowlist

## 変更

- `trivy.yaml` / `.trivyignore` / `.gitleaks.toml` 追加
- `compose.ci.yaml` で両設定を明示指定
- `docs/security/guidelines.md` に方針追記

## 確認

`docker compose -f compose.ci.yaml run --rm gitleaks` → no leaks found
