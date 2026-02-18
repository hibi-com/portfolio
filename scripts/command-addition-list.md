# コマンド追加リスト

トラブルシューティングや開発手順では **bun および `bun run` のみ** を利用する。  
bunx・wrangler を直接叩かず、必要な操作はルートの `package.json` または対象パッケージにスクリプトを追加すること。  
このドキュメントは、そのために追加すべきスクリプトを TODO で管理する。  

## TODO（bun run で実行できるスクリプトが無いもの）

現在、追加が必要なコマンドはありません。

## 削除済み（他の方法で管理）

- ~~**Prisma migrate 系**~~ → ローカル: Docker Compose自動実行、本番: `infra/src/resources/databases.ts` で Pulumi管理
- ~~**Cloudflare Pages シークレット系**~~ → `infra/env.yaml` で Pulumi管理
- ~~**Cloudflare Pages デプロイ**~~ → CircleCI自動化のみ（ローカルデプロイ禁止）
- ~~**Wrangler 認証確認**~~ → ローカルデプロイ禁止のため不要
- ~~**Wrangler ログ監視**~~ → Grafana/Sentry等のSaaSで管理
- ~~**npm audit**~~ → 依存関係の脆弱性チェックは別ツールで管理

## 方針

- 上記は「wrangler / bunx を直接使わない」ために必要な候補。実装時はルートの `package.json` に `"d1:list": "..."` のように追加するか、apps/api 等のパッケージにスクリプトを追加し、ルートから `bun run d1:list --filter=@portfolio/api` のように呼ぶ形でもよい。
- 追加したら当該 TODO をチェックし、[トラブルシューティング](../docs/development/troubleshooting.md) の該当箇所で「`bun run xxx` で実行する」と記載する。
