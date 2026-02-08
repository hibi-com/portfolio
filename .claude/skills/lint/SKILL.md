---
name: lint
description: コードのリントを実行し、スタイルと品質をチェックします。
argument-hint: "[--fix]"
allowed-tools: Bash, Read, Glob
---

# Lint Skill

コードのリント（静的解析）を実行します。

## 使用方法

```text
/lint           # リントチェック（修正なし）
/lint --fix     # リントエラーを自動修正
```

## 実行コマンド

### チェックのみ

```bash
bun run lint
```

### 自動修正

```bash
bun run lint:fix
```

## リントツール

このプロジェクトでは以下のツールを使用:

- **Biome**: TypeScript/JavaScript のリント・フォーマット
- **Sherif**: Monorepo の依存関係チェック
- **Syncpack**: パッケージバージョン整合性チェック
- **ShellCheck**: シェルスクリプトのリント
- **actionlint**: GitHub Actions のリント

## エラー対応

### よくあるエラー

1. **未使用インポート**: 使用していないインポートを削除
2. **型エラー**: 適切な型を追加
3. **フォーマット**: `bun run fmt` で自動修正
4. **依存関係不整合**: `bun install` で解決

### 特定パッケージのリント

```bash
turbo run lint --filter=@portfolio/{package-name}
```
