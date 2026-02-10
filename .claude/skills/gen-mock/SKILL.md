---
name: gen-mock
description: MSWを使用したAPIモックを生成します。
argument-hint: "[endpoint]"
allowed-tools: Bash, Read, Write, Glob, Grep
---

# Generate Mock Skill

MSW（Mock Service Worker）を使用したAPIモックを生成します。

## 使用方法

```text
/gen-mock                     # 全エンドポイントのモック生成
/gen-mock /api/posts          # 特定エンドポイントのモック
```

## モック配置先

```text
testing/msw/src/handlers/
```

## 参考ドキュメント

MSWの使い方、テストダブル戦略については以下を参照：

- [テスト戦略](docs/development/testing.md) - Integration Tests、MSWを使ったモック
