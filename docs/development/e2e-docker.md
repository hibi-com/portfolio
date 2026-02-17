---
title: "E2E Test Docker Container"
---

# E2E Test Docker Container

Playwright E2Eテスト実行用のDockerコンテナの設定ガイド。

## 概要

`.docker/e2e` ディレクトリには、E2Eテスト実行に必要なDocker設定が含まれています。
このコンテナはマルチステージビルドを使用し、ビルド→セキュリティスキャン→E2Eテストを自動実行します。

## ファイル構成

- **Dockerfile**: マルチステージビルドのDockerイメージ定義（ENTRYPOINTで自動ビルド・セキュリティスキャン・E2Eテスト実行）
- **.dockerignore**: Dockerビルド時に除外するファイル
- **scripts/entrypoint.sh**: ENTRYPOINTスクリプト（ビルド + セキュリティスキャン + E2Eテストを自動実行）

## 使用方法

### イメージのビルド

```bash
docker build -t e2e -f .docker/e2e/Dockerfile .docker/e2e
```

または、プロジェクトルートから：

```bash
docker build -t e2e -f .docker/e2e/Dockerfile .
```

### コンテナの実行

#### 基本的なE2Eテスト実行（推奨）

ENTRYPOINTにより、コンテナ起動時に自動的にビルド→セキュリティスキャン→E2Eテストが実行されます：

```bash
# プロジェクトルートから実行
docker run --rm \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  -v $(pwd)/node_modules:/work/node_modules \
  -v $(pwd)/docs/playwright/report:/work/docs/playwright/report \
  -v $(pwd)/docs/security/e2e:/work/docs/security/e2e \
  e2e

# 特定のアプリから実行
cd apps/web
docker run --rm \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  -v $(pwd)/node_modules:/work/node_modules \
  -v $(pwd)/docs/playwright/report:/work/docs/playwright/report \
  -v $(pwd)/docs/security/e2e:/work/docs/security/e2e \
  e2e
```

または、package.jsonのスクリプトから：

```bash
# プロジェクトルートから
bun run e2e

# 特定のアプリから
cd apps/web
bun run e2e
```

#### 環境変数による制御

ENTRYPOINTスクリプトは以下の環境変数で動作を制御できます：

- `SKIP_BUILD=true`: ビルドをスキップ
- `SKIP_SECURITY_SCAN=true`: セキュリティスキャンをスキップ
- `WORK_DIR`: 作業ディレクトリ（デフォルト: `/work`）
- `REPORT_DIR`: セキュリティレポートの保存先（デフォルト: `/work/docs/security/e2e`）

例：

```bash
# ビルドとセキュリティスキャンをスキップしてE2Eテストのみ実行
docker run --rm \
  -e CI=true \
  -e SKIP_BUILD=true \
  -e SKIP_SECURITY_SCAN=true \
  -v $(pwd):/work \
  -w /work \
  e2e
```

#### 実行される処理

ENTRYPOINTスクリプトは以下を自動実行します：

1. **アプリケーションのビルド**: プロダクションビルドを実行（`SKIP_BUILD=true`でスキップ可能）
2. **セキュリティスキャン**（`SKIP_SECURITY_SCAN=true`でスキップ可能）:
   - Trivyによるファイルシステムスキャン（SAST）
   - Bun auditによる依存関係の脆弱性チェック
3. **E2Eテスト実行**: Playwrightテストを実行（デフォルト: `bun run e2e`）

#### カスタムコマンドの実行

ENTRYPOINTに引数を渡すことで、カスタムコマンドを実行できます：

```bash
docker run --rm \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  e2e \
  bun run e2e -- --ui
```

#### 特定のアプリのE2Eテスト実行

リポジトリルートで実行し、`bun run e2e` の `--filter` でアプリを指定する。

```bash
# リポジトリルートで実行
# WebアプリのE2Eテスト
docker run --rm \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  -v $(pwd)/node_modules:/work/node_modules \
  -v $(pwd)/docs/playwright/report:/work/docs/playwright/report \
  e2e \
  bun run e2e --filter=@portfolio/web

# AdminアプリのE2Eテスト
docker run --rm \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  -v $(pwd)/node_modules:/work/node_modules \
  -v $(pwd)/docs/playwright/report:/work/docs/playwright/report \
  e2e \
  bun run e2e --filter=@portfolio/admin
```

#### Storybookテスト実行

```bash
# Visual regression tests
docker run --rm \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  -v $(pwd)/node_modules:/work/node_modules \
  -v $(pwd)/docs/visual/report:/work/docs/playwright/report \
  e2e \
  bun run e2e -- --config=playwright.storybook.config.ts e2e/storybook/visual

# Accessibility tests
docker run --rm \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  -v $(pwd)/node_modules:/work/node_modules \
  -v $(pwd)/docs/accessibility/report:/work/docs/playwright/report \
  e2e \
  bun run e2e -- --config=playwright.storybook.config.ts e2e/accessibility

# Interaction tests
docker run --rm \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  -v $(pwd)/node_modules:/work/node_modules \
  -v $(pwd)/docs/interactions/report:/work/docs/playwright/report \
  e2e \
  bun run e2e -- --config=playwright.storybook.config.ts e2e/storybook/interactions
```

### 環境変数

以下の環境変数で設定をカスタマイズできます：

- `CI`: CI環境フラグ（デフォルト: `true`）
- `PORT`: テストサーバーのポート（デフォルト: `3000`）
- `NODE_ENV`: Node.js環境（デフォルト: `test`）
- `PLAYWRIGHT_BROWSERS_PATH`: Playwrightブラウザのパス（デフォルト: `/ms-playwright`）
- `TZ`: タイムゾーン（デフォルト: `UTC`）

### ビルド引数

- `BUN_VERSION`: Bunのバージョン（デフォルト: `1.1.43`）

カスタムバージョンでビルドする場合：

```bash
docker build \
  --build-arg BUN_VERSION=1.2.0 \
  -t e2e \
  -f .docker/e2e/Dockerfile \
  .docker/e2e
```

## トラブルシューティング

### ブラウザが見つからないエラー

Playwrightのベースイメージにはブラウザが含まれていますが、問題が発生する場合は：

```bash
docker run --rm e2e playwright install --with-deps
```

### 権限エラー

テスト結果の書き込みで権限エラーが発生する場合：

```bash
# ホスト側でディレクトリの権限を確認
chmod -R 777 docs/playwright/report
```

### ネットワークエラー

テスト中にネットワークエラーが発生する場合、コンテナのネットワーク設定を確認：

```bash
docker run --rm \
  --network host \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  e2e \
  bun run e2e
```

### デバッグモード

コンテナ内で対話的にデバッグする場合：

```bash
docker run --rm -it \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  e2e \
  /bin/bash
```

## パフォーマンス

- マルチステージビルドは使用していません（シンプルな構成のため）
- レイヤーキャッシュを最適化するため、依存関係のインストールを先に行っています
- 不要なファイルは`.dockerignore`で除外されています

## CI/CD統合

### GitHub Actions での使用

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on:
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build E2E Docker image
        run: docker build -t e2e -f .docker/e2e/Dockerfile .

      - name: Run E2E tests
        run: |
          docker run --rm \
            -e CI=true \
            -v $(pwd):/work \
            -w /work \
            e2e

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: docs/playwright/report/
```

### テスト結果の確認

```bash
# HTMLレポートを開く
open docs/playwright/report/index.html

# セキュリティレポートを確認
cat docs/security/e2e/trivy-report.json
```

## ベストプラクティス

### 1. テストの並列実行

```bash
# ワーカー数を指定
docker run --rm \
  -e CI=true \
  -e PLAYWRIGHT_WORKERS=4 \
  -v $(pwd):/work \
  -w /work \
  e2e \
  bun run e2e -- --workers=4
```

### 2. 特定のブラウザでテスト

```bash
# Chromiumのみ
docker run --rm \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  e2e \
  bun run e2e -- --project=chromium

# 全ブラウザ
docker run --rm \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  e2e \
  bun run e2e -- --project=chromium --project=firefox --project=webkit
```

### 3. 失敗したテストのリトライ

```bash
docker run --rm \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  e2e \
  bun run e2e -- --retries=2
```

## 関連ドキュメント

- [Playwright Documentation](https://playwright.dev/)
- [Bun Documentation](https://bun.sh/docs)
- [テストガイドライン](./testing.md)
- [QAシート](../testing/qa-sheet.md)
- [セキュリティガイドライン](../security/guidelines.md)
