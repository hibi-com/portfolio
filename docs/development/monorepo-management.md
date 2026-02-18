---
title: "モノレポ管理ガイド"
---

このプロジェクトは、Turborepo + Bun Workspacesを使用したモノレポ構造です。このドキュメントでは、モノレポの管理方法について説明します。

## モノレポ構造の概要

### ワークスペース構成

```text
./
├── apps/              # アプリケーション層
│   ├── web/          # Remix + Cloudflare Pages
│   ├── api/          # Hono + Cloudflare Workers
│   ├── admin/        # React + Vite
│   └── wiki/         # Astro + Starlight
├── packages/          # 共通パッケージ層
│   ├── ui/           # Design System
│   ├── api/          # API定義統合
│   ├── db/           # Database (Prisma + D1)
│   └── auth/         # Better-auth共通設定
└── tooling/          # 開発ツール設定
    ├── storybook/    # Storybook共通設定
    ├── config/       # 各種ツールのBase Config
    ├── biome/        # Biome Base Config
    ├── tailwind/     # Tailwind Base Config
    └── tsconfig/      # TypeScript Base Configs
```

## Turborepo の基本操作

### ビルド

```bash
# すべてのワークスペースをビルド
bun run build

# 特定のワークスペースのみビルド
bun run build --filter=@portfolio/web

# 依存関係も含めてビルド
bun run build --filter=@portfolio/web...
```

### テスト

```bash
# すべてのワークスペースのテストを実行
bun run test

# 特定のワークスペースのテストのみ実行
bun run test --filter=@portfolio/web

# 変更されたワークスペースのテストのみ実行
bun run test --filter=...[origin/main]
```

### 開発サーバー

```bash
# すべてのワークスペースの開発サーバーを起動
bun run dev

# 特定のワークスペースの開発サーバーのみ起動
bun run dev --filter=@portfolio/web
```

### キャッシュの活用

Turborepoは、ビルド結果をキャッシュして高速化します。

```bash
# キャッシュをクリア
rm -rf .turbo

# キャッシュを無視してビルド
bun run build --force

# キャッシュの状態を確認
bun run build --dry-run
```

## Bun Workspaces の基本操作

### パッケージの追加

```bash
# ルートにパッケージを追加
bun add package-name

# 特定のワークスペースにパッケージを追加
bun add --filter @portfolio/web package-name

# 開発依存関係として追加
bun add --dev --filter @portfolio/web package-name
```

### パッケージの削除

```bash
# 特定のワークスペースからパッケージを削除
bun remove --filter @portfolio/web package-name
```

### ワークスペース間の依存関係

ワークスペース間で依存関係を設定する場合、`package.json` で `workspace:*` を使用します。

```json
{
  "dependencies": {
    "@portfolio/ui": "workspace:*",
    "@portfolio/db": "workspace:*"
  }
}
```

## パッケージの作成

### 新しいパッケージの追加

1. **ディレクトリの作成**

   ```bash
   mkdir -p packages/new-package
   cd packages/new-package
   ```

2. **package.json の作成**

   ```json
   {
     "name": "@portfolio/new-package",
     "version": "0.0.0",
     "private": true,
     "type": "module",
     "main": "./src/index.ts",
     "types": "./src/index.ts",
     "scripts": {
       "build": "tsc",
       "test": "vitest run",
       "lint": "biome lint .",
       "fmt": "biome format --write ."
     },
     "dependencies": {},
     "devDependencies": {
       "@portfolio/biome-config": "workspace:*",
       "@portfolio/tsconfig": "workspace:*",
       "@portfolio/vitest-config": "workspace:*",
       "typescript": "5.9.3"
     }
   }
   ```

3. ルートの package.json に追加

   ルートの `package.json` の `workspaces` に新しいパッケージを追加します。

   ```json
   {
     "workspaces": [
       "apps/*",
       "packages/*",
       "tooling/*"
     ]
   }
   ```

4. **依存関係のインストール**

   ```bash
   bun install
   ```

## パッケージの検索

### パッケージの場所を確認

```bash
# パッケージの場所を検索
bun run where @portfolio/web

# または、bunを使用
bun pm ls | grep @portfolio/web
```

## 依存関係の管理

### 依存関係の確認

```bash
# すべての依存関係を確認
bun pm ls

# 特定のパッケージの依存関係を確認
bun pm ls --filter @portfolio/web

# 依存関係のバージョンを確認
bun pm outdated
```

### 依存関係の更新

```bash
# すべての依存関係を更新
bun update

# 特定のパッケージを更新
bun update --filter @portfolio/web package-name

# Renovateを使用した自動更新
# .github/renovate.json を参照
```

## ビルドパイプラインの設定

### turbo.json の設定

`turbo.json` でビルドパイプラインを定義します。

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### パイプラインの依存関係

- `dependsOn: ["^build"]`: 依存パッケージのビルドが完了してから実行
- `dependsOn: ["build"]`: 同じワークスペースのビルドが完了してから実行
- `cache: false`: キャッシュを無効化
- `persistent: true`: 長時間実行されるタスク（開発サーバーなど）

## ワークスペース間のインポート

### パスエイリアスの設定

各ワークスペースで、パスエイリアスを設定できます。

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./app/*"],
      "~/shared/*": ["./app/shared/*"]
    }
  }
}
```

### ワークスペースパッケージのインポート

```typescript
// apps/web/app/shared/ui/Button.tsx
import { Button } from "@portfolio/ui";
import { createPrismaClient } from "@portfolio/db";
```

## コード品質ツールの統合

### Biome

Biomeは、フォーマットとリントを統合したツールです。

```bash
# すべてのワークスペースをフォーマット
bun run fmt

# 特定のワークスペースのみフォーマット
bun run fmt --filter=@portfolio/web

# リントチェック
bun run lint
```

### TypeScript

```bash
# すべてのワークスペースの型チェック
bun run typecheck

# 特定のワークスペースのみ型チェック
bun run typecheck --filter=@portfolio/web
```

## デバッグ

### ビルドのデバッグ

```bash
# 詳細なログを出力
bun run build --verbose

# ビルドグラフを表示
bun run build --graph

# 実行されるタスクを確認（実際には実行しない）
bun run build --dry-run
```

### 依存関係のデバッグ

```bash
# 依存関係ツリーを表示
bun pm ls --depth=3

# 循環依存を検出
bun pm ls --cycles
```

## パフォーマンス最適化

### Turborepoキャッシュの活用

Turborepoのキャッシュを最大限に活用します。

```bash
# リモートキャッシュの設定（オプション）
# Vercelやその他のサービスを使用

# キャッシュの状態を確認
bun run build --dry-run
```

### 並列実行

Turborepoは、依存関係に基づいて並列実行を最適化します。

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

## よくある問題

### ワークスペースが見つからない

```bash
# 依存関係を再インストール
bun install

# ワークスペースの設定を確認
cat package.json | grep workspaces
```

### ビルドが失敗する

```bash
# キャッシュをクリア
rm -rf .turbo

# 依存関係を再インストール
rm -rf node_modules
bun install

# 再ビルド
bun run build
```

### 循環依存

```bash
# 循環依存を検出
bun pm ls --cycles

# 依存関係を見直す
# 必要に応じて、依存関係の構造を変更
```

## 参考資料

- [Turborepo ドキュメント](https://turbo.build/repo/docs)
- [Bun Workspaces ドキュメント](https://bun.sh/docs/install/workspaces)
- [Monorepo ベストプラクティス](https://monorepo.tools/)
