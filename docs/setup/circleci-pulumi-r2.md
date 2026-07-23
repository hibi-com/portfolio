---
title: "CircleCI 設定手順（Pulumi × R2 backend）"
---

# CircleCI 設定手順（Pulumi × R2 backend）

Pulumi の state を Pulumi Cloud ではなく **Cloudflare R2** に置き、CircleCI から `pulumi preview` / `pulumi up` するまでの手順です。

前提:

- R2 バケット `portfolio-pulumi-state` が作成済み（非公開）
- S3 API エンドポイント例: `https://b9674389841acb96481df74f4ce796fb.r2.cloudflarestorage.com`

---

## 1. R2 API トークンを発行する

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) を開く
2. 左メニュー **R2** を選択（特定バケットの中ではなく、R2 のトップ）
3. **Manage R2 API Tokens**（または「API トークンを管理」）を開く
4. **Create Account API token** を選択
5. 次のように設定する

| 項目 | 推奨値 |
| ---- | ------ |
| Token name | `portfolio-pulumi-ci` など |
| Permissions | **Object Read & Write**（Apply 用） |
| Apply to buckets | **Apply to specific buckets only** → `portfolio-pulumi-state` のみ |
| TTL | 運用方針に合わせて設定（無期限でも可） |

6. 作成後、次を控える（**Secret は再表示できない**）

- Access Key ID → CircleCI の `AWS_ACCESS_KEY_ID`
- Secret Access Key → CircleCI の `AWS_SECRET_ACCESS_KEY`

> 名前が `AWS_*` なのは Pulumi が S3 互換 SDK を使うためです。AWS アカウントは不要で、中身は R2 のキーです。

---

## 2. Pulumi 用パスフレーズを用意する

DIY backend（R2）ではスタックシークレットの暗号化にパスフレーズが必要です。

```bash
openssl rand -base64 32
```

出力を `PULUMI_CONFIG_PASSPHRASE` として使う。

**重要:**

- 紛失すると既存スタックのシークレットを復号できない
- パスワードマネージャ等に保管する
- ローカルと CircleCI で **同じ値** を使う

---

## 3. Backend URL を組み立てる

次の形式です（クオート必須。`&` がシェルで切れるため）。

```bash
PULUMI_BACKEND_URL='s3://portfolio-pulumi-state?endpoint=b9674389841acb96481df74f4ce796fb.r2.cloudflarestorage.com&region=auto'
```

| 要素 | 値 |
| ---- | --- |
| バケット名 | `portfolio-pulumi-state` |
| endpoint | Account の R2 S3 API ホスト（`https://` は付けない） |
| region | `auto` |

エンドポイントはバケットの **一般 → S3 API** に表示されます。  
`https://xxxx.r2.cloudflarestorage.com/portfolio-pulumi-state` のようにパス付きで出る場合は、**ホスト部分だけ**を `endpoint=` に使います。

---

## 4. CircleCI Context `pulumi` に登録する

1. [CircleCI](https://app.circleci.com/) → Organization Settings → **Contexts**
2. Context 名 **`pulumi`** を開く（無ければ作成）
3. 次の環境変数を追加する

| 変数名 | 値 | 必須 |
| ------ | --- | ---- |
| `AWS_ACCESS_KEY_ID` | R2 Access Key ID | ✅ |
| `AWS_SECRET_ACCESS_KEY` | R2 Secret Access Key | ✅ |
| `PULUMI_BACKEND_URL` | 上記の `s3://portfolio-pulumi-state?endpoint=...&region=auto` | ✅ |
| `PULUMI_CONFIG_PASSPHRASE` | `openssl rand -base64 32` の結果 | ✅ |

### 削除してよいもの

| 変数名 | 理由 |
| ------ | ---- |
| `PULUMI_ACCESS_TOKEN` | Pulumi Cloud 用。R2 backend では不要 |

> `infra-*` ジョブは `.circleci/config.yml` で `context: pulumi` を参照します。Context 名は `pulumi` のままにしてください。

---

## 5. あわせて確認する他 Context（参考）

アプリデプロイ用（今回の R2 state とは別）:

| Context | 主な変数 |
| ------- | -------- |
| `env-config` | `ENV_CONFIG_RC` / `ENV_CONFIG_STG` / `ENV_CONFIG_PRD`（`upload-env-to-circleci.sh` で登録済みなら OK） |
| `cloudflare` | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`（＋必要なら `CLOUDFLARE_ZONE_ID`） |
| `sentry` | `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`（任意） |

---

## 6. ローカルでも同じ backend を使う（任意）

```bash
export AWS_ACCESS_KEY_ID='...'
export AWS_SECRET_ACCESS_KEY='...'
export PULUMI_CONFIG_PASSPHRASE='...'
export PULUMI_BACKEND_URL='s3://portfolio-pulumi-state?endpoint=b9674389841acb96481df74f4ce796fb.r2.cloudflarestorage.com&region=auto'

cd infra
pulumi login "$PULUMI_BACKEND_URL"
pulumi stack select prd   # 無ければ pulumi stack init prd
pulumi preview
```

初回は空の backend から始まるため、Pulumi Cloud 上の既存 state は **自動では引き継がれません**。移行が必要なら別途 `pulumi stack export` / `import` を検討してください。今回の方針が「prd を新規」なら `stack init` で問題ありません。

---

## 7. 動作確認チェックリスト

- [x] R2 バケット `portfolio-pulumi-state` が非公開
- [x] CircleCI Context `pulumi` に 4 変数が入っている
- [x] `env.yaml` の Cloudflare / Sentry が埋まっており `ENV_CONFIG_*` が最新
- [ ] master で `infra-plan` が R2 login → preview まで成功する
- [ ] （任意）approval 後に `infra-deploy` で `pulumi up`

リポジトリ側は次を設定済みです。

- `infra/Pulumi.yaml` の `backend.url`（R2）
- CircleCI `infra-plan` / `infra-deploy` が `PULUMI_BACKEND_URL` で login
- `ENV_CONFIG` → `infra/env.yaml` → `infra/.env` への展開（`prepare-infra-env`）

失敗しやすい点:

- `endpoint` に `https://` を付けてしまう → **ホスト名のみ**
- `PULUMI_BACKEND_URL` をクオートせず登録し `&region=auto` が欠ける
- パスフレーズがローカルと CI で異なる
- `env.yaml` の `infra.cloudflare.*` / `infra.sentry.*` が空のまま

---

## 関連

- [API Key Setup](./api-keys.md)
- [CI/CD ツール](../development/ci-cd-tools.md)
- [自動化デプロイ概要](../deployment/automation-complete.md)
