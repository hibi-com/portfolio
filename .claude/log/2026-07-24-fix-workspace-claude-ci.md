# Fix scripts-workspace claude E2E in CI

## 原因

`@portfolio/scripts-workspace` の E2E がオプションの `claude` インストールを検証していた。ローカルは Claude Code があるため通り、CI（CircleCI）には無いため失敗。

## 対応

`pulumi` と同様、既存バイナリが無い場合はスキップ（オプション扱い）。

## 検証

- claude 無し PATH でスキップを確認
- `bun install` / `bun run check` → OK
