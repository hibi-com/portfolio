# Cloudflare 専用インフラ化

日付: 2026-07-23

## 概要

Pulumi インフラを Cloudflare のみに再構成。TiDB Cloud / Redis Cloud / Backblaze / Grafana を削除し、D1 / Workers KV / R2（アプリ画像）を追加。ドメイン命名を `env.app.base`（prd は `app.base`）に統一。

## 変更内容

- `infra/src/hostname.ts` 追加（`appHostname` / `dnsRecordName`）
- `infra/src/resources/cloudflare-data.ts` 追加（D1 / KV / R2）
- Redis / TiDB / Backblaze / Grafana リソース・依存関係を削除
- Workers / Pages / DNS を新ホスト命名に合わせて更新
- `docs/specs/infra/overview.md` を Cloudflare 専用仕様に更新

## 未実施

- `pulumi up` は実行していない
- コミットは作成していない
- 依存解決（`@libsql/client` など別変更起因）により型チェック未実行
