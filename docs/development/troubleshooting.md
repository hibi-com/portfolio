---
title: "トラブルシューティングガイド"
---

このドキュメントでは、開発中によく発生する問題とその解決方法をまとめています。**コマンドは bun および `bun run` のみを利用する**（bunx・wrangler の直接実行はしない）。`bun run` で実行できるスクリプトが無い場合は [コマンド追加リスト](../../scripts/command-addition-list.md) の TODO を参照し、ルートの package.json 等にスクリプトを追加すること。

## ビルドエラー

### TypeScriptの型エラー

**問題**: TypeScriptの型チェックでエラーが発生する。

**解決方法**:

```bash
# 型チェックを実行してエラーを確認
bun run typecheck

# 型定義ファイルを再生成（Prismaの場合）
bun run generate

# キャッシュをクリアして再ビルド
bun run clean
bun run build
```

### モジュール解決エラー

**問題**: モジュールが見つからない。

**解決方法**:

```bash
# 依存関係を再インストール
bun install

# 特定のパッケージを再インストール
bun install --filter @portfolio/web

# パスエイリアスの設定を確認
# tsconfig.json の paths 設定を確認
```

### ビルドが失敗する

**問題**: ビルドコマンドが失敗する。

**解決方法**:

```bash
# キャッシュをクリア
bun run clean

# node_modulesを削除して再インストール
rm -rf node_modules
bun install

# Turborepoのキャッシュをクリア
rm -rf .turbo

# 再ビルド
bun run build
```

## 開発サーバーの問題

### 開発サーバーが起動しない

**問題**: `bun run dev` で開発サーバーが起動しない。

**解決方法**:

```bash
# ポートが使用中か確認
lsof -i :3000

# 別のポートで起動
PORT=3001 bun run dev

# 環境変数を確認
cat .env

# ログを確認
bun run dev --verbose
```

### Hot Module Replacement (HMR) が動作しない

**問題**: コード変更が反映されない。

**解決方法**:

```bash
# ブラウザのキャッシュをクリア
# Chrome DevTools > Application > Clear storage

# 開発サーバーを再起動
# Ctrl+C で停止してから再起動

# Viteのキャッシュをクリア
rm -rf node_modules/.vite
```

### メモリ不足エラー

**問題**: メモリ不足でエラーが発生する。

**解決方法**:

```bash
# Node.jsのメモリ制限を増やす
NODE_OPTIONS="--max-old-space-size=4096" bun run dev

# または、Bunのメモリ制限を増やす
BUN_MAX_HEAP_SIZE=4096 bun run dev
```

## データベースの問題

### D1データベースに接続できない

**問題**: D1データベースへの接続が失敗する。

**解決方法**:

D1 の一覧取得・SQL 実行は現在 `bun run` で実行するスクリプトがない。[コマンド追加リスト](../../scripts/command-addition-list.md) の TODO を参照し、必要ならルートまたは apps/api にスクリプトを追加する。設定は `apps/api/wrangler.toml` を確認する。

### Prismaマイグレーションエラー

**問題**: Prismaマイグレーションが失敗する。

**解決方法**:

マイグレーションの実行は `bun run migrate --filter=@portfolio/db` で行う。状態確認（status）・リセット（reset）・再適用（deploy）は [コマンド追加リスト](../../scripts/command-addition-list.md) の TODO を参照し、必要なら `bun run` で実行できるスクリプトを追加する。

### スキーマの変更が反映されない

**問題**: Prismaスキーマを変更しても反映されない。

**解決方法**:

Prisma Client の再生成は `bun run generate --filter=@portfolio/db`。マイグレーションの新規作成・適用（migrate dev）は [コマンド追加リスト](../../scripts/command-addition-list.md) の TODO を参照し、必要なら `bun run` で実行できるスクリプトを追加する。

## テストの問題

### テストが実行されない

**問題**: `bun run test` でテストが実行されない。

**解決方法**:

```bash
# テストファイルのパスを確認
# vitest.config.ts の testDir 設定を確認

# 特定のテストファイルを実行（ルートの script、ファイルは -- で渡す）
bun run test -- path/to/test.test.ts

# ウォッチモードで実行
bun run test -- --watch
```

### テストが失敗する

**問題**: テストが失敗する。

**解決方法**:

```bash
# 詳細なログを出力（-- で引数を渡す）
bun run test -- --reporter=verbose

# 特定のテストのみ実行
bun run test -- -t "test name"

# カバレッジレポートを確認
bun run coverage
```

### E2Eテストが失敗する

**問題**: PlaywrightのE2Eテストが失敗する。

**解決方法**:

```bash
# 開発サーバーが起動しているか確認
bun run dev

# テストをヘッドモードで実行（ブラウザを表示。-- でオプションを渡す）
bun run e2e -- --headed

# デバッグモードで実行
bun run e2e -- --debug

# スクリーンショットを確認
open .results/playwright/
```

## 環境変数の問題

### 環境変数が読み込まれない

**問題**: 環境変数が読み込まれない。

**解決方法**:

```bash
# .env ファイルが存在するか確認
ls -la .env

# .env.example からコピー
cp .env.example .env

# 環境変数の値を確認
cat .env

# アプリケーションを再起動
```

### Cloudflare環境で環境変数が設定されない

**問題**: Cloudflare Pages/Workersで環境変数が設定されない。

**解決方法**:

シークレット一覧・設定は現在 `bun run` で実行するスクリプトがない。[コマンド追加リスト](../../scripts/command-addition-list.md) の TODO を参照し、必要ならルートまたは対象アプリにスクリプトを追加する。設定は対象の `wrangler.toml` を確認する。

## パッケージ管理の問題

### 依存関係のエラー

**問題**: パッケージの依存関係でエラーが発生する。

**解決方法**:

```bash
# 依存関係を再インストール
bun install

# ロックファイルを削除して再インストール
rm bun.lockb
bun install

# 特定のパッケージを再インストール
bun install --force @portfolio/web
```

### ワークスペースの依存関係エラー

**問題**: ワークスペース間の依存関係でエラーが発生する。

**解決方法**:

```bash
# ワークスペースの依存関係を確認
bun install --filter @portfolio/web

# すべてのワークスペースを再ビルド
bun run build

# パッケージのリンクを確認
bun pm ls
```

## デプロイメントの問題

### デプロイが失敗する

**問題**: Cloudflare Pages/Workersへのデプロイが失敗する。

**解決方法**:

ビルドの確認は `bun run build`。デプロイ実行は `bun run deploy` を使う。Wrangler の認証確認（whoami）・デプロイの詳細ログ・シークレット一覧は現在 `bun run` で実行するスクリプトがないため、[コマンド追加リスト](../../scripts/command-addition-list.md) の TODO を参照し、必要ならスクリプトを追加する。

### ビルドがタイムアウトする

**問題**: ビルドがタイムアウトする。

**解決方法**:

```bash
# ビルド時間を短縮
# - 不要な依存関係を削除
# - コード分割を活用
# - キャッシュを活用

# Turborepoのキャッシュを無視して再ビルド
bun run build -- --force
```

## パフォーマンスの問題

### ビルドが遅い

**問題**: ビルドに時間がかかる。

**解決方法**:

```bash
# Turborepoのキャッシュを活用
bun run build

# 並列ビルドの設定を確認
cat turbo.json

# 不要な依存関係を削除
bun run knip
```

### 開発サーバーが遅い

**問題**: 開発サーバーの起動やHMRが遅い。

**解決方法**:

```bash
# Viteのキャッシュをクリア
rm -rf node_modules/.vite

# 不要なファイルを除外
# vite.config.ts の optimizeDeps 設定を確認

# メモリを増やす
NODE_OPTIONS="--max-old-space-size=4096" bun run dev
```

## リンター・フォーマッターの問題

### Biomeのエラー

**問題**: Biomeのリント・フォーマットエラーが発生する。

**解決方法**:

```bash
# 自動修正を実行
bun run lint:fix
bun run fmt

# 設定ファイルを確認
cat biome.json

# 特定のファイルのみチェック（ルートの lint / fmt:check。パッケージ指定は -- で）
bun run lint -- --filter=@portfolio/api
bun run fmt:check -- --filter=@portfolio/api
```

### フォーマットが適用されない

**問題**: コードフォーマットが適用されない。

**解決方法**:

```bash
# フォーマットを強制実行
bun run fmt

# 設定ファイルを確認
cat biome.json

# エディタの設定を確認（VS Codeの場合）
# .vscode/settings.json を確認
```

## その他の問題

### Git関連の問題

**問題**: Gitの操作でエラーが発生する。

**解決方法**:

```bash
# Gitの状態を確認
git status

# 変更を確認
git diff

# キャッシュをクリア
git clean -xdf

# リモートを確認
git remote -v
```

### Docker関連の問題

**問題**: Dockerコンテナでエラーが発生する。

**解決方法**:

```bash
# Dockerコンテナの状態を確認
docker ps -a

# コンテナを再起動
docker restart container-name

# ログを確認
docker logs container-name

# イメージを再ビルド
docker build -t e2e .
```

## よくある質問

### Q: エラーメッセージが理解できない

**A**: エラーメッセージをコピーして、検索エンジンで検索してみてください。多くの場合、同じ問題に遭遇した人が解決方法を共有しています。

### Q: 問題が解決しない

**A**: 次の手順を試してください：

1. エラーメッセージを詳細に確認
2. ログを確認（`--verbose` フラグを使用）
3. 関連するドキュメントを確認
4. GitHubのIssuesを検索
5. チームメンバーに相談

### Q: 環境をリセットしたい

**A**: 次のコマンドで環境をリセットできます：

```bash
# すべてのキャッシュとnode_modulesを削除
bun run clean
rm -rf node_modules
rm -rf .turbo

# 依存関係を再インストール
bun install

# ビルドを再実行
bun run build
```

## 参考資料

- [Bun ドキュメント](https://bun.sh/docs)
- [Turborepo ドキュメント](https://turbo.build/repo/docs)
- [Cloudflare ドキュメント](https://developers.cloudflare.com/)
- [Prisma ドキュメント](https://www.prisma.io/docs)
- [Vitest ドキュメント](https://vitest.dev/)
- [Playwright ドキュメント](https://playwright.dev/)
