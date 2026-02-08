---
name: e2e-test
description: E2Eテスト（Large Tests）をPlaywrightで実行します。特定のアプリやテストファイルを指定可能。
argument-hint: "[web|admin|file-pattern]"
allowed-tools: Bash, Read, Glob, Grep
---

# E2E Test Skill

E2Eテスト（Large Tests）をPlaywrightで実行します。

## 使用方法

```text
/e2e-test                              # 全テスト実行
/e2e-test web                          # apps/web のみ
/e2e-test admin                        # apps/admin のみ
/e2e-test browse-blog                  # 特定テストファイル
/e2e-test --ui                         # UIモード（デバッグ用）
```

## 実行コマンド

### 全テスト

```bash
bun run e2e
```

### 特定アプリ

```bash
# Web
bun --cwd apps/web playwright test

# Admin
bun --cwd apps/admin playwright test
```

### 特定ファイル

```bash
bun --cwd apps/web playwright test e2e/large/visitor/browse-blog.large.spec.ts
```

### UIモード（デバッグ用）

```bash
bun --cwd apps/web playwright test --ui
```

### ヘッドフルモード（ブラウザ表示）

```bash
bun --cwd apps/web playwright test --headed
```

## テストディレクトリ構成

```text
apps/web/e2e/large/
├── visitor/
│   ├── browse-blog.large.spec.ts
│   └── browse-portfolio.large.spec.ts
└── admin/
    └── manage-posts.large.spec.ts

apps/admin/e2e/large/
├── dashboard.large.spec.ts
├── posts.large.spec.ts
└── crm.large.spec.ts
```

## テスト命名規則

- ファイル名: `*.large.spec.ts`
- ユーザーストーリーとの対応: `@story` JSDocで記載

## 前提条件

E2Eテスト実行前に開発サーバーが起動している必要があります：

```bash
# 別ターミナルで
bun run dev
```

## トラブルシューティング

| エラー | 原因 | 対処 |
| ------ | ---- | ---- |
| Timeout | サーバー未起動 | `bun run dev` を実行 |
| Element not found | セレクタ変更 | `data-testid` を確認 |
| Screenshot差分 | UIの変更 | スナップショット更新 |

## スナップショット更新

```bash
bun --cwd apps/web playwright test --update-snapshots
```

## レポート表示

```bash
bun --cwd apps/web playwright show-report
```
