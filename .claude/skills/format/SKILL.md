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

### チェックのみ

```bash
bun run biome format .
```

### 修正

```bash
bun run biome format --write .
```

### 特定パス

```bash
bun run biome format --write apps/api/src/
bun run biome format --write packages/validation/
```

### 特定ファイル

```bash
bun run biome format --write apps/api/src/index.ts
```

## 対象ファイル

Biomeが処理するファイル：

| 拡張子 | 対象 |
| ------ | ---- |
| `.ts`, `.tsx` | TypeScript |
| `.js`, `.jsx` | JavaScript |
| `.json` | JSON |
| `.md` | Markdown |

## 除外パス

`biome.json`で設定された除外パス：

```text
node_modules/
dist/
build/
.cache/
coverage/
```

## Lint との組み合わせ

フォーマットとLintを同時実行：

```bash
bun run biome check --write .
```

## エディタ統合

### VS Code

保存時に自動フォーマット（`settings.json`）：

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true
}
```

## Claude Code Hook

Write/Edit後に自動でフォーマットが実行されます（`.claude/hooks/format-on-save.sh`）。

## トラブルシューティング

| 問題 | 原因 | 対処 |
| ---- | ---- | ---- |
| フォーマットされない | 除外パスに含まれる | biome.json確認 |
| 構文エラー | ファイル破損 | エラー箇所を修正 |
| 設定が反映されない | キャッシュ | `bun run biome --no-cache` |
