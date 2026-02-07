# infra/scripts

このディレクトリのドキュメントと検証機能は次のとおりです。

## ドキュメント

- **APIキー・トークン発行手順**: [docs/development/api-keys-setup.md](../../docs/development/api-keys-setup.md)
- **TiDB Cloud 手動作成手順**: [docs/development/tidb-cloud-manual-setup.md](../../docs/development/tidb-cloud-manual-setup.md)
- **Redis Cloud 手動作成手順**: [docs/development/redis-cloud-manual-setup.md](../../docs/development/redis-cloud-manual-setup.md)

## APIキー・トークン検証

検証は `scripts/check` の `infra` サブコマンドで実行します。リポジトリルートで:

```bash
bun run check infra
```

詳細は [docs/development/api-keys-setup.md](../../docs/development/api-keys-setup.md) の「check infra コマンド」を参照してください。
