---
title: "環境変数管理"
---

環境変数はセキュリティと設定の一貫性を保つため、次のルールで管理する。  
変数一覧は **.env.example** および各アプリの型定義（env.d.ts）を**単一の参照先**とし、このドキュメントでは方針とカテゴリのみ記載する。

## 命名規則（必須）

- **フロントエンド（Vite）で参照する変数**: 必ず **VITE_** プレフィックスを付ける。Vite がクライアントに露出するため、機密は入れない。
- **サーバーサイド（Remix loader、API、Workers）**: プレフィックスは付けない。DATABASE_URL、BETTER_AUTH_SECRET、API_BASE_URL 等。
- **禁止**: 機密を VITE_ 付きで定義しない。フロントで必要なのは公開してよい URL やフラグのみとする。

## 参照方法

- **Vite（フロント）**: **import.meta.env.VITE_*** で参照する。Cloudflare Workers 系では process.env は使わない。
- **Remix loader**: context.cloudflare.env または process.env（開発時）。実装は各ルートを参照する。
- **Cloudflare Pages/Workers**: wrangler.toml の vars またはシークレット（wrangler secret）。本番の機密はシークレットで渡す。
- **型**: 使用する変数は env.d.ts（ImportMetaEnv）で宣言し、型チェックを通す。追加・変更時はそこを更新する。

## 設定手順

- **ローカル**: .env.example をコピーして .env を作成し、必要な値を設定する。.env はコミットしない。
- **Cloudflare**: シークレットは wrangler またはダッシュボードで設定する。一括設定スクリプトがある場合はルートの scripts を参照する。
- **禁止**: .env をリポジトリにコミットしない。.gitignore に .env, .env.local, .env.*.local を含める。

## セキュリティ（必須）

- 機密（API キー、シークレット、パスワード）は**環境変数のみ**で渡す。コードにハードコードしてはならない。
- .env.example には**プレースホルダーや説明のみ**を書く。本番の値や実シークレットを書かない。
- シークレットの生成は OpenSSL 等の安全な方法で行う。手順は [APIキー・トークン発行手順](./api-keys-setup.md) や [セキュリティガイドライン](../security/guidelines.md) を参照する。
- ログやエラーレスポンスに環境変数の値を出さない。

## バリデーション

- 起動時または初期化時に、必須の環境変数を Zod 等で検証する。未設定・不正値の場合は起動を止めて明確にエラーを出す。
- フロントでは import.meta.env をラップした設定モジュールで型とバリデーションを揃える。実装は各アプリの env 設定を参照する。

## 変数のカテゴリ（一覧は .env.example を参照）

- **データベース**: DATABASE_URL
- **キャッシュ**: CACHE_URL
- **認証**: BETTER_AUTH_*, GOOGLE_*, GITHUB_*（OAuth）
- **Cloudflare**: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN（必要時）
- **アプリ**: NODE_ENV, API_BASE_URL, VITE_BASE_URL, VITE_API_URL
- **分析・監視**: VITE_GOOGLE_*, SENTRY_*, VITE_SENTRY_*
- **freee 連携**: FREEE_CLIENT_ID, FREEE_CLIENT_SECRET, FREEE_AUTH_BASE_URL, FREEE_API_BASE_URL（未設定時は本番 URL。mock 利用時は mock-apis の URL）
- **メール**: RESEND_API_KEY, RESEND_FROM_EMAIL
- **ストレージ**: R2_BUCKET, R2_PUBLIC_URL
- **API 共通**: CORS_ORIGINS

freee の開発用 mock（mock-apis）利用時は、FREEE_AUTH_BASE_URL / FREEE_API_BASE_URL を mock の URL にし、FREEE_CLIENT_ID / FREEE_CLIENT_SECRET は未設定で mock 用の既定値が使われる。本番の freee に繋ぐ場合は本番 URL と本番のクライアント情報を設定する。

## トラブルシューティング

- 読み込まれない: .env の配置・変数名（VITE_ 等）・アプリ再起動を確認する。
- Cloudflare で効かない: シークレット／vars の設定とプロジェクト名を確認する。一覧は [コマンド追加リスト](../../scripts/command-addition-list.md) のスクリプトまたは wrangler のドキュメントを参照する。
- 型エラー: env.d.ts にその変数を追加し、`bun run typecheck` で確認する。

## チェックリスト（運用）

- 新規セットアップ: .env.example から .env を作成し、BETTER_AUTH_SECRET を生成、DATABASE_URL と必要な OAuth を設定する。
- デプロイ前: 本番用の変数が Cloudflare に設定されていること、シークレットは wrangler secret 等で渡していること、.env がコミットされていないことを確認する。
- セキュリティ: ハードコードされた認証情報がないこと、ログに機密を出していないこと、不要な変数を削除していることを確認する。

## 参考資料

- [Vite 環境変数とモード](https://vitejs.dev/guide/env-and-mode.html)
- [Cloudflare Pages 環境変数](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)
- [Cloudflare Workers 環境変数](https://developers.cloudflare.com/workers/configuration/environment-variables/)
- プロジェクト内: [APIキー・トークン発行手順](./api-keys-setup.md)、[セキュリティガイドライン](../security/guidelines.md)
