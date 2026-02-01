# @portfolio/mock-apis

開発・E2E 用の擬似外部 API サーバー。freee 会計 API の必要エンドポイントを再現し、docker compose で api から利用できるようにする。

## freee 擬似エンドポイント

freee API 仕様に沿ったパスを同一オリジンで提供する。

| パス | メソッド | 説明 |
|------|----------|------|
| `/public_api/authorize` | GET | OAuth 認可（redirect_uri へ code 付きでリダイレクト） |
| `/public_api/token` | POST | トークン発行（authorization_code / refresh_token） |
| `/api/1/companies` | GET | 事業所一覧（Bearer 必須） |
| `/api/1/partners` | GET | 取引先一覧（company_id, limit） |
| `/api/1/partners` | POST | 取引先作成 |
| `/api/1/partners/:id` | GET | 取引先1件 |
| `/api/1/partners/:id` | PUT | 取引先更新 |

## 起動

```bash
bun run dev
# または
PORT=3920 bun run dev
```

デフォルトポート: `3920`。

## docker compose での利用

api サービスに `FREEE_AUTH_BASE_URL` と `FREEE_API_BASE_URL` を `http://mock-apis:3920` に設定すると、本番の freee の代わりにこの mock に接続する。
