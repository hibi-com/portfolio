# APIキー・トークン発行手順書

このプロジェクトで必要な各種APIキー・トークンの発行手順をまとめています。

## 環境変数・Doppler の管理

- **compose で使う値**: `.docker/secrets/` で管理（`database_url`, `redis_url`, `api_url`, `node_env`）。詳細はリポジトリルートの `.docker/secrets/README.md` を参照。
- **Doppler への同期**: `syncDopplerSecrets: true` のとき、`pulumi up` が `.docker/secrets/` の内容を Doppler に反映する（compose がソース）。
- **その他の infra 用シークレット**（Cloudflare, Sentry, Grafana 等）: Doppler ダッシュボードで設定するか、`bun run verify` 用に一時的に `.env` に設定してから Doppler に手動で反映してもよい。

## 目次

1. [Cloudflare APIトークン](#cloudflare-apiトークン)
2. [Sentry認証トークン](#sentry認証トークン)
3. [Grafana APIキー](#grafana-apiキー)
4. [Redis Cloud APIキー](#redis-cloud-apiキー)
5. [Doppler Service Token](#doppler-service-token)
6. [Google OAuth認証情報](#google-oauth認証情報)
7. [Better Auth Secret](#better-auth-secret)
8. [TiDB Cloud接続情報](#tidb-cloud接続情報)

## Cloudflare APIトークン

### Cloudflare - 必要な情報

- `CLOUDFLARE_API_TOKEN` - APIトークン
- `CLOUDFLARE_ACCOUNT_ID` - アカウントID
- `CLOUDFLARE_ZONE_ID` - ゾーンID

### Cloudflare - 発行手順

#### 1. APIトークンの作成

1. `https://dash.cloudflare.com/profile/api-tokens` にアクセス
2. 「Create Token」をクリック
3. 「Create Custom Token」を選択
4. 以下の設定を行う：
   - **Token name**: `portfolio-infra` など任意の名前
   - **Permissions**:
     - **Zone** → **DNS** → **Edit**
     - **Zone** → **Zone** → **Read**
     - **Account** → **Cloudflare Pages** → **Edit**
     - **Account** → **Workers Scripts** → **Edit**
     - **Account** → **Access: Apps and Policies** → **Edit** (Zero Trust Access用)
   - **Account Resources**: 対象のアカウントを選択
   - **Zone Resources**: 「Include」を選択し、対象のゾーンを選択
5. 「Continue to summary」→「Create Token」をクリック
6. 表示されたトークンをコピー（**再表示できないため注意**）

#### 2. アカウントIDの取得

1. `https://dash.cloudflare.com/` にアクセス
2. 右サイドバーの「Account ID」をコピー

#### 3. ゾーンIDの取得

1. `https://dash.cloudflare.com/` にアクセス
2. 対象のドメインを選択
3. 右サイドバーの「Zone ID」をコピー

### Cloudflare - 環境変数への設定

```env
CLOUDFLARE_API_TOKEN="your-api-token"
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_ZONE_ID="your-zone-id"
```

## Sentry認証トークン

### Sentry - 必要な情報

- `SENTRY_AUTH_TOKEN` - 認証トークン
- `SENTRY_ORG` - 組織スラッグ
- `SENTRY_DSN` - プロジェクトDSN

### Sentry - 発行手順

#### 1. 認証トークンの作成

1. [Sentry API Tokens](https://sentry.io/settings/account/api/auth-tokens/) にアクセス
2. 「Create New Token」をクリック
3. 以下の設定を行う：
   - **Name**: `portfolio-infra` など任意の名前
   - **Scopes**:
     - ✅ `org:read` - 組織の読み取り
     - ✅ `org:write` - 組織の書き込み
     - ✅ `project:read` - プロジェクトの読み取り
     - ✅ `project:write` - プロジェクトの書き込み
     - ✅ `team:read` - チームの読み取り
     - ✅ `team:write` - チームの書き込み
4. 「Create Token」をクリック
5. 表示されたトークンをコピー（**再表示できないため注意**）

#### Sentry - 2. 組織スラッグの取得

1. [Sentry Settings](https://sentry.io/settings/) にアクセス
2. 組織名の下に表示されるスラッグ（例: `hibicom`）をコピー

#### 3. DSNの取得

1. [Sentry Settings](https://sentry.io/settings/) にアクセス
2. 対象のプロジェクトを選択
3. 「Settings」→「Client Keys (DSN)」にアクセス
4. 「DSN」をコピー

### Sentry - 環境変数への設定

```env
SENTRY_AUTH_TOKEN="your-auth-token"
SENTRY_ORG="your-org-slug"
SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"
```

### Sentry - トラブルシューティング

#### エラー: "Invalid token header. No credentials provided"

**原因**: PulumiのSentryプロバイダーが認証トークンを正しく読み取れていない

**解決方法**:

1. `.env`ファイルの`SENTRY_AUTH_TOKEN`が正しく設定されているか確認
2. トークンがDopplerに正しく同期されているか確認
3. トークンが有効で、必要なスコープ（`org:read`, `org:write`, `team:read`, `team:write`, `project:read`, `project:write`）が付与されているか確認
4. `bun run verify`を実行して、トークンの有効性を確認

#### エラー: "You do not have permission to perform this action" (403)

**原因**: 認証トークンに必要なスコープが不足している

**解決方法**:

1. [Sentry API Tokens](https://sentry.io/settings/account/api/auth-tokens/) にアクセス
2. 既存のトークンを削除し、新しいトークンを作成
3. すべての必要なスコープを選択：
   - ✅ `org:read`
   - ✅ `org:write`
   - ✅ `team:read`
   - ✅ `team:write`
   - ✅ `project:read`
   - ✅ `project:write`
4. 新しいトークンを`.env`ファイルに設定し、Dopplerに同期

## Grafana APIキー

### Grafana - 必要な情報

- `GRAFANA_API_KEY` - APIキー
- `GRAFANA_ORG_SLUG` - 組織スラッグ

### Grafana - 発行手順

#### 1. APIキーの作成（Grafana Cloudの場合）

1. [Grafana API Keys](https://grafana.com/orgs/{your-org}/api-keys) にアクセス
   - `{your-org}` は組織スラッグに置き換え
2. 「Create API Key」をクリック
3. 以下の設定を行う：
   - **Name**: `portfolio-infra` など任意の名前
   - **Role**: `Admin` を選択
   - **Time to live**: 必要に応じて設定（無期限の場合は空欄）
4. 「Add API Key」をクリック
5. 表示されたAPIキーをコピー（**再表示できないため注意**）

#### Grafana - 2. 組織スラッグの取得

1. [Grafana Organizations](https://grafana.com/orgs/) にアクセス
2. URLの `/orgs/{your-org-slug}` の部分をコピー

#### セルフホストGrafanaの場合

1. Grafanaにログイン
2. 「Configuration」→「API Keys」にアクセス
3. 「New API Key」をクリック
4. 上記と同様の設定を行う

### Grafana - 必要な権限

**重要**: Grafana APIキーには以下の権限が必要です。権限が不足している場合、リソース作成時に403エラーが発生します。

- **folders:create** - フォルダの作成（必須）
- **dashboards:write** - ダッシュボードの作成・編集（必須）
- **datasources:read** - データソースの読み取り（推奨）

**権限の確認方法**:

1. Grafana Cloudの場合: APIキー作成時に「Role」で`Admin`を選択することで、すべての権限が付与されます
2. セルフホストGrafanaの場合: 「Permissions」セクションで上記の権限を個別に選択してください

**権限不足エラーの解決方法**:

- エラーメッセージ: `[POST /folders][403] createFolderForbidden {"message":"You'll need additional permissions to perform this action. Permissions needed: folders:create"}`
- 解決方法: 新しいAPIキーを作成し、`Admin`ロール（または`folders:create`権限）を付与してください

### Grafana - 環境変数への設定

```env
GRAFANA_API_KEY="glsa_xxxxx"
GRAFANA_ORG_SLUG="your-org-slug"
```

## Redis Cloud APIキー

### Redis Cloud - 必要な情報

- `REDISCLOUD_ACCESS_KEY` - Access Key
- `REDISCLOUD_SECRET_KEY` - Secret Key

### Redis Cloud - 発行手順

1. [Redis Cloud](https://app.redislabs.com/) にログイン
2. 右上のユーザーアイコンをクリック
3. 「Account Settings」を選択
4. 「Access Keys & Security」タブを選択
5. 「Generate New Access Key」をクリック
6. 以下の情報をコピー：
   - **Access Key** → `REDISCLOUD_ACCESS_KEY`
   - **Secret Key** → `REDISCLOUD_SECRET_KEY`
   - **注意**: Secret Keyは再表示できないため、必ずコピーしてください

### Redis Cloud - 環境変数への設定

```env
REDISCLOUD_ACCESS_KEY="your-access-key"
REDISCLOUD_SECRET_KEY="your-secret-key"
```

### Redis Cloud - トラブルシューティング

#### エラー: "400 BAD_REQUEST - BAD_REQUEST: Bad request detected"

**原因**: サブスクリプション作成時のパラメータが不正

**考えられる原因**:

1. **`paymentMethodId`が未設定**: `paymentMethod: "credit-card"`の場合、`paymentMethodId`が必要です
2. **`cloudAccountId`が未設定**: 独自のクラウドアカウントを使用する場合、`cloudAccountId`が必要です（デフォルトはRedis Labs内部アカウント）
3. **パラメータの形式が不正**: CIDR形式やメモリサイズなど

**解決方法**:

1. Redis CloudのAPIキーが有効か確認（`bun run verify`を実行）
2. サブスクリプションが既に存在する場合は、既存のサブスクリプションを使用するか削除
3. **`paymentMethodId`の設定**:
   - Redis Cloudダッシュボードで支払い方法を確認
   - Pulumiコードで`getPaymentMethod`を使用して`paymentMethodId`を取得するか、既知のIDを設定
   - または、`paymentMethod: "marketplace"`を使用（AWS/GCP Marketplace経由の場合）
4. **`cloudAccountId`の設定**（オプション）:
   - 独自のAWS/GCPアカウントを使用する場合のみ必要
   - Redis Labs内部アカウントを使用する場合は設定不要（デフォルト）
5. パラメータを確認：
   - `memoryLimitInGb`: 0.03以上（最小値）
   - `networkingDeploymentCidr`: 有効なCIDR形式（例: `10.0.0.0/24`）
   - `paymentMethod`: `credit-card`または`marketplace`
6. Redis Cloudの無料プランを使用している場合、制限を確認してください

**注意**:

- **無料プラン（30MB Essentials）を使用している場合**: `paymentMethod`と`paymentMethodId`を省略できます。コードは自動的にこれらを省略し、Redis Cloudが無料プランとして処理します。
- **有料プランを使用する場合**: `paymentMethodId`をPulumi設定で設定する必要があります。

**`paymentMethodId`の設定方法**（有料プランの場合）:

1. **Redis Cloudダッシュボードで支払い方法を確認**:
   - [Redis Cloud](https://app.redislabs.com/) にログイン
   - Account Settings → Payment Methods
   - 登録されている支払い方法のIDを確認（または新規登録）

2. **Pulumi設定で`paymentMethodId`を設定**:
   ```bash
   pulumi config set rediscloudPaymentMethodId <payment-method-id>
   ```

3. **または、環境変数から取得する場合**:
   - `.env`ファイルに`REDISCLOUD_PAYMENT_METHOD_ID`を追加
   - Dopplerにシークレットとして保存
   - `infra/src/resources/cache.ts`を編集して、環境変数から取得するように変更

**無料プランでの動作**:

無料プラン（30MB Essentials）を使用している場合、`paymentMethod`と`paymentMethodId`を省略できます。コードは`paymentMethodId`が設定されていない場合、これらを自動的に省略します。

**エラー: "Your query returned no results"**:

このエラーは、`getPaymentMethod`を使用して支払い方法を取得しようとしたが、アカウントに支払い方法が登録されていない場合に発生します。

**解決方法**:
1. 無料プランを使用している場合: `paymentMethodId`を設定せず、コードが自動的に`paymentMethod`を省略するようにします（現在のコードのデフォルト動作）
2. 有料プランを使用している場合: Redis Cloudダッシュボードで支払い方法を登録し、`paymentMethodId`をPulumi設定で設定
3. AWS/GCP Marketplace経由でサインアップしている場合: `paymentMethod: "marketplace"`を使用（現在は無料プランでは不要）

#### エラー: "Authentication error: Required authentication credentials were not provided" (401)

**原因**: APIキーが無効または期限切れ

**解決方法**:

1. [Redis Cloud](https://app.redislabs.com/) にログイン
2. Account Settings → Access Keys & Security
3. 既存のキーを確認し、必要に応じて新しいキーを生成
4. `.env`ファイルを更新し、Dopplerに同期

## Doppler Service Token

### Doppler - 必要な情報

- Doppler Service Token（環境変数として直接設定する必要はありませんが、Pulumiから使用）

### Doppler - 発行手順

1. [Doppler Dashboard](https://dashboard.doppler.com/) にログイン
2. 対象のプロジェクトを選択
3. 「Access」→「Service Tokens」にアクセス
4. 「Generate Service Token」をクリック
5. 以下の設定を行う：
   - **Name**: `pulumi-infra` など任意の名前
   - **Config**: 使用する環境（`rc`, `stg`, `prd`）を選択
   - **Access**: `Read` または `Read & Write` を選択
6. 「Generate Token」をクリック
7. 表示されたトークンをコピー（**再表示できないため注意**）

### Pulumi設定への追加

```bash
# Pulumi設定に追加
pulumi config set dopplerToken "your-service-token" --secret
```

### 環境変数として使用する場合

```bash
export DOPPLER_TOKEN="your-service-token"
```

## Google OAuth認証情報

### Google OAuth - 必要な情報

- `GOOGLE_CLIENT_ID` - クライアントID
- `GOOGLE_CLIENT_SECRET` - クライアントシークレット

### Google OAuth - 発行手順

#### 1. Google Cloud Consoleにアクセス

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. Googleアカウントでログイン

#### 2. プロジェクトの作成または選択

1. 画面上部のプロジェクト選択ドロップダウンをクリック
2. 「新しいプロジェクト」をクリック（新規作成の場合）
   - **プロジェクト名**: `portfolio` など任意の名前
   - 「作成」をクリック
3. 既存のプロジェクトを使用する場合は、プロジェクト一覧から選択

#### 3. OAuth同意画面の設定（初回のみ）

1. 左メニューから「APIとサービス」→「OAuth同意画面」を選択
2. **ユーザータイプ**を選択：
   - **外部**: 一般ユーザーが使用する場合（推奨）
   - **内部**: Google Workspace組織内のみの場合
3. 「作成」をクリック
4. **アプリ情報**を入力：
   - **アプリ名**: `Portfolio` など任意の名前
   - **ユーザーサポートメール**: 自分のメールアドレス
   - **デベロッパーの連絡先情報**: 自分のメールアドレス
5. 「保存して次へ」をクリック
6. **スコープ**設定：
   - デフォルトのスコープで問題ない場合は「保存して次へ」
   - 必要に応じてスコープを追加
7. **テストユーザー**設定（外部ユーザータイプの場合）：
   - テスト用のGoogleアカウントを追加（本番公開前のみ必要）
   - 「保存して次へ」をクリック
8. **概要**を確認して「ダッシュボードに戻る」をクリック

#### 4. OAuth 2.0 クライアント IDの作成

1. 左メニューから「APIとサービス」→「認証情報」を選択
2. 画面上部の「+ 認証情報を作成」→「OAuth クライアント ID」を選択
3. **アプリケーションの種類**で「ウェブアプリケーション」を選択
4. **名前**を入力：`portfolio-web` など任意の名前
5. **承認済みのJavaScript生成元**に以下を追加：
    ```url
    http://localhost:3000
    http://localhost:5173
    https://www.rc.ageha734.jp
    https://www.stg.ageha734.jp
    https://www.ageha734.jp
    ```
   **注意**: 環境ごとに異なるドメインを使用する場合は、すべて追加してください。
6. **承認済みのリダイレクトURI**に以下を追加：
    ```url
    http://localhost:3000/api/auth/callback/google
    http://localhost:5173/api/auth/callback/google
    https://www.rc.ageha734.jp/api/auth/callback/google
    https://www.stg.ageha734.jp/api/auth/callback/google
    https://www.ageha734.jp/api/auth/callback/google
    ```
   **注意**:
   - 開発環境では `localhost:3000` または `localhost:5173` を使用
   - 本番環境では実際のドメインを使用（`www.{domain}` の形式）
   - リダイレクトURIは `/api/auth/callback/google` で終わる必要があります
7. 「作成」をクリック
8. **重要**: 表示された**クライアントID**と**クライアントシークレット**をコピー
   - **クライアントシークレットは再表示できないため、必ずコピーしてください**
   - 形式：
     - クライアントID: `xxxxx.apps.googleusercontent.com`
     - クライアントシークレット: ランダムな文字列

#### 5. 必要なAPIの有効化

1. 左メニューから「APIとサービス」→「ライブラリ」を選択
2. 「Google+ API」または「Google Identity」を検索
3. 必要に応じてAPIを有効化（通常は自動的に有効化されます）

### Google OAuth - 環境変数への設定

```env
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

**注意事項**:

- クライアントIDは `xxxxx.apps.googleusercontent.com` の形式です
- クライアントシークレットは再表示できないため、必ず安全な場所に保存してください
- 本番環境では、Dopplerにシークレットとして保存することを推奨します

### Google OAuth - トラブルシューティング

#### エラー: "redirect_uri_mismatch"

**原因**: 承認済みのリダイレクトURIに、実際に使用しているURIが登録されていない

**解決方法**:

1. Google Cloud Console → APIとサービス → 認証情報
2. 作成したOAuth 2.0 クライアント IDをクリック
3. 「承認済みのリダイレクトURI」に、エラーメッセージに表示されているURIを追加
4. 「保存」をクリック

#### エラー: "access_denied"

**原因**: OAuth同意画面が未公開で、テストユーザーに追加されていない

**解決方法**:

1. Google Cloud Console → APIとサービス → OAuth同意画面
2. 「テストユーザー」タブを選択
3. 「+ ADD USERS」をクリック
4. 使用するGoogleアカウントのメールアドレスを追加
5. または、アプリを本番公開する（一般ユーザーが使用可能になる）

#### エラー: "invalid_client"

**原因**: クライアントIDまたはクライアントシークレットが間違っている

**解決方法**:

1. `.env`ファイルの `GOOGLE_CLIENT_ID` と `GOOGLE_CLIENT_SECRET` を確認
2. Google Cloud Consoleで正しい値を確認
3. 必要に応じて新しいOAuth 2.0 クライアント IDを作成

#### 開発環境で動作しない場合

**確認事項**:

1. 承認済みのJavaScript生成元に `http://localhost:3000` または `http://localhost:5173` が追加されているか
2. 承認済みのリダイレクトURIに `http://localhost:3000/api/auth/callback/google` または `http://localhost:5173/api/auth/callback/google` が追加されているか
3. アプリケーションが実際に使用しているポート番号と一致しているか（`3000` または `5173`）

## Better Auth Secret

### Better Auth - 必要な情報

- `BETTER_AUTH_SECRET` - 認証用シークレットキー

### Better Auth - 生成手順

#### OpenSSLを使用する場合

```bash
openssl rand -base64 32
```

#### Node.jsを使用する場合

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### オンラインツールを使用する場合

1. [Secret Generator](https://generate-secret.vercel.app/32) にアクセス
2. 生成された文字列をコピー

### Better Auth - 環境変数への設定

```env
BETTER_AUTH_SECRET="your-generated-secret-key"
```

## TiDB Cloud接続情報

### TiDB Cloud - 必要な情報

- `DATABASE_URL` - データベース接続文字列
- `TIDB_HOST` - TiDBホスト名

### TiDB Cloud - 取得手順

1. [TiDB Cloud](https://tidbcloud.com/) にログイン
2. 対象のクラスターを選択
3. 「Connect」タブを選択
4. 「Standard Connection」セクションから以下をコピー：
   - **Host** → `TIDB_HOST`
   - **Port**: 通常は `4000`
   - **User**: データベースユーザー名
   - **Password**: データベースパスワード
   - **Database**: データベース名

### TiDB Cloud - 接続文字列の構築

```bash
# MySQL形式
mysql://user:password@host:4000/database?sslaccept=strict

# 例
DATABASE_URL="mysql://root:password@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/portfolio?sslaccept=strict"
```

### TiDB Cloud - 環境変数への設定

```env
DATABASE_URL="mysql://user:password@host:4000/database?sslaccept=strict"
TIDB_HOST="gateway01.ap-northeast-1.prod.aws.tidbcloud.com"
```

## まとめ

すべての認証情報を`.env`ファイルに設定すると、以下のようになります：

```env
# Cloudflare
CLOUDFLARE_API_TOKEN="your-token"
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_ZONE_ID="your-zone-id"

# Sentry
SENTRY_AUTH_TOKEN="your-token"
SENTRY_ORG="your-org-slug"
SENTRY_DSN="https://xxx@xxx.ingest.sentry.io/xxx"

# Grafana
GRAFANA_API_KEY="glsa_xxxxx"
GRAFANA_ORG_SLUG="your-org-slug"

# Redis Cloud
REDISCLOUD_ACCESS_KEY="your-access-key"
REDISCLOUD_SECRET_KEY="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key"

# TiDB Cloud
DATABASE_URL="mysql://user:password@host:4000/database?sslaccept=strict"
TIDB_HOST="your-tidb-host"

# Application
APP_VERSION="1.0.0"
NODE_ENV="development"
```

## verify.ts

すべてのAPIキーとトークンの有効性を確認するスクリプトです。

### verify.ts - 使用方法

```bash
# infraディレクトリから実行
cd infra
bun run verify

# または直接実行
bun run scripts/verify.ts
```

### verify.ts - 確認内容

スクリプトは`.env`ファイルから自動的に認証情報を読み込み、以下のすべてのAPIキーとトークンを検証します：

#### verify.ts - Cloudflare APIトークン

- ✅ トークンの有効性
- ✅ アカウントへのアクセス権限
- ✅ ゾーンへのアクセス権限
- ✅ DNSレコードの読み取り権限
- ✅ Pagesプロジェクトへのアクセス権限
- ✅ Workersへのアクセス権限

#### verify.ts - Sentry認証トークン

- ✅ トークンの有効性
- ✅ 組織へのアクセス権限
- ✅ チームへのアクセス権限
- ✅ プロジェクトへのアクセス権限

#### verify.ts - Grafana APIキー

- ✅ APIキーの有効性（Grafana Cloud / セルフホスト両対応）
- ✅ フォルダへのアクセス権限
- ✅ ダッシュボードへのアクセス権限

#### verify.ts - Redis Cloud APIキー

- ✅ Access KeyとSecret Keyの有効性
- ✅ サブスクリプションへのアクセス権限
- ✅ データベースへのアクセス権限

#### verify.ts - Doppler Service Token

- ✅ Service Tokenの有効性
- ✅ プロジェクト・コンフィグへのアクセス権限
- ✅ シークレットの読み取り権限

#### verify.ts - Google OAuth認証情報（確認内容）

- ✅ Client IDの形式チェック
- ✅ Client Secretの形式チェック

#### verify.ts - Better Auth Secret

- ✅ Secretの形式チェック（Base64形式、長さ）

#### verify.ts - TiDB Cloud接続情報

- ✅ DATABASE_URLの形式チェック
- ✅ TIDB_HOSTの形式チェック

### verify.ts - 必要な権限

#### verify.ts - Cloudflare APIトークン権限（詳細）

以下の権限が必要です：

- **Zone: DNS:Edit** - DNSレコードの作成・編集
- **Zone: Zone:Read** - ゾーン情報の読み取り
- **Account: Cloudflare Pages:Edit** - Pagesプロジェクトの作成・編集
- **Account: Workers Scripts:Edit** - Workersスクリプトの作成・編集
- **Account: Access: Apps and Policies:Edit** - Zero Trust Accessアプリケーションとポリシーの作成・編集（rc/stg環境でプレビューデプロイメントのアクセス制御に使用）

トークンの作成方法：

1. [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) にアクセス
2. 「Create Token」をクリック
3. 「Edit zone DNS」テンプレートを選択、またはカスタムトークンを作成
4. 上記の権限を設定

#### verify.ts - Sentry認証トークンスコープ

以下のスコープが必要です：

- **org:read** - 組織の読み取り
- **org:write** - 組織の書き込み
- **project:read** - プロジェクトの読み取り
- **project:write** - プロジェクトの書き込み
- **team:read** - チームの読み取り
- **team:write** - チームの書き込み

トークンの作成方法：

1. [Sentry API Tokens](https://sentry.io/settings/account/api/auth-tokens/) にアクセス
2. 「Create New Token」をクリック
3. 上記のスコープを選択
4. トークンを生成

### verify.ts - 環境変数

スクリプトは`.env`ファイルから自動的に読み込みます。以下の環境変数が検証対象です：

```env
# Cloudflare
CLOUDFLARE_API_TOKEN="your-token"
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_ZONE_ID="your-zone-id"

# Sentry
SENTRY_AUTH_TOKEN="your-token"
SENTRY_ORG="your-org-slug"

# Grafana
GRAFANA_API_KEY="your-api-key"
GRAFANA_ORG_SLUG="your-org-slug"

# Redis Cloud
REDISCLOUD_ACCESS_KEY="your-access-key"
REDISCLOUD_SECRET_KEY="your-secret-key"

# Doppler
DOPPLER_TOKEN="your-service-token"
DOPPLER_PROJECT="your-project"
DOPPLER_CONFIG="your-config"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Better Auth
BETTER_AUTH_SECRET="your-secret"

# TiDB Cloud
DATABASE_URL="mysql://user:password@host:4000/database"
TIDB_HOST="your-tidb-host"
```

環境変数を直接指定することもできます：

```bash
CLOUDFLARE_API_TOKEN="your-token" \
CLOUDFLARE_ACCOUNT_ID="your-account-id" \
CLOUDFLARE_ZONE_ID="your-zone-id" \
SENTRY_AUTH_TOKEN="your-token" \
SENTRY_ORG="your-org-slug" \
bun run verify:tokens
```

### verify.ts - 注意事項

- スクリプトは`.env`ファイルに設定されている認証情報を自動的に検証します
- 設定されていない認証情報については警告メッセージが表示されますが、エラーにはなりません
- Google OAuth、Better Auth Secret、TiDB Cloud接続情報は形式チェックのみ行います（実際の認証は行いません）
- Doppler Service Tokenはプロジェクトとコンフィグが指定されている場合のみAPIリクエストを送信します
- Grafana APIキーはGrafana CloudとセルフホストGrafanaの両方に対応しています
