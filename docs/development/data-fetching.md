---
title: "データフェッチング"
---

Remix を用いるアプリでは、データ取得・フォーム送信・キャッシュを次のルールで行う。実装例はリポジトリの routes と shared/lib を参照すること。

## ローダー（loader）

- ページに必要なデータは **loader** でサーバー側で取得する。クライアントでは **useLoaderData** で受け取る。
- 複数ソースのデータは **Promise.all** で並列取得し、無駄な直列化を避ける。
- データが無い場合は **throw new Response(..., { status: 404 })** で 404 を返す。空の JSON で誤って 200 を返さない。
- ローダー内の例外は catch し、適切な HTTP ステータス（400 / 404 / 500）で Response を throw する。詳細は [エラーハンドリング](./error-handling.md) を参照する。

## API クライアント

- バックエンド API を呼ぶ場合は **Orval 生成クライアント**（またはプロジェクトで定めた API ラッパー）を使う。URL を直書きした fetch は禁止する。
- ベース URL は環境に応じて切り替え、ローダーや shared の設定で一元管理する。実装は [API 設計ガイドライン](./api-design.md) を参照する。

## フォーム・アクション（action）

- フォーム送信は **action** で受け、**useActionData** で結果・エラーを扱う。
- 入力はバリデーション（Zod 等）してから処理する。失敗時は 400 とフィールド単位のエラーを返し、**useActionData** で表示する。
- **method="post"**（または put/delete）を明示する。GET で副作用を発生させない。

## useFetcher

- ページ遷移なしの取得・送信には **useFetcher** を使う。ローディング状態は fetcher.state 等で扱う。
- オプティミスティック UI を行う場合は、送信直後に UI を更新し、エラー時はロールバックする。

## キャッシュ・ヘッダー

- 変更頻度の低いデータには **Cache-Control** を付与する。`public, max-age=..., s-maxage=...` 等をレスポンスヘッダーで返す。Cloudflare のキャッシュを活用する。
- セッション（テーマ等）は Cookie ベースのストレージで管理する。httpOnly, secure, sameSite を適切に設定する。実装は root の loader と createCookieSessionStorage を参照する。

## 禁止事項

- ローダーで取得すべきデータをクライアントの useEffect でだけ取得しない（SEO・初回表示を考慮する）。
- 生の fetch で API URL を直書きしない。
- フォーム送信結果をチェックせずに成功扱いにしない。action の戻りと actionData で必ずエラーを表示する。
