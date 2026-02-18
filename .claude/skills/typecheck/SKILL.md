---
name: typecheck
description: TypeScript型チェックを実行します。全体または特定パッケージを指定可能。
argument-hint: "[package-name|app-name]"
allowed-tools: Bash, Read, Glob, Grep
---

# TypeCheck Skill

TypeScript型チェックを実行します。

## 使用方法

```text
/typecheck                   # 全体
/typecheck api               # apps/api のみ
/typecheck web               # apps/web のみ
/typecheck db                # packages/db のみ
/typecheck validation        # packages/validation のみ
```

## 実行コマンド

```bash
# 全体
bun run typecheck

# 特定アプリ/パッケージ
bun run typecheck --filter=@portfolio/api
bun run typecheck --filter=@portfolio/web
bun run typecheck --filter=@portfolio/db

# 依存パッケージ含む
bun run typecheck --filter=@portfolio/api...
```

## 参考ドキュメント

TypeScript設定、型定義のベストプラクティスについては以下を参照：

- [コーディング規約](docs/development/coding-standards.md) - 型定義、インポート順序、Props型定義
