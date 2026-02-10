---
name: format
description: Biomeでコードをフォーマットします。特定ファイルやディレクトリを指定可能。
argument-hint: "[file-path|directory]"
allowed-tools: Bash, Read, Glob
---

# Format Skill

Biomeでコードをフォーマットします。

## 使用方法

```text
/format                              # 全体（チェックのみ）
/format --write                      # 全体（修正）
/format apps/api                     # 特定ディレクトリ
/format apps/api/src/index.ts        # 特定ファイル
```

## 実行コマンド

```bash
# チェックのみ
bun run biome format .

# 修正
bun run biome format --write .

# 特定パス
bun run biome format --write apps/api/src/
bun run biome format --write packages/validation/

# Lint と同時実行
bun run biome check --write .
```

## 対象ファイル

| 拡張子 | 対象 |
| ------ | ---- |
| `.ts`, `.tsx` | TypeScript |
| `.js`, `.jsx` | JavaScript |
| `.json` | JSON |
| `.md` | Markdown |

## 参考ドキュメント

フォーマット設定、エディタ統合の詳細については以下を参照：

- [コーディング規約](docs/development/coding-standards.md) - Biome設定、インデント、クォートスタイル
