# イメージ・ツールのバージョン固定（digest / 固定タグ）

## 方針

- Docker イメージは `tag@sha256:...` で固定
- CircleCI machine イメージは digest 非対応のため日付タグ（`ubuntu-2204:2024.11.1`）で固定
- Orb はセマンティックバージョン固定（既存どおり）

## 更新したもの

| 場所 | 変更 |
|------|------|
| `compose.ci.yaml` | trivy / snyk(node-22) / bun に digest |
| `.docker/db/compose.yml` | libsql-server / bun に digest |
| `.docker/verdaccio/compose.yml` | `5` → `5.4.0@sha256:...` |
| `.circleci/config.yml` | cimg/node を `22.12.0` + digest |
| `apps/*/Dockerfile` 等 | bun / nginx を digest 固定 |
| `.docker/e2e/Dockerfile` | playwright digest、trivy を v0.72.0 固定 |

## 補足

- `ubuntu-2204:2024.11.1` は CircleCI 管理の固定タグ
- 浮動タグ（`latest` / `node` / `alpine-slim` / major only）は排除
