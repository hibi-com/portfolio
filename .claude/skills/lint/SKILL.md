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

```bash
# チェックのみ
bun run lint

# 自動修正
bun run lint:fix

# 特定パッケージ（lint:ts:check が bun run lint なので -- で filter を渡す）
bun run lint:ts:check -- --filter=@portfolio/{package-name}
```

## リントツール

- **Biome**: TypeScript/JavaScript のリント・フォーマット
- **Sherif**: Monorepo の依存関係チェック
- **Syncpack**: パッケージバージョン整合性チェック
- **ShellCheck**: シェルスクリプトのリント
- **actionlint**: GitHub Actions のリント

## 参考ドキュメント

Biome設定、リントルールの詳細については以下を参照：

- [コーディング規約](docs/development/coding-standards.md) - フォーマット設定、命名規則、インポート順序
