# コマンド追加リスト

トラブルシューティングや開発手順では **bun および `bun run` のみ** を利用する。bunx・wrangler を直接叩かず、必要な操作はルートの `package.json` または対象パッケージにスクリプトを追加すること。このドキュメントは、そのために追加すべきスクリプトを TODO で管理する。

## TODO（bun run で実行できるスクリプトが無いもの）

- [ ] **Prisma migrate status**: `packages/db` で `prisma migrate status` を実行するスクリプト（例: ルートの `bun run db:migrate:status` で `packages/db` の prisma を実行）。
- [ ] **Prisma migrate reset**: 開発環境用の `prisma migrate reset` を `bun run` で実行するスクリプト（例: `bun run db:migrate:reset`）。
- [ ] **Prisma migrate deploy**: `prisma migrate deploy` を `bun run` で実行するスクリプト（例: `bun run db:migrate:deploy`）。
- [ ] **Prisma migrate dev**: マイグレーション新規作成・適用（`prisma migrate dev --name <name>`）を `bun run` で実行するスクリプト（例: `bun run db:migrate:dev -- --name migration_name`）。
- [ ] **Wrangler 認証確認**: `wrangler whoami` に相当するスクリプト（例: `bun run cf:whoami`）。
- [ ] **Cloudflare Pages シークレット一覧**: `wrangler pages secret list --project-name <project>` に相当するスクリプト（例: `bun run cf:pages:secrets:list`。プロジェクト名は引数または env で指定）。
- [ ] **Cloudflare Pages シークレット設定**: `wrangler pages secret put <NAME> --project-name <project>` に相当するスクリプト（例: `bun run cf:pages:secret:put`。名前・値は引数または env で指定）。
- [ ] **Cloudflare Pages デプロイ（詳細ログ）**: `wrangler pages deploy ./build --project-name <project> --verbose` に相当するスクリプト。既存の `bun run deploy` で足りない場合は、verbose 版を追加するか `deploy` にオプションで渡せるようにする。
- [ ] **Wrangler ログ監視**: `wrangler tail --format=pretty` に相当するスクリプト（例: `bun run cf:tail`。プロジェクト名・環境は引数または env で指定）。
- [ ] **npm audit**: `npm audit --audit-level=moderate` に相当するスクリプト（例: `bun run audit`）。Bunには`bun audit`がないため、npm を呼び出すか、代替ツールを検討。

## 方針

- 上記は「wrangler / bunx を直接使わない」ために必要な候補。実装時はルートの `package.json` に `"d1:list": "..."` のように追加するか、apps/api 等のパッケージにスクリプトを追加し、ルートから `bun run d1:list --filter=@portfolio/api` のように呼ぶ形でもよい。
- 追加したら当該 TODO をチェックし、[トラブルシューティング](../docs/development/troubleshooting.md) の該当箇所で「`bun run xxx` で実行する」と記載する。
