# CircleCI を compose ベースに変更

## 方針

- ツールの curl/wget インストールをやめる
- DB は `compose.yaml`（sqlite / setup-db）
- スキャン・integration 実行は `compose.ci.yaml`

## 変更

### compose.ci.yaml

- `gitleaks` / `trivy` / `snyk` / `integration`（oven/bun:1.1.43）を定義
- `integration` は外部ネットワーク `portfolio_db` 経由で `http://sqlite:8080` に接続

### .circleci/config.yml

- executor `machine-large`（ubuntu + Docker）を追加
- `integration`: `compose.yaml up sqlite` → `setup-db` → `compose.ci.yaml run integration`
- `security-scan`: `compose.ci.yaml run` で gitleaks / trivy / snyk（ホストへツール導入なし）

## 補足

- Trivy の HIGH/CRITICAL ゲート方針自体は未変更（依存更新は別タスク）
- 他ジョブ（format/lint/test 等）の `install-bun` はそのまま
