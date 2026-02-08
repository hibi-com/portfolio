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
