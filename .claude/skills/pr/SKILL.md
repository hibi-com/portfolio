---
name: pr
description: GitHub Pull Requestを作成します。
argument-hint: "[base-branch]"
allowed-tools: Bash, Read, Glob, Grep
---

# Pull Request Skill

GitHub Pull Requestを作成します。

## 使用方法

```text
/pr              # develop ブランチへのPR作成
/pr feature      # feature ブランチへのPR作成
/pr master       # 使用禁止
```

## 参考ドキュメント

ブランチ戦略、PR作成のベストプラクティスについては以下を参照：

- [Git Commitガイド](docs/development/git-commit.md) - コミット形式、ブランチ戦略
