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

### API Medium Tests

```bash
bun vitest run -c apps/api/tests/vitest.medium.config.ts
```

### 特定ドメイン

```bash
bun vitest run -c apps/api/tests/vitest.medium.config.ts --filter={domain}
```

## シーケンス図との対応

Medium Tests は `docs/sequence/api/` のシーケンス図と1:1で対応します。
