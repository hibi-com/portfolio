---
title: "Redis Cloud 手動作成手順"
---

このドキュメントでは、Redis Cloudダッシュボードを使用してサブスクリプションとデータベースを手動で作成する手順を説明します。

## 重要: Redis Cloud API経由での作成について

**Redis Cloudのサブスクリプション作成APIは、年間プランまたはエンタープライズプランでのみ利用可能です。**

無料プランや月額プランを使用している場合、以下のいずれかの方法を選択してください：

1. **Redis Cloudの作成をスキップする**（推奨）:
   - Pulumi設定で`skipRedisCloud: true`を設定
   - `.env`ファイルに`REDIS_URL`を設定（外部のRedisサービスを使用）
   - 詳細は「[Redis Cloudの作成をスキップする](#redis-cloudの作成をスキップする)」を参照

2. **ダッシュボードで手動作成する**:
   - このドキュメントの手順に従って、ダッシュボードで手動作成
   - 作成後、`pulumi import`を実行してPulumiで管理

## 前提条件

- [Redis Cloud](https://app.redislabs.com/) アカウントにログイン済み
- APIキー（`REDISCLOUD_ACCESS_KEY`と`REDISCLOUD_SECRET_KEY`）が設定済み（手動作成の場合のみ）

## 手順1: サブスクリプションの作成

1. [Redis Cloud](https://app.redislabs.com/) にログイン

2. 左側のメニューから「**Subscriptions**」を選択

3. 「**+ New Subscription**」または「**Create Subscription**」をクリック

4. サブスクリプション設定を入力：

   - **Subscription Name**: `portfolio-subscription`（任意の名前）
   - **Cloud Provider**: `AWS`を選択
   - **Region**: `ap-northeast-1`（東京）を選択
   - **Memory Storage**: `RAM`を選択
   - **Plan**: `Essentials`を選択
   - **Memory Limit**: `30 MB`（無料プラン）または希望のサイズ

5. 「**Create Subscription**」をクリック

6. サブスクリプションが作成されるまで数分待機

## 手順2: データベースの作成

1. 作成したサブスクリプションをクリックして詳細を表示

2. 「**Databases**」タブを選択

3. 「**+ New Database**」または「**Create Database**」をクリック

4. データベース設定を入力：

   - **Database Name**: `portfolio-cache`（任意の名前）
   - **Protocol**: `Redis`を選択
   - **Memory Limit**: `30 MB`（無料プランの場合）
   - **Data Persistence**: `None`を選択
   - **Replication**: `Disabled`（無料プランの場合）
   - **Throughput**: `1000 operations/second`（無料プランの場合）

5. 「**Create Database**」をクリック

6. データベースが作成されるまで数分待機

## 手順3: 接続情報の取得

1. 作成したデータベースをクリックして詳細を表示

2. 「**Connect**」タブまたは「**Configuration**」タブを選択

3. 以下の情報をコピー：

   - **Public Endpoint**: `host:port`形式（例: `redis-12345.redis.cloud:12345`）
   - **Password**: データベースのパスワード（表示されない場合は「**Show Password**」をクリック）

4. 接続文字列を構築：

   ```bash
   redis://:password@host:port
   ```

   例:

   ```bash
   redis://:your-password@redis-12345.redis.cloud:12345
   ```

## 手順4: サブスクリプションIDとデータベースIDの確認

### サブスクリプションIDの確認

1. サブスクリプションの詳細ページを表示
2. URLからIDを確認（例: `https://app.redislabs.com/#/subscriptions/12345678` → IDは`12345678`）
3. または、サブスクリプション一覧でID列を確認

### データベースIDの確認

1. データベースの詳細ページを表示
2. URLからIDを確認（例: `https://app.redislabs.com/#/subscriptions/12345678/databases/87654321` → IDは`87654321`）
3. または、データベース一覧でID列を確認

## 手順5: .envファイルにIDを設定

`infra/.env` に `REDISCLOUD_SUBSCRIPTION_ID`、`REDISCLOUD_DATABASE_ID`、`CACHE_URL`（または `REDIS_URL`）を追加し、`cd infra && pulumi up` で Cloudflare 等に反映してください。

## 手順6: Pulumiで既存リソースをインポート

**重要**: `.env`に ID を設定した後、**必ず** `pulumi import` を実行してください。手順は [api-keys-setup.md](./api-keys-setup.md) を参照。認証情報の検証には `bun run check infra` を使用してください。

## トラブルシューティング

### エラー: "401 - Authentication error"

- **確認方法**: `check infra` を実行して、認証情報が有効か確認してください。

  ```bash
  bun run check infra
  ```

### 接続できない

- ファイアウォール設定・パブリックエンドポイント・パスワードを確認してください。

## Redis Cloudの作成をスキップする

Pulumi で `skipRedisCloud: true` を設定し、`.env` に `REDIS_URL` を設定したうえで `pulumi up` を実行すると、Redis Cloud の作成をスキップして外部 Redis を使用できます。

### 注意事項

- `skipRedisCloud: true` を設定すると、Redis Cloud のサブスクリプションとデータベースの作成がスキップされます。
- `REDIS_URL` が未設定の場合は空文字列が使用されます。
