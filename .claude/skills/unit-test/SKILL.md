---
name: unit-test
description: ユニットテスト（Small Tests）を実行します。特定のファイルやパッケージを指定できます。
argument-hint: "[file-pattern|package-name]"
allowed-tools: Bash, Read, Glob, Grep
---

# Unit Test Skill

ユニットテスト（Small Tests）を実行します。

## 使用方法

```text
/unit-test                        # 全テスト実行
/unit-test api                    # apps/api のテストのみ
/unit-test web                    # apps/web のテストのみ
/unit-test formatDate             # 特定のテストファイル
```

## 実行コマンド

### 全テスト

```bash
bun run test
```

### 特定パッケージ

```bash
turbo run test --filter=@portfolio/{package-name}
```

### 特定ファイル

```bash
bun vitest run {file-pattern}
```

### ウォッチモード

```bash
bun vitest
```

## カバレッジ

```bash
bun run coverage
```

### カバレッジ閾値（MC/DC準拠）

| メトリクス | 閾値 |
| ----------- | ------ |
| Lines | 90% |
| Functions | 90% |
| Branches | 100% |
| Statements | 90% |

## テスト命名規則

- ファイル名: `*.test.ts` または `*.test.tsx`
- 配置: ソースファイルと同じディレクトリ

## TDD ワークフロー

1. **Red**: テストを先に書く（失敗確認）
2. **Green**: テストを通過させる最小限のコード
3. **Refactor**: コード品質を改善
