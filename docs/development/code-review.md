---
title: "コードレビューガイド"
description: レビュー観点、良い例・悪い例、レビュープロセス
---

<!-- markdownlint-disable MD036 -->

## 概要

本ドキュメントは、プロジェクトのコードレビュー基準を定義します。

### レビューの目的

1. **品質向上**: バグ混入防止、可読性・保守性向上
2. **セキュリティ確保**: OWASP Top 10への対応
3. **パフォーマンス最適化**: ボトルネック早期発見
4. **知識共有**: チーム内での設計・実装パターン共有
5. **アーキテクチャ整合性**: DDD・FSD原則の維持

### レビュープロセス

```mermaid
graph LR
    A[実装完了] --> B[自動チェック]
    B --> C[/review スキル実行]
    C --> D{総合評価}
    D -->|🔴 クリティカル| E[即修正]
    D -->|🟠 重要| F[修正推奨]
    D -->|✅ 承認| G[マージ可能]
    E --> H[修正実施]
    F --> H
    H --> I[再レビュー]
    I --> C
```

### レビュータイミング

| タイミング | 実行方法 |
| ---------- | -------- |
| PR作成時 | `/review` スキル実行（自動） |
| 機能実装完了時 | `/review` スキル実行 |
| 大規模リファクタリング後 | `/review` スキル実行 |
| 定期レビュー | 月次（全体の品質確認） |

## IMPORTANT: 即却下基準（絶対にマージ不可）

以下の項目が1つでも該当する場合、**即座にPRを却下**。修正なしにマージは不可。

### 🔴 セキュリティ（最重要）

| 項目 | 基準 | 検出方法 |
| ---- | ---- | -------- |
| **SQLインジェクション脆弱性** | 生SQLに未検証の入力値を直接埋め込み | コードレビュー、`grep "\$queryRawUnsafe"` |
| **XSS脆弱性** | `dangerouslySetInnerHTML`でサニタイズなし | `grep "dangerouslySetInnerHTML"` |
| **認証情報ハードコード** | APIキー、パスワードのハードコード | `grep -E "password.*=.*['\"]&#124;api.*key.*=.*['\"]"` |
| **認証バイパス** | 認証なしで保護されたリソースへアクセス可能 | コードレビュー、統合テスト |
| **権限チェック不足** | 他人のリソースへのアクセスが可能 | コードレビュー、統合テスト |
| **機密情報の露出** | ログ・エラーメッセージに機密情報 | `grep -r "logger.*password\|console.*password"` |

**判定**: 上記のいずれか1つでも該当 → **❌ 即却下**

### 🔴 アーキテクチャ違反（DDD/FSD）

| 項目 | 基準 | 検出方法 |
| ---- | ---- | -------- |
| **レイヤー逆転** | Domain層でInfrastructure層を直接インポート | `grep -r "import.*prisma" apps/api/src/domain/` |
| **循環依存** | モジュール間で循環依存が発生 | `bun run build`（ビルドエラー） |
| **FSD違反** | 下位レイヤーが上位レイヤーをインポート | コードレビュー、インポート確認 |
| **DIコンテナ未使用** | Repository等を直接`new`でインスタンス化 | `grep "new.*Repository"` |

**判定**: 上記のいずれか1つでも該当 → **❌ 即却下**

### 🔴 パフォーマンス（数値基準）

| 項目 | 基準 | 検出方法 |
| ---- | ---- | -------- |
| **N+1クエリ** | ループ内でDB呼び出し | コードレビュー、ログ確認 |
| **全フィールド取得** | `select`なしで全データ取得（100件以上） | コードレビュー |
| **メモリリーク** | `useEffect`でクリーンアップなし | コードレビュー、`grep "useEffect"` |
| **無限ループリスク** | 依存配列なしの`useEffect`で状態更新 | コードレビュー |

**判定**: 上記のいずれか1つでも該当 → **❌ 即却下**

### 🔴 テスト（必須要件）

| 項目 | 基準 | 検出方法 |
| ---- | ---- | -------- |
| **Medium Test未実装** | 新規APIエンドポイントにMedium Testなし | テストファイル確認 |
| **カバレッジ未達** | **Branches < 100%** | `bun run coverage` |
| **テスト失敗** | テストが1件でも失敗 | `bun run test` |
| **型エラー** | TypeScript型エラーが存在 | `bun run typecheck` |

**判定**: 上記のいずれか1つでも該当 → **❌ 即却下**

### 🔴 コーディング規約違反

| 項目 | 基準 | 検出方法 |
| ---- | ---- | -------- |
| **any型使用** | `any`型が使用されている | `bun run typecheck`、コードレビュー |
| **console.log残存** | 本番コードに`console.log`が残っている | `bun run lint` |
| **フォーマット違反** | Biomeフォーマットに従っていない | `bun run fmt:check` |
| **リントエラー** | ESLint/Biomeエラーが存在 | `bun run lint` |

**判定**: 上記のいずれか1つでも該当 → **❌ 即却下**

## 厳格な評価基準

### 総合評価の判定基準

| 評価 | 基準 | 対応 |
| ---- | ---- | ---- |
| **❌ 却下** | 即却下基準に1つでも該当 | **即座に修正**。再レビューまでマージ不可。 |
| **⚠️ 要修正** | 🟠重要な問題が3件以上 | 修正後に再レビュー。マージは修正後。 |
| **✅ 承認** | 🔴クリティカルなし、🟠重要が2件以下 | マージ可能。🟡軽微な項目は次回対応可。 |

### 問題の分類基準（厳格版）

| レベル | 該当条件 | 例 | 対応 |
| ------ | -------- | -- | ---- |
| **🔴 クリティカル** | ・セキュリティリスク、アーキテクチャ違反、N+1クエリ、テスト未達、型エラー | SQLインジェクション、レイヤー逆転、N+1、Branches < 100% | **即修正必須**。これがあるとマージ不可。 |
| **🟠 重要** | ・品質低下、保守性問題、パフォーマンス懸念、ドキュメント不足 | DRY違反、エラーハンドリング不足、シーケンス図未更新 | **修正推奨**。3件以上で要修正判定。 |
| **🟡 軽微** | ・可読性向上、スタイル改善、将来的改善提案 | 変数名改善、コメント追加、リファクタリング提案 | 任意。次回対応可。 |

### 必須チェック項目（すべて満たす必要あり）

#### ✅ セキュリティ必須チェック

- [ ] OWASP Top 10対応（特にInjection、XSS、認証）
- [ ] 認証情報のハードコードなし
- [ ] 機密情報がログに出力されていない
- [ ] 環境変数で機密情報を管理
- [ ] アクセス制御が適切（所有者チェック、権限チェック）

#### ✅ パフォーマンス必須チェック

- [ ] N+1クエリなし（`include`/`select`適切使用）
- [ ] 不要なデータ取得なし（`select`で必要フィールドのみ）
- [ ] メモリリークなし（`useEffect`クリーンアップあり）
- [ ] 無限ループリスクなし

#### ✅ アーキテクチャ必須チェック

- [ ] レイヤー依存関係が正しい（内側から外側へ）
- [ ] DIコンテナ経由で依存注入
- [ ] Repository経由でのデータアクセス（直接Prisma呼び出し禁止）
- [ ] FSD/DDD原則遵守

#### ✅ テスト必須チェック

- [ ] Medium Test実装（新規APIエンドポイント）
- [ ] **Branches: 100%**（MC/DC準拠）
- [ ] すべてのテストがパス
- [ ] Given/When/Then形式

#### ✅ 自動チェック必須

すべてパスしていること:

```bash
bun run lint        # → エラーなし
bun run typecheck   # → 型エラーなし
bun run test        # → すべてのテスト通過
bun run coverage    # → Branches 100%
bun run build       # → ビルド成功
```

## レビュー観点

### 1. 品質レビュー（Code Quality）

#### 1.1 可読性（Readability）

##### 1.1 可読性 - チェック項目

- **変数名・関数名**: 意図が明確か
- **マジックナンバー**: 定数化されているか
- **単一責任原則**: 1つの関数が1つのことだけを行っているか
- **ネスト深度**: 3階層以内か
- **コメント**: 自明なコードにコメント不要、複雑なロジックに説明あり

##### 1.1 可読性 - 良い例 vs 悪い例

**❌ 悪い例: 不明瞭な変数名**

```typescript
function calc(x: number, y: number): number {
  const tmp = x * 0.1; // 何の10%？
  return y - tmp;
}
```

**✅ 良い例: 明確な変数名**

```typescript
function calculateDiscountedPrice(
  originalPrice: number,
  discountRate: number
): number {
  const discountAmount = originalPrice * discountRate;
  return originalPrice - discountAmount;
}
```

**❌ 悪い例: マジックナンバー**

```typescript
if (user.age < 18) {
  return "未成年";
}
```

**✅ 良い例: 定数化**

```typescript
const ADULT_AGE_THRESHOLD = 18;

if (user.age < ADULT_AGE_THRESHOLD) {
  return "未成年";
}
```

**❌ 悪い例: 深いネスト**

```typescript
function processUser(user: User) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission("admin")) {
        if (user.email) {
          // 処理
        }
      }
    }
  }
}
```

**✅ 良い例: 早期リターン**

```typescript
function processUser(user: User) {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasPermission("admin")) return;
  if (!user.email) return;

  // 処理
}
```

#### 1.2 保守性（Maintainability）

##### 1.2 保守性 - チェック項目

- **DRY原則**: 重複コードがないか
- **ハードコーディング**: 環境変数・設定ファイル使用
- **エラーハンドリング**: try/catch、エラーメッセージ
- **ログ**: デバッグ情報、エラーログ
- **型定義**: anyを使用していないか

##### 1.2 保守性 - 良い例 vs 悪い例

**❌ 悪い例: コード重複**

```typescript
// ユーザー作成
const newUser = await prisma.user.create({
  data: { name, email },
});
await logger.info(`User created: ${newUser.id}`);
await sendEmail(newUser.email, "Welcome");

// 管理者作成
const newAdmin = await prisma.user.create({
  data: { name, email, role: "admin" },
});
await logger.info(`Admin created: ${newAdmin.id}`);
await sendEmail(newAdmin.email, "Welcome Admin");
```

**✅ 良い例: 共通化**

```typescript
async function createUser(
  data: UserCreateInput,
  role: UserRole = "user"
): Promise<User> {
  const user = await prisma.user.create({
    data: { ...data, role },
  });

  await logger.info(`${role} created: ${user.id}`);
  await sendWelcomeEmail(user, role);

  return user;
}

const newUser = await createUser({ name, email });
const newAdmin = await createUser({ name, email }, "admin");
```

**❌ 悪い例: ハードコーディング**

```typescript
const apiUrl = "https://api.example.com";
const apiKey = "sk_live_abcdef123456";
```

**✅ 良い例: 環境変数**

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiUrl || !apiKey) {
  throw new Error("Missing required environment variables");
}
```

**❌ 悪い例: any型の使用**

```typescript
function processData(data: any) {
  return data.items.map((item: any) => item.value);
}
```

**✅ 良い例: 明示的な型定義**

```typescript
interface DataItem {
  value: string;
}

interface DataResponse {
  items: DataItem[];
}

function processData(data: DataResponse): string[] {
  return data.items.map(item => item.value);
}
```

#### 1.3 テスタビリティ（Testability）

##### 1.3 テスタビリティ - チェック項目

- **依存性注入**: DIコンテナ経由で注入
- **モック可能性**: 外部依存が注入されているか
- **副作用の分離**: 純粋関数と副作用を持つ関数の分離
- **テスト存在**: 変更に対応するテストがあるか
- **カバレッジ**: MC/DC基準（Branches 100%）

##### 1.3 テスタビリティ - 良い例 vs 悪い例

**❌ 悪い例: テスト困難**

```typescript
class PostService {
  async createPost(data: PostData) {
    // Prismaを直接newしている
    const prisma = new PrismaClient();
    const post = await prisma.post.create({ data });

    // Date.nowを直接呼んでいる
    post.createdAt = Date.now();

    return post;
  }
}
```

**✅ 良い例: 依存性注入**

```typescript
interface PostRepository {
  create(data: PostData): Promise<Post>;
}

class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly clock: () => number = Date.now
  ) {}

  async createPost(data: PostData): Promise<Post> {
    const post = await this.postRepository.create(data);
    post.createdAt = this.clock();
    return post;
  }
}

// テスト時
const mockRepo = { create: vi.fn() };
const mockClock = () => 1234567890;
const service = new PostService(mockRepo, mockClock);
```

### 2. セキュリティレビュー（Security）

#### 2.1 OWASP Top 10 対応

##### A01:2021 – Broken Access Control（アクセス制御の不備）

**チェック項目**:

- 認証・認可が適切に実装されているか
- ユーザーが自身のリソースのみアクセスできるか
- 管理者権限チェックが適切か

**❌ 悪い例: 権限チェックなし**

```typescript
// GET /api/posts/:id
async function getPost(c: Context) {
  const postId = c.req.param("id");
  const post = await postRepository.findById(postId);
  return c.json(post); // 他人の投稿も取得できてしまう
}
```

**✅ 良い例: 所有者チェック**

```typescript
async function getPost(c: Context) {
  const postId = c.req.param("id");
  const userId = c.get("userId"); // 認証情報から取得

  const post = await postRepository.findById(postId);

  if (!post) {
    throw new AppError("NOT_FOUND", "Post not found", 404);
  }

  // 所有者または管理者のみアクセス可能
  if (post.authorId !== userId && !c.get("isAdmin")) {
    throw new AppError("FORBIDDEN", "Access denied", 403);
  }

  return c.json(post);
}
```

##### A02:2021 – Cryptographic Failures（暗号化の失敗）

**チェック項目**:

- パスワードがハッシュ化されているか（bcrypt, argon2等）
- HTTPS通信が強制されているか
- トークンが適切に暗号化されているか

**❌ 悪い例: 平文保存**

```typescript
await prisma.user.create({
  data: {
    email,
    password: password, // 平文で保存
  },
});
```

**✅ 良い例: ハッシュ化**

```typescript
import bcrypt from "bcryptjs";

const hashedPassword = await bcrypt.hash(password, 12);

await prisma.user.create({
  data: {
    email,
    password: hashedPassword,
  },
});
```

##### A03:2021 – Injection（インジェクション）

**チェック項目**:

- SQLインジェクション対策（Prisma使用、バリデーション）
- コマンドインジェクション対策
- XSS対策（入力のサニタイズ）

**❌ 悪い例: SQLインジェクション脆弱性**

```typescript
// 生SQLを使用
const query = `SELECT * FROM users WHERE email = '${userInput}'`;
await prisma.$queryRaw(query); // 危険
```

**✅ 良い例: Prismaのパラメータ化**

```typescript
// Prismaのクエリビルダー使用
const user = await prisma.user.findUnique({
  where: { email: userInput },
});

// または$queryRawUnsafeではなく$queryRaw
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userInput}`;
```

**❌ 悪い例: XSS脆弱性**

```typescript
// React
function UserComment({ comment }: { comment: string }) {
  return <div dangerouslySetInnerHTML={{ __html: comment }} />;
}
```

**✅ 良い例: エスケープ処理**

```typescript
import DOMPurify from "dompurify";

function UserComment({ comment }: { comment: string }) {
  const sanitized = DOMPurify.sanitize(comment);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// または、単純にReactのデフォルトエスケープを使用
function UserComment({ comment }: { comment: string }) {
  return <div>{comment}</div>; // 自動エスケープ
}
```

##### A04:2021 – Insecure Design（安全でない設計）

**チェック項目**:

- Rate Limiting実装
- CSRF対策
- セッション管理が適切か

**✅ 良い例: Rate Limiting**

```typescript
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";

const app = new Hono();

app.use(
  "/api/*",
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15分
    max: 100, // 最大100リクエスト
  })
);
```

##### A05:2021 – Security Misconfiguration（セキュリティ設定ミス）

**チェック項目**:

- HTTPSヘッダー設定（CSP, HSTS等）
- CORS設定が適切か
- エラーメッセージに機密情報を含まないか

**✅ 良い例: セキュリティヘッダー**

```typescript
import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();

app.use("*", secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
  },
  strictTransportSecurity: "max-age=31536000; includeSubDomains",
}));
```

#### 2.2 機密情報管理

**チェック項目**:

- `.env`ファイルがGit管理されていないか
- APIキー、トークンがハードコードされていないか
- ログに機密情報が出力されていないか

**❌ 悪い例: ログに機密情報**

```typescript
logger.info(`User login: ${email}, password: ${password}`); // パスワードをログ出力
```

**✅ 良い例: 機密情報を除外**

```typescript
logger.info(`User login: ${email}`); // パスワードは出力しない
```

### 3. パフォーマンスレビュー（Performance）

#### 3.1 データベース

##### N+1クエリ問題

**❌ 悪い例: N+1クエリ**

```typescript
const posts = await prisma.post.findMany();

// 各投稿の著者を取得（N回のクエリ）
for (const post of posts) {
  const author = await prisma.user.findUnique({
    where: { id: post.authorId },
  });
  post.author = author;
}
```

**✅ 良い例: include使用**

```typescript
const posts = await prisma.post.findMany({
  include: {
    author: true, // 1回のJOINで取得
  },
});
```

##### 不要なデータ取得

**❌ 悪い例: 全フィールド取得**

```typescript
const users = await prisma.user.findMany(); // 全フィールド取得
return users.map(u => ({ id: u.id, name: u.name })); // idとnameだけ使用
```

**✅ 良い例: select使用**

```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true, // 必要なフィールドのみ
  },
});
```

##### インデックス

**✅ 良い例: インデックス設定**

```prisma
model Post {
  id        String   @id @default(cuid())
  authorId  String
  createdAt DateTime @default(now())

  author User @relation(fields: [authorId], references: [id])

  @@index([authorId]) // 外部キーにインデックス
  @@index([createdAt]) // ソート対象にインデックス
}
```

#### 3.2 フロントエンド

##### 不要な再レンダリング

**❌ 悪い例: 毎回再生成**

```typescript
function PostList({ posts }: { posts: Post[] }) {
  const sortedPosts = posts.sort((a, b) =>
    b.createdAt - a.createdAt
  ); // 毎回ソート

  return (
    <div>
      {sortedPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

**✅ 良い例: useMemo使用**

```typescript
import { useMemo } from "react";

function PostList({ posts }: { posts: Post[] }) {
  const sortedPosts = useMemo(
    () => posts.sort((a, b) => b.createdAt - a.createdAt),
    [posts]
  );

  return (
    <div>
      {sortedPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

##### メモリリーク

**❌ 悪い例: クリーンアップなし**

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 1000);
  // クリーンアップなし
}, []);
```

**✅ 良い例: クリーンアップあり**

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 1000);

  return () => clearInterval(interval); // クリーンアップ
}, []);
```

#### 3.3 API

##### レスポンスサイズ最小化

**❌ 悪い例: 過剰なデータ**

```typescript
return c.json({
  posts: allPosts, // 全投稿データ
  users: allUsers, // 全ユーザーデータ
  metadata: { /* ... */ },
});
```

**✅ 良い例: 必要最小限**

```typescript
return c.json({
  posts: posts.map(p => ({
    id: p.id,
    title: p.title,
    excerpt: p.content.slice(0, 100), // 抜粋のみ
  })),
});
```

##### キャッシュ活用

**✅ 良い例: KV キャッシュ**

```typescript
const cacheKey = `posts:recent`;
const cached = await kv.get(cacheKey);

if (cached) {
  return c.json(JSON.parse(cached));
}

const posts = await postRepository.findRecent();
await kv.put(cacheKey, JSON.stringify(posts), { expirationTtl: 300 }); // 5分キャッシュ

return c.json(posts);
```

### 4. アーキテクチャレビュー（Architecture）

#### 4.1 DDD準拠（API）

##### レイヤー分離

**依存関係**: `Domain → UseCase → Infrastructure → Interface`

**❌ 悪い例: レイヤー逆転**

```typescript
// Domain層でPrismaを直接使用
export class Post {
  async save() {
    const prisma = new PrismaClient(); // Domain層でInfrastructureに依存
    await prisma.post.create({ data: this });
  }
}
```

**✅ 良い例: Repository経由**

```typescript
// Domain層
export class Post {
  // ドメインロジックのみ
  validate(): void {
    if (this.title.length === 0) {
      throw new Error("Title is required");
    }
  }
}

// Infrastructure層
export class PrismaPostRepository implements PostRepository {
  async save(post: Post): Promise<void> {
    await this.prisma.post.create({ data: post });
  }
}

// UseCase層
export class CreatePostUseCase {
  constructor(private readonly postRepository: PostRepository) {}

  async execute(data: CreatePostInput): Promise<Post> {
    const post = new Post(data);
    post.validate();
    await this.postRepository.save(post);
    return post;
  }
}
```

##### DIコンテナ使用

**❌ 悪い例: 直接new**

```typescript
export function createPostHandler(c: Context) {
  const repository = new PrismaPostRepository(); // 直接new
  const useCase = new CreatePostUseCase(repository);
  return useCase.execute(c.req.json());
}
```

**✅ 良い例: DIコンテナ**

```typescript
// di/container.ts
export const container = {
  postRepository: new PrismaPostRepository(prisma),
  createPostUseCase: new CreatePostUseCase(container.postRepository),
};

// interface/rest/posts.ts
export function createPostHandler(c: Context) {
  const useCase = container.createPostUseCase; // DIコンテナから取得
  return useCase.execute(c.req.json());
}
```

#### 4.2 FSD準拠（Frontend）

##### レイヤー依存関係

**依存方向**: `routes → widgets → features → entities → shared`

**❌ 悪い例: 下位レイヤーが上位レイヤーをインポート**

```typescript
// app/entities/user/model.ts
import { UserProfile } from "~/features/user-profile"; // entities が features に依存
```

**✅ 良い例: 正しい依存方向**

```typescript
// app/features/user-profile/ui/UserProfile.tsx
import { User } from "~/entities/user"; // features が entities に依存（OK）
```

##### 機能の独立性

**❌ 悪い例: feature間の依存**

```typescript
// app/features/post-editor/model.ts
import { commentStore } from "~/features/comments"; // feature間依存
```

**✅ 良い例: entities経由**

```typescript
// app/features/post-editor/model.ts
import { Post } from "~/entities/post"; // entities経由
```

#### 4.3 SOLID原則

##### 単一責任原則（SRP）

**❌ 悪い例: 複数の責任**

```typescript
class UserService {
  async createUser(data: UserData) { /* ... */ }
  async sendWelcomeEmail(email: string) { /* ... */ }
  async generatePDF(user: User) { /* ... */ }
  async uploadToS3(file: File) { /* ... */ }
}
```

**✅ 良い例: 責任分離**

```typescript
class UserService {
  async createUser(data: UserData) { /* ... */ }
}

class EmailService {
  async sendWelcomeEmail(email: string) { /* ... */ }
}

class PDFService {
  async generatePDF(user: User) { /* ... */ }
}

class StorageService {
  async upload(file: File) { /* ... */ }
}
```

##### 依存性逆転原則（DIP）

**❌ 悪い例: 具象に依存**

```typescript
class PostService {
  constructor(private readonly prismaRepo: PrismaPostRepository) {}
}
```

**✅ 良い例: 抽象に依存**

```typescript
interface PostRepository {
  findById(id: string): Promise<Post>;
  save(post: Post): Promise<void>;
}

class PostService {
  constructor(private readonly postRepository: PostRepository) {}
}
```

### 5. テストレビュー（Testing）

#### 5.1 テストハニカム戦略

**優先順位**: Medium Tests > Small Tests > Large Tests

**チェック項目**:

- Medium Tests（統合テスト）が優先的に書かれているか
- Small Testsは複雑なロジックのみか
- Large Testsはクリティカルパスのみか

##### Medium Test（統合テスト）

**✅ 良い例: シーケンス図と1:1対応**

```typescript
/**
 * @sequence docs/sequence/api/posts/getPosts.md
 */
describe("GET /api/posts - 投稿一覧取得", () => {
  describe("Given: 投稿が存在する", () => {
    beforeEach(async () => {
      await seedPosts();
    });

    describe("When: 一覧取得APIを呼び出す", () => {
      it("Then: 全投稿が返される", async () => {
        const response = await request(app).get("/api/posts");

        expect(response.status).toBe(200);
        expect(response.body.posts).toHaveLength(3);
      });
    });
  });
});
```

##### Small Test（ユニットテスト）

**✅ 良い例: 複雑なロジックのみ**

```typescript
describe("calculateDiscountPrice", () => {
  it("通常割引を正しく計算する", () => {
    expect(calculateDiscountPrice(1000, 0.1)).toBe(900);
  });

  it("割引率0の場合は元の価格を返す", () => {
    expect(calculateDiscountPrice(1000, 0)).toBe(1000);
  });

  it("割引率1の場合は0を返す", () => {
    expect(calculateDiscountPrice(1000, 1)).toBe(0);
  });
});
```

**❌ 悪い例: 単純な委譲のテスト（不要）**

```typescript
// このテストは不要（Medium Testで十分）
describe("PostService.create", () => {
  it("repositoryのcreateを呼ぶ", async () => {
    const mockRepo = { create: vi.fn() };
    const service = new PostService(mockRepo);
    await service.create({});
    expect(mockRepo.create).toHaveBeenCalled(); // 単なる委譲
  });
});
```

#### 5.2 テスト品質

##### Given/When/Then形式

**✅ 良い例**

```typescript
describe("Feature: ユーザー登録", () => {
  describe("Given: 有効なメールアドレス", () => {
    describe("When: 登録APIを呼び出す", () => {
      it("Then: ユーザーが作成される", async () => {
        // Arrange
        const email = "test@example.com";

        // Act
        const user = await createUser({ email });

        // Assert
        expect(user.email).toBe(email);
      });
    });
  });
});
```

##### カバレッジ基準

**MC/DC（Modified Condition/Decision Coverage）**:

- Lines: 90%
- Functions: 90%
- Statements: 90%
- **Branches: 100%** ← 最重要

**チェック方法**:

```bash
bun run coverage
```

### 6. ドキュメントレビュー（Documentation）

#### 6.1 シーケンス図

**チェック項目**:

- APIフロー変更時にシーケンス図が更新されているか
- シーケンス図と実装が一致しているか

**更新必要なタイミング**:

- 新規エンドポイント追加
- エンドポイントの処理フロー変更
- エラーハンドリング追加

#### 6.2 API仕様書

**チェック項目**:

- エンドポイント変更時に仕様書が更新されているか
- リクエスト/レスポンス形式が正確か
- エラーコードが定義されているか

#### 6.3 コメント

**チェック項目**:

- 複雑なロジックに説明があるか
- 自明なコードにコメント不要
- JSDocが記載されているか（公開API）

**❌ 悪い例: 不要なコメント**

```typescript
// ユーザーを取得する
const user = await getUser(id);

// ユーザーが存在するかチェック
if (!user) {
  // エラーを投げる
  throw new Error("Not found");
}
```

**✅ 良い例: 必要なコメントのみ**

```typescript
const user = await getUser(id);

if (!user) {
  throw new Error("Not found");
}

// 権限チェック: 管理者または本人のみ許可
// IMPORTANT: セキュリティ要件により、他ユーザーのデータは取得不可
if (!isAdminOrOwner(currentUser, user)) {
  throw new Error("Forbidden");
}
```

## レビュー結果の記録

### ファイル名

```text
logs/review/YYYY-MM-DD-{description}.md
```

### テンプレート

`.claude/templates/workflow/code-review-log.md` を参照

### 総合評価基準

| 評価 | 基準 |
| ---- | ---- |
| ✅ 承認 | クリティカルなし、重要な問題なし |
| ⚠️ 要修正 | 重要な問題あり（修正後の再レビュー推奨） |
| ❌ 却下 | クリティカルな問題あり（即修正必須） |

### 問題の分類

| レベル | 説明 | 例 |
| ------ | ---- | -- |
| 🔴 クリティカル | セキュリティ、データ損失、障害リスク | SQLインジェクション、認証バイパス |
| 🟠 重要 | 品質、保守性、パフォーマンス | N+1クエリ、エラーハンドリング不足 |
| 🟡 軽微 | スタイル、可読性、将来的改善 | 変数名改善、コメント追加 |

## 自動チェック

レビュー実行前に以下のコマンドを自動実行:

```bash
# コード品質
bun run lint
bun run typecheck

# テスト
bun run test

# カバレッジ
bun run coverage
```

## 関連ドキュメント

| ドキュメント | 説明 |
| ------------ | ---- |
| [コーディング規約](./coding-standards.md) | フォーマット、命名規則、TypeScript規約 |
| [セキュリティガイドライン](../security/guidelines.md) | OWASP対応、機密情報管理 |
| [テスト戦略](../testing/testing-strategy.md) | テストハニカム、カバレッジ基準 |
| [API設計原則](./api-design-principles.md) | REST API設計ガイドライン |
| [DDD実践ガイド](../architecture/ddd-guide.md) | ドメイン駆動設計の実装パターン |
| [FSD実践ガイド](../architecture/fsd-guide.md) | Feature-Sliced Design実装パターン |

## スキル使用方法

```bash
# コードレビュー実行
/review                    # 現在の変更をレビュー
/review src/api/posts.ts   # 特定ファイルをレビュー
/review 123                # PR番号を指定してレビュー
```

レビュー結果は自動的に `logs/review/` に保存されます。
