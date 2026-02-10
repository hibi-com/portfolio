---
name: commit
description: 変更をコミットします。Conventional Commits形式でコミットメッセージを生成します。
argument-hint: "[message]"
allowed-tools: Bash, Read, Glob, Grep
---

# Commit Skill

Git コミットを実行します。

## 使用方法

```text
/commit                    # 自動でコミットメッセージ生成
/commit "fix: bug修正"     # 指定メッセージでコミット
```

## 実行手順

1. `git status` で変更ファイルを確認
2. `git diff` で変更内容を確認
3. 変更内容からコミットメッセージを生成
4. `git add` で必要なファイルをステージング
5. `git commit` でコミット実行

## 注意事項

- `.env`, `credentials` などの機密ファイルはコミットしない
- デバッグログは削除してからコミット
- `--no-verify` は使用しない

## 参考ドキュメント

Conventional Commitsの詳細、タイプ選択ガイドについては以下を参照：

- [Git Commitガイド](docs/development/git-commit.md) - コミットタイプ一覧、メッセージの書き方
