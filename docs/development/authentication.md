---
title: "認証と認可"
---

このプロジェクトでは **Better-auth** を用いて認証と認可を実装する。  
このドキュメントは、認証まわりで守るルールと設定の考え方を示す。  
実装の詳細は `packages/auth` および各アプリの認証ハンドラーを参照すること。

## Better-auth の位置づけ

- 認証基盤は Better-auth に統一する。別の認証ライブラリを併用しない。
- 提供する機能: セッション管理、OAuth（Google / GitHub 等）、型安全な API、Prisma 等 DB との統合。
- 初期化と設定は `packages/auth` で行い、各アプリ（api / web / admin / wiki）はそのパッケージを利用する。

## 設定と環境変数

### 必須の設定

- **baseUrl / productionUrl**: 認証コールバック等で使うアプリの URL。開発・本番で切り替える。
- **secret**: セッション等の署名に使う秘密鍵。環境変数で渡し、リポジトリに含めない。
- **OAuth**: 利用するプロバイダ（Google 等）の Client ID / Client Secret を環境変数で渡す。
- **データベース**: Cloudflare D1 または DATABASE_URL で、Better-auth が利用する DB を指定する。

### シークレットの扱い

- シークレットは環境変数のみで管理する。コードにハードコードしてはならない。
- 本番では Cloudflare のシークレット機能等で注入する。定期的なローテーションを検討する。
- 生成方法（OpenSSL 等）は [APIキー・トークン発行手順](../setup/api-keys.md) や [セキュリティガイドライン](../security/guidelines.md) を参照する。

## OAuth プロバイダー

### Google OAuth

- Google Cloud Console で OAuth 2.0 クライアントを作成し、リダイレクト URI を登録する。
- リダイレクト URI は「アプリのベース URL + `/api/auth/callback/google`」とする。本番・開発で異なる場合は両方登録する。
- Client ID と Client Secret は環境変数で渡す。実装は `packages/auth` の初期化オプションを参照する。

### その他プロバイダー（GitHub 等）

- 利用する場合は Better-auth の socialProviders で設定する。リダイレクト URI はプロバイダーごとの仕様に合わせる。
- 設定内容は `packages/auth` を参照すること。

## 認証エンドポイント

- 認証ハンドラーは Better-auth の handler を各アプリのルーティングに組み込む。Cloudflare Pages の場合は Functions のパスで `/api/auth/[[path]]` のようにマウントする。
- 利用するエンドポイントの例: サインイン（POST）、サインアップ（POST）、サインアウト（POST）、セッション取得（GET）、OAuth コールバック（GET）。正式な一覧は Better-auth のドキュメントと `packages/auth` の実装を参照する。
- 認証エンドポイントの URL は、クライアントから同一オリジンまたは設定されたベース URL で参照する。直書きの絶対 URL は設定で一元管理すること。

## クライアント側の利用

- セッション取得は `/api/auth/session` に GET し、レスポンスの user の有無でログイン状態を判定する。
- サインインは POST でメール・パスワードを送るか、OAuth の場合は認証開始 URL（例: `/api/auth/sign-in/google`）へリダイレクトする。
- サインアウトは POST でサインアウトエンドポイントを呼び、成功後に必要ならトップ等へ遷移する。
- 実装例（fetch の書き方・ラッパー）は各アプリの共有層を参照すること。

## サーバー側の認証・認可

### 認証の必須化

- 保護したいルートでは、必ずセッションを検証してから処理する。Better-auth の getSession 相当でヘッダーからセッションを取得し、ユーザーが居なければ 401 を返す。
- 認証ミドルウェアは `apps/api` 等に用意し、保護対象ルートで共通利用する。実装はリポジトリの middleware / ハンドラーを参照する。

### 認可（Authorization）

- ロールベース: 管理者専用の操作では、セッションのユーザーが所定のロール（例: admin）を持つか確認する。持たない場合は 403 を返す。
- リソースベース: 編集・削除などは「そのリソースの所有者または権限を持つユーザーか」を確認する。権限が無い場合は 403 を返す。
- 認可チェックを省略してはならない。認証済みであれば誰でも操作できるようにしない。

## セキュリティ上のルール

- **シークレット**: 環境変数で渡し、ログやレスポンスに含めない。
- **セッション**: 有効期限を適切に設定する。HTTPS でクッキーを保護し、サインアウト・無効化を実装する。
- **パスワード**: Better-auth の既定のハッシュ化に任せ、平文で保存・送信してはならない。
- **CSRF**: Better-auth の CSRF 保護を有効にし、無効化しない。
- **レート制限**: サインイン・サインアップ等のエンドポイントにはレート制限をかける。実装は `apps/api` のミドルウェアや [セキュリティガイドライン](../security/guidelines.md) を参照する。

## トラブルシューティング

- セッションが取れない場合: 環境変数（BETTER_AUTH_SECRET 等）が設定されているか、DB にセッションが存在するかを確認する。
- OAuth が失敗する場合: プロバイダーに登録したリダイレクト URI がアプリの URL と一致しているか、Client ID / Secret が正しいかを確認する。
- DB エラー: スキーマとマイグレーションが適用されているか確認する。マイグレーション実行は [トラブルシューティング](./troubleshooting.md) および `bun run` で実行するスクリプトを参照する。

## 参考資料

- [Better-auth ドキュメント](https://www.better-auth.com/docs)
- [OAuth 2.0 仕様](https://oauth.net/2/)
- プロジェクト内: [APIキー・トークン発行手順](../setup/api-keys.md)、[セキュリティガイドライン](../security/guidelines.md)、[トラブルシューティング](./troubleshooting.md)
