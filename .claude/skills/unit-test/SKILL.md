---
name: unit-test
description: ユニットテスト（Small Tests）を実行します。特定のファイルやパッケージを指定できます。
argument-hint: "[file-pattern|package-name]"
allowed-tools: Bash, Read, Glob, Grep
---

# Unit Test Skill

ユニットテスト（Small Tests）を実行します。

## 使用方法

```text
/unit-test                        # 全テスト実行
/unit-test api                    # apps/api のテストのみ
/unit-test web                    # apps/web のテストのみ
/unit-test formatDate             # 特定のテストファイル
```

## 実行コマンド

```bash
bun run test

# 特定パッケージ
bun run test --filter={package}
```

## 参考ドキュメント

詳細なテスト戦略、TDD、カバレッジ目標については以下を参照：

- [テスト戦略](docs/development/testing.md) - テストハニカム、Small Tests作成基準、MC/DCカバレッジ
