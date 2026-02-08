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

### 全体

```bash
bun run typecheck
```

### 特定アプリ/パッケージ

```bash
# Turborepoフィルター
turbo run typecheck --filter=@portfolio/api
turbo run typecheck --filter=@portfolio/web
turbo run typecheck --filter=@portfolio/db
```

### 依存パッケージ含む

```bash
turbo run typecheck --filter=@portfolio/api...
```

### ウォッチモード（手動）

```bash
cd apps/api && bun tsc --watch --noEmit
```

## パッケージ一覧

| パッケージ | パス | 説明 |
| ---------- | ---- | ---- |
| @portfolio/api | apps/api | APIサーバー |
| @portfolio/web | apps/web | Webフロントエンド |
| @portfolio/admin | apps/admin | 管理画面 |
| @portfolio/db | packages/db | Prismaスキーマ |
| @portfolio/api-client | packages/api | APIクライアント |
| @portfolio/validation | packages/validation | バリデーション |
| @portfolio/auth | packages/auth | 認証 |
| @portfolio/ui | packages/ui | UIコンポーネント |

## エラー解析

型エラーが発生した場合：

1. **エラー箇所の特定**: ファイルと行番号を確認
2. **型定義の確認**: 関連する型定義ファイルを参照
3. **修正提案**: 型アサーション、型ガード、型定義の修正

## よくあるエラーと対処

| エラー | 原因 | 対処 |
| ------ | ---- | ---- |
| Type 'X' is not assignable to 'Y' | 型の不一致 | 型定義の確認・修正 |
| Property 'X' does not exist | プロパティ未定義 | 型定義に追加 |
| Cannot find module | インポートパス誤り | パス確認・tsconfig確認 |
| Argument of type 'X' is not assignable | 引数型不一致 | 型アサーションまたは型修正 |

## tsconfig構成

```text
tsconfig.json               # ルート（参照設定）
├── apps/api/tsconfig.json
├── apps/web/tsconfig.json
├── apps/admin/tsconfig.json
└── packages/*/tsconfig.json
```
