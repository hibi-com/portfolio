# CI 修正: Trivy 権限 / wiki typecheck / syncpack format

## 背景

CircleCI で次の3件が失敗していた。

1. `security-scan`: Trivy を `/usr/local/bin` に入れようとして Permission denied
2. `@portfolio/wiki#typecheck`: Typedoc 生成の `api-reference/assets/*.js` を型チェックして大量エラー
3. `fmt:pkg:check`: `syncpack format --check` が syncpack v13 で未サポート

## 対応

- `.circleci/config.yml`: Trivy / gitleaks を `${HOME}/bin` にインストールし `BASH_ENV` で PATH 追加
- `apps/wiki/tsconfig.json`: `src/content/docs/api-reference/**` を exclude
- `package.json`: `fmt:pkg:check` を `syncpack format` + `git diff --exit-code`（package.json のみ）に変更

## 検証

- `syncpack format` は既存 package.json を追加変更しないことを確認
- CircleCI config の YAML 構文はローカルで確認
