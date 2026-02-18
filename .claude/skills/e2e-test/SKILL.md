---
name: e2e-test
description: E2Eテスト（Large Tests）をPlaywrightで実行します。特定のアプリやテストファイルを指定可能。
argument-hint: "[web|admin|file-pattern]"
allowed-tools: Bash, Read, Glob, Grep
---

# E2E Test Skill

E2Eテスト（Large Tests）をPlaywrightで実行します。

## 使用方法

```text
/e2e-test                              # 全テスト実行
/e2e-test web                          # apps/web のみ
/e2e-test admin                        # apps/admin のみ
/e2e-test browse-blog                  # 特定テストファイル
/e2e-test --ui                         # UIモード（デバッグ用）
```

## 実行コマンド

ルートの package.json の script を利用し、オプション・ファイルは `--` で渡す。

```bash
# 全テスト
bun run e2e

# 特定アプリ（--filter でパッケージ指定）
bun run e2e --filter=@portfolio/web
bun run e2e --filter=@portfolio/admin

# 特定ファイル・オプション（-- の後に渡す）
bun run e2e --filter=@portfolio/web -- e2e/large/visitor/browse-blog.large.spec.ts
bun run e2e --filter=@portfolio/web -- --ui
bun run e2e --filter=@portfolio/web -- --headed
bun run e2e --filter=@portfolio/web -- --update-snapshots

# レポート表示（show-report は各アプリの e2e 実行後、パッケージ内で実行）
bun run e2e --filter=@portfolio/web -- --show-report
```

## 前提条件

開発サーバーが起動している必要があります：

```bash
bun run dev
```

## 参考ドキュメント

詳細なテスト戦略、POM、ユーザーストーリー連携については以下を参照：

- [テスト戦略](../../docs/testing/testing-strategy.md) - Google Test Sizes、Large Testsとユーザーストーリーの対応
- [テストガイド](../../docs/testing/testing-guide.md) - Large Tests、ページオブジェクトモデル
- [E2E Docker環境](../../docs/development/e2e-docker.md) - Docker Composeを使ったE2E環境構築
