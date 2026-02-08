# Cloudflare Pages Service Binding & TiDB Cloud クラスター作成 修正作業ログ

## 日時
2026-01-26

## 解釈した仕様

### 問題の概要
`pulumi up` 実行時に Cloudflare Pages Project の Service Binding 設定でエラーが発生。
```
"Invalid Service name (). Check your Service name and try again."
```

デバッグログでは正しいサービス名（`portfolio-api-tntk2h`）が表示されるが、Cloudflare API には空の値が送信されていた。

### 根本原因
Pulumi Cloudflare Provider v6.13.0 の `PagesProject` リソースで `services` プロパティを設定する際、`pulumi.Output` の値が正しく Cloudflare API に渡されないバグが存在。

## 変更したファイル

### `infra/src/resources/pages.ts`

#### 変更内容
1. `@pulumi/command` パッケージをインポート追加
2. `PagesOutputs` インターフェースに `serviceBindingCommands` プロパティを追加
3. `deploymentConfigs` から `services` プロパティの設定を削除（Pulumi Provider のバグ回避）
4. `local.Command` リソースを追加し、Cloudflare API を直接呼び出して Service Binding を設定
5. `InfraConfig` から `apiToken` を取得して API 認証に使用

#### 技術的詳細
- Pulumi Cloudflare Provider の `services` プロパティは、ネストされた `pulumi.Output` 構造を正しく解決できない問題がある
- 回避策として、`PagesProject` リソース作成後に `command.local.Command` で Cloudflare REST API を PATCH リクエストで呼び出し
- `dependsOn` で `PagesProject` への依存関係を設定し、リソース作成順序を保証

## 検証した結果

### 成功したデプロイ
```
Resources:
    ~ 2 updated
    103 unchanged
```

### Cloudflare API レスポンス
```json
{
  "services": {
    "API_SERVICE": {
      "service": "portfolio-api-tntk2h",
      "environment": "production"
    }
  },
  "success": true,
  "errors": [],
  "messages": []
}
```

## 残っている課題

1. **Pulumi Cloudflare Provider のバグ報告**
   - GitHub issue を作成して、`PagesProject.deploymentConfigs.services` の `pulumi.Output` 解決問題を報告することを推奨

2. **`local.Command` の冪等性**
   - 現在の実装では、`pulumi up` を実行するたびに curl コマンドが実行される
   - `triggers` プロパティで変更検知を行っているが、完全な冪等性は保証されない

3. **DATABASE_URL 未設定の警告**
   - TiDB Cloud クラスターが未作成のため、DATABASE_URL が空
   - これは Service Binding とは別の問題

## 追加されたパッケージ
- `@pulumi/command@1.1.3`

# TiDB Cloud クラスター自動作成

## 問題の概要
`pulumi up` 実行時に TiDB Cloud クラスターが自動作成されない。

### 根本原因
1. Pulumi Dynamic Provider が Node.js の `https` および `crypto` モジュールをシリアライズできない
2. TiDB Cloud API エンドポイントが Serverless クラスター用のものと異なっていた

## 変更したファイル

### `infra/src/provider/tidbcloud.ts`

#### 変更内容
1. Dynamic Provider から `@pulumi/command` ベースの実装に変更
2. `curl --digest` を使用して TiDB Cloud API を呼び出し
3. API エンドポイントを `https://serverless.tidbapi.com/v1beta1/clusters` に修正
4. リクエストボディを Serverless API v1beta1 形式に修正

#### 技術的詳細
- Pulumi Dynamic Provider は Lambda 関数をシリアライズする際、外部モジュール（`https`, `crypto`）を含められない
- 回避策として、`command.local.Command` で curl コマンドを実行
- Digest 認証は curl の `--digest` フラグで処理

### `infra/src/resources/databases.ts`

#### 変更内容
1. `TiDBCloudServerlessCluster` クラスから `TiDBCloudServerlessClusterOutputs` 型に変更
2. `createTiDBCloudServerlessCluster` 関数を使用するように更新
3. 未使用の `command` インポートを削除

### `infra/src/index.ts`

#### 変更内容
1. `dependsOn` の対象を `tidb.cluster` から `tidb.cluster?.createCommand` に変更

## 検証した結果

### 成功したデプロイ
```
Resources:
    ~ 1 updated
    111 unchanged
```

### TiDB Cloud API レスポンス
```json
{
  "clusterId": "10699309616472872178",
  "displayName": "portfolio-db",
  "region": {
    "name": "regions/aws-ap-northeast-1",
    "displayName": "Tokyo (ap-northeast-1)"
  },
  "state": "CREATING",
  "servicePlan": "Starter"
}
```

## 残っている課題

1. **クラスター作成後の接続情報取得**
   - クラスターは "CREATING" 状態で作成される
   - ACTIVE になるまで `endpoints.public.host` と `userPrefix` が空
   - 現状では次回の `pulumi up` 実行時に接続情報を取得する必要がある

2. **DATABASE_URL の自動設定**
   - クラスターが ACTIVE になった後、接続情報を取得して DATABASE_URL を設定する必要がある
   - 手動で TiDB Cloud ダッシュボードから接続文字列を取得し、Doppler に設定することも可能

3. **冪等性の改善**
   - 既存クラスターがある場合の検出と再利用ロジックが未実装
   - 現状では `pulumi up` のたびにクラスター作成を試みる（エラーになる可能性）

## 追加された Doppler シークレット
- `TIDBCLOUD_PUBLIC_KEY`
- `TIDBCLOUD_PRIVATE_KEY`
