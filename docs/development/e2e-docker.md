---
title: "E2Eテスト実行ガイド"
---

このドキュメントでは、Playwrightを使用したE2Eテスト（Large Tests）の実行方法を説明します。

## 概要

- **テストフレームワーク**: Playwright
- **実行方法**: Turborepo経由（並列実行）
- **対象アプリ**: `apps/web`, `apps/admin`, `apps/e2e`, `apps/api`
- **共通設定**: `@portfolio/playwright-config` パッケージ

## 実行方法

### 1. 基本的なE2Eテスト実行（推奨）

開発サーバーを起動してからE2Eテストを実行します：

```bash
# 開発サーバー起動（Docker Compose使用）
bun run dev

# 別ターミナルでE2Eテスト実行
bun run e2e
```

または、CI環境では本番ビルドから実行：

```bash
# 本番ビルド
bun run build

# E2Eテスト実行
bun run e2e
```

### 2. 特定アプリのE2Eテスト

```bash
# Webアプリのみ
bun run e2e --filter=@portfolio/web

# 管理画面のみ
bun run e2e --filter=@portfolio/admin

# E2Eアプリのみ
bun run e2e --filter=@portfolio/e2e

# APIのみ
bun run e2e --filter=@portfolio/api
```

### 3. 特定テストファイル・オプション指定

`--` の後にPlaywrightオプションを渡します：

```bash
# 特定ファイル
bun run e2e --filter=@portfolio/web -- e2e/large/visitor/browse-blog.large.spec.ts

# UIモード（デバッグ用）
bun run e2e --filter=@portfolio/web -- --ui

# ヘッドレスモードをOFF
bun run e2e --filter=@portfolio/web -- --headed

# スナップショット更新
bun run e2e --filter=@portfolio/web -- --update-snapshots

# レポート表示
bun run e2e --filter=@portfolio/web -- --show-report
```

### 4. ブラウザ指定

```bash
# Chromiumのみ
bun run e2e --filter=@portfolio/web -- --project=chromium

# 全ブラウザ
bun run e2e --filter=@portfolio/web -- --project=chromium --project=firefox --project=webkit
```

### 5. リトライ設定

```bash
# 失敗したテストを2回リトライ
bun run e2e --filter=@portfolio/web -- --retries=2
```

## Playwright設定

### 共通設定パッケージ

`@portfolio/playwright-config` パッケージで以下を共通化：

- ベースURL設定
- タイムアウト設定
- レポート出力先
- Webサーバー起動設定
- ブラウザプロジェクト設定

### 各アプリの設定ファイル

| アプリ | 設定ファイル | テストディレクトリ |
| ------ | ------------ | ------------------ |
| Web | `apps/web/playwright.config.ts` | `apps/web/e2e/` |
| Admin | `apps/admin/playwright.config.ts` | `apps/admin/e2e/` |
| E2E | `apps/e2e/playwright.config.ts` | `apps/e2e/e2e/` |
| API | `apps/api/playwright.config.ts` | `apps/api/e2e/` |

### 環境変数

| 変数 | 説明 | デフォルト |
| ---- | ---- | ---------- |
| `BASE_URL` | テスト対象のベースURL | `http://localhost:3000` |
| `CI` | CI環境フラグ | `false` |
| `PORT` | 開発サーバーのポート | `3000` |
| `REPORT_OUTPUT_DIR` | レポート出力先 | `../e2e/public/reports/e2e/{app}` |

## Docker を使った実行（オプション）

**注意**: 通常は `bun run e2e` で実行してください。Docker実行は特殊な環境やCI/CDで必要な場合のみ使用します。

### Dockerイメージのビルド

```bash
docker build -t e2e -f .docker/e2e/Dockerfile .
```

### コンテナの実行

```bash
# 基本実行
docker run --rm \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  e2e

# 特定アプリ
docker run --rm \
  -e CI=true \
  -v $(pwd):/work \
  -w /work \
  e2e \
  bun run e2e --filter=@portfolio/web
```

### Docker環境変数

| 変数 | 説明 | デフォルト |
| ---- | ---- | ---------- |
| `SKIP_BUILD` | ビルドをスキップ | `false` |
| `SKIP_SECURITY_SCAN` | セキュリティスキャンをスキップ | `false` |
| `PLAYWRIGHT_BROWSERS_PATH` | ブラウザパス | `/ms-playwright` |

## CI/CD統合

### CircleCI

CircleCIでは `bun run e2e` を直接実行：

```yaml
# .circleci/config.yml
e2e:
  docker:
    - image: cimg/node:22.13
  steps:
    - checkout
    - run:
        name: Install Bun
        command: curl -fsSL https://bun.sh/install | bash
    - run:
        name: Install dependencies
        command: bun install
    - run:
        name: Build
        command: bun run build
    - run:
        name: Run E2E tests
        command: bun run e2e
```

実際の設定は `.circleci/config.yml` を参照してください。

## テスト結果

### レポート確認

```bash
# HTMLレポートを開く（Web）
open apps/e2e/public/reports/e2e/web/index.html

# HTMLレポートを開く（Admin）
open apps/e2e/public/reports/e2e/admin/index.html
```

### レポート出力先

```text
apps/e2e/public/reports/e2e/
├── web/           # Webアプリのレポート
├── admin/         # 管理画面のレポート
├── e2e/           # E2Eアプリのレポート
└── api/           # APIのレポート
```

## トラブルシューティング

### 開発サーバーが起動していない

**エラー**: `Failed to setup localhost`

**解決策**:

```bash
# 開発サーバーを起動
bun run dev
```

### ポート衝突

**エラー**: `Port 3000 is already in use`

**解決策**:

```bash
# 使用中のポートを確認
lsof -i :3000

# プロセスを終了
kill -9 <PID>

# または、別のポートを使用
PORT=3001 bun run dev
```

### テストがタイムアウトする

**解決策**:

```bash
# タイムアウトを延長
bun run e2e --filter=@portfolio/web -- --timeout=60000
```

### ブラウザが見つからない

**解決策**:

```bash
# Playwrightブラウザをインストール
bunx playwright install --with-deps
```

### スナップショットの差異

**解決策**:

```bash
# スナップショットを更新
bun run e2e --filter=@portfolio/web -- --update-snapshots
```

## ベストプラクティス

### 1. デバッグには UIモードを使用

```bash
bun run e2e --filter=@portfolio/web -- --ui
```

### 2. 並列実行でパフォーマンス向上

Turborepoが自動的に並列実行しますが、ワーカー数を指定することも可能：

```bash
bun run e2e --filter=@portfolio/web -- --workers=4
```

### 3. CI環境では production ビルドを使用

```bash
# 本番ビルド
bun run build

# E2Eテスト実行
CI=true bun run e2e
```

### 4. 失敗したテストのみ再実行

```bash
bun run e2e --filter=@portfolio/web -- --last-failed
```

## テストサイズとドキュメント対応

| テストサイズ | 対応ドキュメント | 命名規則 |
| ------------ | ---------------- | -------- |
| Small Tests | コード内JSDoc | `*.test.ts` |
| Medium Tests | `docs/sequence/` シーケンス図 | `*.integration.test.ts` |
| **Large Tests** | **`docs/user-stories/` ユーザーストーリー** | **`*.large.spec.ts`** |

E2Eテストは `docs/user-stories/` のユーザーストーリーと1:1で対応させてください。

## 関連ドキュメント

- [テスト戦略](../testing/testing-strategy.md) - Google Test Sizes、Large Testsとユーザーストーリーの対応
- [テストガイド](../testing/testing-guide.md) - Large Tests、ページオブジェクトモデル
- [Playwright Documentation](https://playwright.dev/)
- [Turborepo Documentation](https://turbo.build/repo/docs)

## スキル

E2Eテスト実行は以下のスキルを使用：

- `/e2e-test` - E2Eテスト実行
