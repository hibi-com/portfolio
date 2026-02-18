---
title: "トラブルシューティングガイド"
---

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

### TiDB Cloud接続エラー

**問題**: TiDB Cloudデータベースへの接続が失敗する。

**解決方法**:

接続文字列が正しいか確認します。`infra/env.yaml`の`secrets.database.url`または環境変数`DATABASE_URL`を確認してください。接続文字列の形式は`mysql://ユーザー名:パスワード@ホスト:4000/データベース名?sslaccept=strict`です。TiDB Cloudコンソールで接続文字列を確認し、パスワードに特殊文字が含まれる場合はURLエンコードが必要です。また、TiDB Cloudのファイアウォール設定でIPアドレスが許可されているか確認してください。ローカル開発の場合は`0.0.0.0/0`、本番環境ではCloudflare WorkersのIPレンジを許可します。

**エッジケース**:

- 接続タイムアウトが発生する場合、TiDB Cloudクラスターがスリープ状態（Serverlessプランの自動スリープ）の可能性があります。初回接続時は10-15秒のウォームアップ時間が必要です。
- マルチリージョンデプロイの場合、レイテンシが高くなることがあります。TiDB Cloudクラスターとアプリケーションを同じリージョン（推奨：AWS ap-northeast-1）に配置してください。

### Prismaマイグレーションエラー

**問題**: Prismaマイグレーションが失敗する。

**解決方法**:

マイグレーションの実行は `bun run migrate --filter=@portfolio/db` で行う。状態確認（status）・リセット（reset）・再適用（deploy）は [コマンド追加リスト](../../scripts/command-addition-list.md) の TODO を参照し、必要なら `bun run` で実行できるスクリプトを追加する。

### スキーマの変更が反映されない

**問題**: Prismaスキーマを変更しても反映されない。

**解決方法**:

Prisma Client の再生成は `bun run generate --filter=@portfolio/db`。マイグレーションの新規作成・適用（migrate dev）は [コマンド追加リスト](../../scripts/command-addition-list.md) の TODO を参照し、必要なら `bun run` で実行できるスクリプトを追加する。

**エッジケース**:

- ドメイン分割されたPrismaスキーマ（`packages/db/prisma/schema/`配下の複数ファイル）を使用しているため、スキーマ変更時は全ファイルの整合性を確認してください。
- TiDB CloudはMySQLベースですが、一部のMySQL固有機能（FULLTEXT INDEX等）に制限があります。サポート状況は[TiDB MySQL互換性](https://docs.pingcap.com/tidb/stable/mysql-compatibility)を参照してください。
- マイグレーション実行時にタイムアウトが発生する場合、TiDB Cloudコンソールで直接SQLを実行し、その後`prisma migrate resolve`でマイグレーション状態を同期します。

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

### env.yaml設定の問題

**問題**: `infra/env.yaml`からの環境変数読み込みが失敗する。

**解決方法**:

`infra/env.yaml`の構造を確認してください。YAMLの形式エラー（インデント不正、コロン後のスペース欠如等）がないか検証します。Pulumiスタック設定は`infra/env.yaml`と環境変数の両方から読み込まれ、環境変数が優先されます。値が反映されない場合、環境変数`export CLOUDFLARE_API_TOKEN=xxx`が設定されていないか確認してください。また、シークレット値（パスワード等）は`infra/.env`ファイルにも記載でき、Pulumiが自動的に読み込みます。

**エッジケース**:

- env.yaml内で環境変数参照（`${ENV_VAR}`）を使用している場合、Pulumiは展開しません。環境変数は直接プロセスから読み込む必要があります。
- 複数環境（rc/stg/prd）で異なる値を使う場合、`Pulumi.{stack}.yaml`ファイルを使用せず、全て`env.yaml`と環境変数で管理します。環境ごとの切り替えはCircleCIのContext機能を使用してください。

### Cloudflare環境で環境変数が設定されない

**問題**: Cloudflare Pages/Workersで環境変数が設定されない。

**解決方法**:

環境変数は`infra/env.yaml`から読み込まれ、Pulumiが自動的にCloudflareに設定します。設定されない場合、Pulumiデプロイが正常に完了しているか`pulumi stack output`で確認してください。シークレット一覧確認や手動設定は[コマンド追加リスト](../../scripts/command-addition-list.md)のTODOを参照してください。各アプリの`wrangler.toml`には環境変数のキー名のみ記載し、値は含めません。

**エッジケース**:

- Cloudflare Pagesの環境変数は最大5KB、Workersは最大5MBの制限があります。大きなJWT鍵等は別の方法（KV/R2）で管理してください。
- 環境変数名にハイフン（-）が含まれる場合、アンダースコア（_）に変換されることがあります。命名規則は`UPPER_SNAKE_CASE`を推奨します。

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

### CircleCIデプロイエラー

**問題**: CircleCIでのデプロイが失敗する。

**解決方法**:

CircleCIデプロイジョブはリトライロジック（最大3回）とヘルスチェックを含みます。失敗した場合、まずCircleCI UIでジョブログを確認してください。Backblaze B2からのアーティファクトダウンロードエラーの場合、CIジョブでのビルドが成功しているか、B2バケットにファイルが存在するか確認します。Wranglerデプロイエラーの場合、Cloudflare APIトークンの権限（Account:Cloudflare Pages:Edit、Account:Workers Scripts:Edit）を確認してください。デプロイ後のヘルスチェックが失敗する場合、アプリケーション起動時のエラーログをCloudflare Dashboardで確認します。

**エッジケース**:

- デプロイタイムアウト（15分制限）が発生する場合、ビルドサイズを削減するか、コード分割を検討してください。特にPages projectは25MBの制限があります。
- 同時デプロイ（複数環境への並行デプロイ）は避けてください。CircleCIワークフローは環境ごとにシーケンシャル実行されます。
- デプロイ失敗時にGitHub Issueが自動作成されます。ロールバックが必要な場合、Issueに記載されたコミットSHAを使用してください。

### Cloudflareデプロイが失敗する

**問題**: Cloudflare Pages/Workersへのデプロイが失敗する。

**解決方法**:

ローカルからの手動デプロイは禁止されており、全てCircleCI経由で実行されます。テスト目的でローカルデプロイが必要な場合は`bun run deploy`を実行できますが、本番環境へのデプロイは必ずCircleCIを使用してください。Wranglerの認証確認・デプロイの詳細ログ確認は[コマンド追加リスト](../../scripts/command-addition-list.md)のTODOを参照してください。

**エッジケース**:

- Cloudflare Workersのバンドルサイズは1MBの制限があります。大きな依存関係（特にPolyfill）を避け、必要に応じて動的インポートを使用してください。
- Pages Functionsは`_worker.js`を使用している場合、Workersと同じ1MB制限が適用されます。通常のPages Functions（/functions配下）は制限が異なります。
- デプロイ時に「Deployment still in progress」エラーが発生した場合、前回のデプロイが完了していません。数分待ってから再試行してください。

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

**Turborepoキャッシュのエッジケース**:

- キャッシュが効かない場合、`turbo.json`の`inputs`配置が正しいか確認してください。グロブパターンの誤り（例：`**/*.ts`のつもりが`*.ts`）でファイルが監視されていない可能性があります。
- リモートキャッシュ（Vercel Remote Cache）を使用している場合、認証トークンの有効期限を確認してください。期限切れの場合、ローカルキャッシュのみが使用されます。
- 環境変数の変更がキャッシュキーに含まれない場合があります。`turbo.json`の`env`フィールドで使用する環境変数を明示的に宣言してください。
- モノレポ内でパッケージ間の依存関係が正しくない場合、並列実行でビルドが失敗します。`package.json`の`dependencies`と`turbo.json`の`dependsOn`を一致させてください。

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

## Bunランタイム特有の問題

### Bunとの互換性エラー

**問題**: Bunで特定のパッケージが動作しない。

**解決方法**:

Bunは高速なJavaScriptランタイムですが、一部のNode.js固有APIとの互換性問題があります。エラーが発生した場合、まず該当パッケージがBunをサポートしているか確認してください。非サポートの場合、代替パッケージを検討するか、Node.jsで実行します。特に、ネイティブモジュール（node-gyp使用）やNode.js内部API（`vm`モジュール等）に依存するパッケージは動作しない可能性が高いです。ワークアラウンドとして、特定スクリプトのみ`NODE_OPTIONS`で Node.jsランタイムを使用することも可能です。

**エッジケース**:

- Bunの型定義が不完全な場合、TypeScriptで型エラーが発生します。`bun-types`パッケージを最新にアップデートするか、`@types/node`と併用してください。
- `bun install`と`npm install`で生成されるロックファイル形式が異なります。チーム全体でBunを使用する場合、`bun.lockb`のみをコミットし、`package-lock.json`は削除してください。
- Bunのグローバルインストール（`bun add -g`）は`~/.bun/bin`にインストールされます。PATHに追加されているか確認してください。

### Bunのメモリ使用量

**問題**: Bunが大量のメモリを消費する。

**解決方法**:

Bunは高速化のためメモリを多く使用します。メモリ不足エラーが発生した場合、`BUN_MAX_HEAP_SIZE`環境変数でヒープサイズを制限できます（例：`BUN_MAX_HEAP_SIZE=2048`で2GB）。ただし、制限しすぎるとパフォーマンスが低下します。CI環境では適切なマシンサイズ（CircleCIの場合、medium以上を推奨）を選択してください。また、Bunのバージョンによってメモリ使用量が改善されているため、最新版へのアップデートも検討してください。

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

## エッジケースとレアな問題

### タイムゾーン関連の問題

**問題**: 日時データが期待と異なる。

**解決方法**:

TiDB CloudはUTCタイムゾーンを使用します。アプリケーション側でJST（日本標準時、UTC+9）に変換する必要があります。Prismaスキーマで`DateTime`型を使用している場合、JavaScriptの`Date`オブジェクトはローカルタイムゾーンを使用します。一貫性のため、全ての日時データをUTCで保存し、表示時のみローカルタイムゾーンに変換することを推奨します。CloudflareWorkersは常にUTCで動作するため、`Date.now()`の結果はUTCです。

**エッジケース**:

- サマータイムの影響を受ける地域（米国等）では、タイムゾーン変換時に注意が必要です。日本はサマータイムがないため影響を受けません。
- ユーザー入力の日時文字列（「2025-01-01」等）をパースする場合、タイムゾーン情報がない場合はローカルタイムゾーンとして解釈されます。ISO 8601形式（「2025-01-01T00:00:00Z」）を推奨します。

### 文字エンコーディングの問題

**問題**: 日本語や特殊文字が文字化けする。

**解決方法**:

全てのファイルとデータベースでUTF-8エンコーディングを使用してください。TiDB CloudはデフォルトでUTF-8（utf8mb4）を使用し、絵文字を含む全てのUnicode文字をサポートします。環境変数やファイルから日本語を読み込む場合、ファイルがUTF-8で保存されているか確認してください。Cloudflare Workersは全てUTF-8で処理されますが、外部APIからのレスポンスは明示的にエンコーディングを指定する必要があります（`response.text()`の前に`Content-Type`ヘッダーを確認）。

**エッジケース**:

- 絵文字（4バイト文字）を含むデータは、MySQLの`utf8`（3バイト）ではなく`utf8mb4`を使用する必要があります。TiDB Cloudはデフォルトで`utf8mb4`です。
- URLエンコーディング（パーセントエンコーディング）された文字列は`decodeURIComponent()`でデコードしてください。特に日本語を含むクエリパラメータで必要です。

### 並行実行エラー

**問題**: 複数リクエストの同時処理で競合が発生する。

**解決方法**:

Cloudflare Workersは並行リクエストを処理するため、グローバル変数の使用は避けてください。グローバル変数は複数リクエスト間で共有され、予期しない動作を引き起こします。リクエストスコープのデータは関数引数またはリクエストコンテキストで管理してください。データベースの楽観的ロック（Prismaの`@updatedAt`フィールドを使用したバージョン管理）を使用して、同時更新の競合を検出します。また、Cloudflare KV/R2は結果整合性モデルのため、書き込み直後の読み込みで最新データが取得できない場合があります。

**エッジケース**:

- トランザクション内での長時間処理は避けてください。TiDB Cloudのデフォルトタイムアウトは10秒です。
- Cloudflare Workersの同時接続数は限られています。データベース接続プールの設定（Prisma Acceleratorまたは接続プーリング）を検討してください。
- 分散環境での一意性制約違反は、リトライロジックで対応できますが、ユーザーへの適切なエラーメッセージも重要です。

### メモリリークとリソース枯渇

**問題**: 長時間実行後にメモリエラーが発生する。

**解決方法**:

Cloudflare Workersは各リクエストが独立したコンテキストで実行され、リクエスト完了後にメモリが解放されます。ただし、グローバルスコープのオブジェクトは複数リクエスト間で共有されるため、大きなキャッシュやバッファをグローバルに保持するとメモリリークの原因になります。開発環境（`bun run dev`）では、長時間実行するとNode.js/Bunのメモリが増加することがあります。定期的に開発サーバーを再起動するか、`NODE_OPTIONS="--max-old-space-size=4096"`でヒープサイズを増やしてください。

**エッジケース**:

- Eventリスナー（`addEventListener`）の解除忘れは、ブラウザ側でメモリリークの原因になります。Reactの`useEffect`のクリーンアップ関数で必ず解除してください。
- 大きなファイル（画像、動画）をメモリに全て読み込む処理は避け、ストリーミング処理を使用してください。

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
- [TiDB Cloud ドキュメント](https://docs.pingcap.com/tidbcloud/)
- [Pulumi ドキュメント](https://www.pulumi.com/docs/)
