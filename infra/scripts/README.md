# Infrastructure Scripts

このディレクトリには、インフラストラクチャ管理のためのスクリプトが含まれています。

## upload-env-to-circleci.sh

環境設定（`env.yaml`）をbase64エンコードしてCircleCIの環境変数に自動アップロードするスクリプトです。

### 前提条件

1. **CircleCI Personal API Token**の取得
   - https://app.circleci.com/settings/user/tokens
   - "Create New Token"をクリック
   - トークン名を入力（例: "env-config-upload"）
   - トークンをコピーして保存

2. **環境変数の設定**

```bash
export CIRCLECI_API_TOKEN="your_circleci_token_here"
export CIRCLE_PROJECT_USERNAME="ageha734"
export CIRCLE_PROJECT_REPONAME="portfolio"
```

### 使い方

#### すべての環境（RC/STG/PRD）にアップロード

```bash
cd infra/scripts
./upload-env-to-circleci.sh all
```

#### 特定の環境のみアップロード

```bash
# RC環境のみ
./upload-env-to-circleci.sh rc

# STG環境のみ
./upload-env-to-circleci.sh stg

# PRD環境のみ
./upload-env-to-circleci.sh prd
```

### アップロードされる環境変数

- `ENV_CONFIG_RC`: RC環境用の設定（base64エンコード済み）
- `ENV_CONFIG_STG`: STG環境用の設定（base64エンコード済み）
- `ENV_CONFIG_PRD`: PRD環境用の設定（base64エンコード済み）

### CircleCIでの使用方法

CircleCI側では、各ジョブで`load-env-config`コマンドを使用して自動的にデコードされます：

```yaml
- load-env-config:
    environment: rc  # または stg, prd
```

デコード後、`infra/env.yaml`として利用可能になります。

### セキュリティ

- ⚠️ **重要**: `env.yaml`には機密情報が含まれているため、Gitにコミットしないでください
- `.gitignore`で`infra/env.yaml`が除外されていることを確認してください
- CircleCIの環境変数は暗号化されて保存されます

### トラブルシューティング

#### エラー: CIRCLECI_API_TOKEN is not set

環境変数が設定されていません。上記の「前提条件」を確認してください。

#### エラー: env.yaml not found

`infra/env.yaml`が存在しません。`env.example.yaml`をコピーして設定してください：

```bash
cd infra
cp env.example.yaml env.yaml
# env.yamlを編集して実際の値を設定
```

#### エラー: Failed to upload

- CircleCI API Tokenが正しいか確認
- `CIRCLE_PROJECT_USERNAME`と`CIRCLE_PROJECT_REPONAME`が正しいか確認
- ネットワーク接続を確認

### 設定の確認

アップロード後、CircleCIの設定ページで確認できます：

```
https://app.circleci.com/settings/project/gh/{username}/{repo}/environment-variables
```

環境変数の値は`••••••`のように隠されて表示されます（セキュリティのため）。

### 環境設定の更新

`env.yaml`を更新した場合は、再度このスクリプトを実行してください：

```bash
# env.yamlを編集
vim infra/env.yaml

# CircleCIに再アップロード
./infra/scripts/upload-env-to-circleci.sh all
```

更新後、次のCircleCIビルドから新しい設定が使用されます。
