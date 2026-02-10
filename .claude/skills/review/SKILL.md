---
name: review
description: コードレビューを実行します。
argument-hint: "[file-path|pr-number]"
allowed-tools: Bash, Read, Glob, Grep
---

# Code Review Skill

コードレビューを実行します。

## 使用方法

```text
/review                    # 現在の変更をレビュー
/review src/api/posts.ts   # 特定ファイルをレビュー
```

## 参考ドキュメント

レビュー基準、コードスタイルのチェックポイントについては以下を参照：

- [コーディング規約](docs/development/coding-standards.md) - フォーマット、命名規則、TypeScript規約
