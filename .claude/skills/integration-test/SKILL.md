---
name: integration-test
description: 統合テスト（Medium Tests）を実行します。シーケンス図と1:1で対応するテストです。
argument-hint: "[domain]"
allowed-tools: Bash, Read, Glob, Grep
---

# Integration Test Skill

統合テスト（Medium Tests）を実行します。

## 使用方法

```text
/integration-test           # 全統合テスト実行
/integration-test post      # Post ドメインのみ
/integration-test crm       # CRM ドメインのみ
```

## 実行コマンド

```bash
bun run integration

# 特定ドメイン
bun run integration --filter={domain}
```

## 参考ドキュメント

詳細なテスト戦略、シーケンス図との対応については以下を参照：

- [テスト戦略](../../docs/testing/testing-strategy.md) - Google Test Sizes、Medium Testsとシーケンス図の対応
- [テストガイド](../../docs/testing/testing-guide.md) - Medium Testsの書き方、テストハニカム
