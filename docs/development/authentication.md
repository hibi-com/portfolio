---
title: "認証と認可"
---

このプロジェクトでは、Better-authを使用して認証と認可を実装しています。

## Better-auth の概要

Better-authは、モダンな認証ライブラリで、次の機能を提供します：

- セッション管理
- OAuth統合（Google、GitHubなど）
- 型安全なAPI
- Prisma統合

## 認証の設定

### 初期化

認証は `packages/auth/src/index.ts` で初期化されます。

```typescript
// packages/auth/src/index.ts
import { initAuth } from "@portfolio/auth";

const auth = initAuth({
    baseUrl: "http://localhost:3000",
    productionUrl: "https://example.com",
    secret: process.env.BETTER_AUTH_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    d1: env.DB, // Cloudflare D1（本番環境）
    databaseUrl: process.env.DATABASE_URL, // 開発環境
});
```

### 環境変数

認証に必要な環境変数：

```bash
# .env
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### シークレットの生成

```bash
# OpenSSLを使用してシークレットを生成
openssl rand -base64 32

# または、Node.jsを使用
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## OAuth プロバイダーの設定

### Google OAuth

1. **Google Cloud Consoleでプロジェクトを作成**

2. **OAuth 2.0 クライアントIDを作成**

3. **リダイレクトURIを設定**

   ```url
   https://your-domain.com/api/auth/callback/google
   ```

4. **環境変数を設定**

```bash
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### GitHub OAuth（オプション）

```typescript
// packages/auth/src/index.ts
socialProviders: {
    github: {
        clientId: options.githubClientId,
        clientSecret: options.githubClientSecret,
        redirectURI: `${options.productionUrl}/api/auth/callback/github`,
    },
}
```

## 認証エンドポイント

### 認証ハンドラー

Cloudflare Pages Functionsで認証ハンドラーを設定します。

```typescript
// apps/wiki/functions/api/auth/[[path]].ts
import { initAuth } from "@portfolio/auth";

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const productionUrl = "https://wiki.ageha734.jp";

    const auth = initAuth({
        baseUrl,
        productionUrl,
        secret: env.BETTER_AUTH_SECRET,
        googleClientId: env.GOOGLE_CLIENT_ID ?? "",
        googleClientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
        d1: env.DB,
    });

    return auth.handler(request);
};
```

### 利用可能なエンドポイント

- `POST /api/auth/sign-in`: サインイン
- `POST /api/auth/sign-up`: サインアップ
- `POST /api/auth/sign-out`: サインアウト
- `GET /api/auth/session`: セッション情報の取得
- `GET /api/auth/callback/google`: Google OAuthコールバック

## クライアント側での使用

### セッションの取得

```typescript
// クライアント側でセッションを取得
const response = await fetch("/api/auth/session");
const session = await response.json();

if (session?.user) {
    // ユーザーがログインしている
    console.log("User:", session.user);
}
```

### サインイン

```typescript
// メールアドレスとパスワードでサインイン
const response = await fetch("/api/auth/sign-in", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        email: "user@example.com",
        password: "password",
    }),
});

const result = await response.json();
```

### OAuth サインイン

```typescript
// Google OAuthでサインイン
window.location.href = "/api/auth/sign-in/google";
```

### サインアウト

```typescript
const response = await fetch("/api/auth/sign-out", {
    method: "POST",
});

if (response.ok) {
    // サインアウト成功
    window.location.href = "/";
}
```

## サーバー側での認証

### セッションの検証

```typescript
// apps/api/src/interface/middleware/auth.ts
import { auth } from "@portfolio/auth";

export async function authenticate(ctx: Context): Promise<{ userId: string } | null> {
    const session = await auth.api.getSession({
        headers: ctx.headers,
    });

    return session?.user ? { userId: session.user.id } : null;
}
```

### 保護されたルート

```typescript
// RESTハンドラーで認証を要求
import type { Context } from "hono";
import { authenticate } from "../middleware/auth";

export async function createPost(c: Context) {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Authentication required" }, 401);
    }

    const body = await c.req.json();
    // 認証されたユーザーのみが実行可能
    const post = await createPostUseCase.execute(body, user.userId);
    return c.json(post);
}
```

## 認可（Authorization）

### ロールベースのアクセス制御

```typescript
// ユーザーのロールを確認
const user = await getUser(userId);
if (user.role !== "admin") {
    return c.json({ error: "Admin access required" }, 403);
}
```

### リソースベースのアクセス制御

```typescript
// リソースの所有者を確認
const post = await getPost(postId);
if (post.authorId !== userId) {
    return c.json({ error: "You don't have permission to access this resource" }, 403);
    });
}
```

## セキュリティベストプラクティス

### 1. シークレットの管理

- シークレットキーは環境変数として管理
- 本番環境では、Cloudflareのシークレット機能を使用
- 定期的にシークレットをローテーション

### 2. セッション管理

- セッションの有効期限を適切に設定
- HTTPSを使用してセッションクッキーを保護
- セッションの無効化を実装

### 3. パスワードのハッシュ化

Better-authは自動的にパスワードをハッシュ化します。

### 4. CSRF保護

Better-authは自動的にCSRF保護を実装します。

### 5. レート制限

```typescript
// レート制限の実装（例）
const rateLimiter = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const requests = rateLimiter.get(ip) || [];
    const recentRequests = requests.filter((time) => now - time < 60000); // 1分以内

    if (recentRequests.length >= 5) {
        return false; // レート制限超過
    }

    recentRequests.push(now);
    rateLimiter.set(ip, recentRequests);
    return true;
}
```

## トラブルシューティング

### セッションが取得できない

```bash
# 環境変数を確認
echo $BETTER_AUTH_SECRET

# データベースの接続を確認
wrangler d1 execute portfolio-db --command "SELECT * FROM sessions"
```

### OAuth認証が失敗する

1. **リダイレクトURIを確認**

   ```url
   https://your-domain.com/api/auth/callback/google
   ```

2. **クライアントIDとシークレットを確認**

   ```bash
   echo $GOOGLE_CLIENT_ID
   echo $GOOGLE_CLIENT_SECRET
   ```

3. **Google Cloud Consoleの設定を確認**

### データベースエラー

```bash
# Prismaスキーマを確認
cat packages/db/prisma/schema.prisma

# マイグレーションを適用（db パッケージで実行）
bun --cwd packages/db x prisma migrate deploy
```

## 参考資料

- [Better-auth ドキュメント](https://www.better-auth.com/docs)
- [OAuth 2.0 仕様](https://oauth.net/2/)
- [Cloudflare Workers 認証](https://developers.cloudflare.com/workers/examples/auth-with-headers/)
