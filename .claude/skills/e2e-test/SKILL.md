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

```bash
# 全テスト
bun run e2e

# 特定アプリ
bun --cwd apps/web playwright test
bun --cwd apps/admin playwright test

# 特定ファイル
bun --cwd apps/web playwright test e2e/large/visitor/browse-blog.large.spec.ts

# UIモード（デバッグ用）
bun --cwd apps/web playwright test --ui

# ヘッドフルモード（ブラウザ表示）
bun --cwd apps/web playwright test --headed

# スナップショット更新
bun --cwd apps/web playwright test --update-snapshots

# レポート表示
bun --cwd apps/web playwright show-report
```

## 前提条件

開発サーバーが起動している必要があります：

```bash
bun run dev
```

## 参考ドキュメント

詳細なテスト戦略、POM、ユーザーストーリー連携については以下を参照：

- [テスト戦略](docs/development/testing.md) - Large Tests、ページオブジェクトモデル、ユーザーストーリー連携
- [E2E Docker環境](docs/development/e2e-docker.md) - Docker Composeを使ったE2E環境構築
