---
title: "TiDB Cloud 手動作成手順"
---

このドキュメントでは、TiDB Cloudダッシュボードを使用してServerlessクラスターとデータベースを手動で作成する手順を説明します。

## 前提条件

- [TiDB Cloud](https://tidbcloud.com/) アカウントにログイン済み
- TiDB Cloudアカウントが作成済み（無料プランでも可）

## 手順1: Serverlessクラスターの作成

1. [TiDB Cloud](https://tidbcloud.com/) にログイン

2. 左側のメニューから「**Clusters**」を選択

3. 「**Create Cluster**」または「**+ New Cluster**」をクリック

4. クラスター設定を選択：

   - **Cluster Type**: `Serverless`を選択（無料プラン）
   - **Cloud Provider**: `AWS`を選択
   - **Region**: `ap-northeast-1`（東京）を選択
   - **Cluster Name**: `portfolio-db`（任意の名前）

5. 「**Create**」をクリック

6. クラスターが作成されるまで数分待機（通常5-10分）

## 手順2: データベースの作成

1. 作成したクラスターをクリックして詳細を表示

2. 「**Databases**」タブを選択

3. 「**Create Database**」または「**+ New Database**」をクリック

4. データベース設定を入力：

   - **Database Name**: `portfolio`（任意の名前）
   - **Character Set**: `utf8mb4`（推奨）
   - **Collation**: `utf8mb4_bin`（推奨）

5. 「**Create**」をクリック

6. データベースが作成されるまで数秒待機

## 手順3: データベースユーザーの作成

1. クラスターの詳細ページで「**Security**」タブを選択

2. 「**Database Users**」セクションで「**Create User**」をクリック

3. ユーザー設定を入力：

   - **Username**: `root`（または任意のユーザー名）
   - **Password**: 強力なパスワードを設定（後で使用するため保存）
   - **Privileges**: `ALL PRIVILEGES`を選択（または必要に応じて制限）

4. 「**Create**」をクリック

5. ユーザーが作成されるまで数秒待機

## 手順4: 接続情報の取得

1. クラスターの詳細ページで「**Connect**」タブを選択

2. 「**Standard Connection**」セクションから以下をコピー：

   - **Host**: `gateway01.ap-northeast-1.prod.aws.tidbcloud.com`（例）
   - **Port**: `4000`
   - **User**: 作成したユーザー名（例: `root`）
   - **Password**: 作成したパスワード
   - **Database**: 作成したデータベース名（例: `portfolio`）

3. 接続文字列を構築：

   ```bash
   mysql://user:password@host:4000/database?sslaccept=strict
   ```

   **例**:

   ```bash
   mysql://root:your-password@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/portfolio?sslaccept=strict
   ```

## 手順5: 接続情報を infra/.env に設定

TiDB Cloudは`DATABASE_URL`のみを使用します（`TIDB_HOST`は不要）。

`infra/.env` に追加：

```env
DATABASE_URL="mysql://user:password@host:4000/database?sslaccept=strict"
```

**注意**: `TIDB_HOST`は不要です。`DATABASE_URL`から自動的にホスト名が抽出されます。

その後、Pulumi で Cloudflare 等に反映：

```bash
cd infra
pulumi up
```

## 手順6: 接続テスト（オプション）

### MySQLクライアントを使用

```bash
# MySQLクライアントがインストールされている場合
mysql -h gateway01.ap-northeast-1.prod.aws.tidbcloud.com -P 4000 -u root -p portfolio
```

### 接続文字列を使用

```bash
# DATABASE_URLを使用して接続
mysql "$DATABASE_URL"
```

## 注意事項

- **無料プラン（Serverless）の制限**:
  - ストレージ: 5 GiBまで
  - リクエストユニット: 50,000,000/月まで
  - クラスターは自動的にスケールダウンされます（アイドル時）

- **セキュリティ**:
  - パスワードは強力なものを使用してください
  - 接続文字列は機密情報のため、Dopplerに保存してください
  - 本番環境では、最小権限の原則に従ってユーザー権限を設定してください

- **接続設定**:
  - SSL接続が必須です（`sslaccept=strict`）
  - ポートは`4000`を使用します
  - ホスト名はリージョンによって異なります

## トラブルシューティング

### エラー: "Access denied for user"

- ユーザー名とパスワードが正しいか確認してください
- ユーザーに適切な権限が付与されているか確認してください
- データベース名が正しいか確認してください

### エラー: "Unknown database"

- データベースが作成されているか確認してください
- データベース名が正しいか確認してください（大文字小文字を区別）

### 接続できない

- ファイアウォール設定を確認してください
- ホスト名とポートが正しいか確認してください
- SSL接続が有効になっているか確認してください（`sslaccept=strict`）

### クラスターが作成されない

- TiDB Cloudアカウントの制限を確認してください
- リージョンが利用可能か確認してください
- ブラウザのコンソールでエラーメッセージを確認してください

## 次のステップ

接続情報を `infra/.env` に設定した後、Pulumi で TiDB クラスターの情報を使用できます：

```bash
cd infra
pulumi up
```

Pulumi は `infra/.env` の `DATABASE_URL` を読み込み、Cloudflare Workers/Pages 等に反映します。

## 参考リンク

- [TiDB Cloud Documentation](https://docs.pingcap.com/tidbcloud/)
- [TiDB Cloud Serverless](https://docs.pingcap.com/tidbcloud/serverless-cluster-overview)
- [TiDB Cloud Connection Guide](https://docs.pingcap.com/tidbcloud/connect-to-tidb-cluster)
