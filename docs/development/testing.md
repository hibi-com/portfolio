---
title: "テストガイドライン"
---

このプロジェクトでは、コード品質を保証するために包括的なテスト戦略を採用しています。

## テスト戦略

### テストハニカム戦略

本プロジェクトでは、[Spotify Testing Honeycomb](https://engineering.atspotify.com/2018/01/testing-of-microservices) に基づくテスト戦略を採用しています。

> **"最も複雑なのはサービス内部ではなく、他とのインタラクション"**
>
> — Spotify Engineering

従来のテストピラミッドとは異なり、**Integration Tests（Medium Tests）を最も重視**します。

```text
        ┌───────────┐
        │  Large    │  ← 最小限
        │ (E2E)     │
        ├───────────┤
    ┌───┴───────────┴───┐
    │     Medium        │  ← 最重視 ⭐⭐⭐
    │  (Integration)    │
    ├───────────────────┤
        │   Small   │  ← 限定的
        │  (Unit)   │
        └───────────┘
```

#### テスト優先順位

| 優先度 | テストタイプ | 説明 |
| ------ | ----------- | ---- |
| ⭐⭐⭐ | **Medium Tests** | サービス間インタラクションの検証。シーケンス図と1:1対応 |
| ⭐ | Small Tests | 複雑なビジネスロジックに限定。単純なCRUD/委譲は不要 |
| ⚠️ | Large Tests | クリティカルパスのみ。外部依存は壊れやすいため最小限に |

#### なぜMedium Testsを重視するのか

1. **複雑性の所在**: マイクロサービスの複雑性はサービス内部ではなく、相互作用にある
2. **Small Testsの問題**: 実装詳細に依存し、コード変更時にテストも変更が必要になりがち
3. **Large Testsの問題**: 外部サービスに依存し、脆弱で壊れやすい

#### Small Testを書くべきケース

| ✅ 書くべき | ❌ 書かない |
| ---------- | ----------- |
| 複雑なビジネスロジック（計算、変換、解析） | 単純なCRUD操作 |
| 多くの分岐を持つ関数 | 他への委譲だけの薄いラッパー |
| 自然に隔離されたユーティリティ関数 | フレームワーク機能を呼ぶだけのコード |
| エッジケースが多い処理 | 実装の詳細に依存するテスト |

### Google テストサイズ

テストサイズの分類は [Google Testing Blog](https://testing.googleblog.com/2010/12/test-sizes.html) の概念を採用しています。

| サイズ | 特徴 | 実行時間目標 | 実行タイミング |
| ------ | ---- | ---------- | ------------- |
| **Small** | 単一プロセス、完全モック、ネットワークなし | < 100ms | コミット毎 |
| **Medium** | 複数プロセス可、外部サービスモック、DB接続可 | < 1秒 | PR毎 |
| **Large** | 実システム全体、ブラウザ含む | < 10秒 | マージ前、定期実行 |

### テストサイズの定義

#### Small Tests（単体テスト）

- **目的**: 個別の関数、クラス、コンポーネントの動作検証
- **特徴**:
  - 単一プロセスで実行
  - 外部依存関係は完全にモック化
  - ネットワークアクセスなし
  - ファイルシステムアクセスなし
- **対象**: UseCase、Repository（モック）、ユーティリティ関数、Reactコンポーネント
- **フレームワーク**: Vitest

#### Medium Tests（統合テスト）

- **目的**: 複数コンポーネント間の連携と仕様書（シーケンス図）の検証
- **特徴**:
  - 複数プロセス可
  - 外部サービス（API等）はモック化
  - テスト用データベース接続可
  - **シーケンス図と1:1で対応**
- **対象**: REST API統合、UseCase→Repository→DB連携、ミドルウェア統合
- **フレームワーク**: Vitest + テストDB

#### Large Tests（E2Eテスト）

- **目的**: ユーザーストーリーに基づくシステム全体の動作検証
- **特徴**:
  - 実システム全体を使用
  - ブラウザシミュレーション含む
  - **ユーザーストーリーと1:1で対応**
- **対象**: ユーザーシナリオ、クリティカルパス、リグレッション
- **フレームワーク**: Playwright

### テストファイル命名規則

| サイズ | 命名規則 | 配置場所 | 例 |
| ----- | ------- | ------- | --- |
| Small | `*.test.ts` | ソースファイルと同階層 | `getPosts.test.ts` |
| Medium | `*.medium.test.ts` | `tests/medium/` | `posts-list.medium.test.ts` |
| Large | `*.large.spec.ts` | `e2e/large/` | `browse-blog.large.spec.ts` |

### テストと仕様書の対応

#### Medium Tests とシーケンス図

Medium Tests は `docs/sequence/api/` 内のシーケンス図と1:1で対応します。

```text
docs/sequence/api/post/posts-list.md
  ↓ 対応
apps/api/tests/medium/post/posts-list.medium.test.ts
```

テストファイルの冒頭には、対応するシーケンス図へのリンクを記載します：

```typescript
/**
 * @sequence docs/sequence/api/post/posts-list.md
 * @description GET /api/posts - 投稿一覧取得の統合テスト
 */
```

#### Large Tests とユーザーストーリー

Large Tests は `docs/user-stories/` 内のユーザーストーリーと1:1で対応します。

```text
docs/user-stories/visitor/browse-blog.md
  ↓ 対応
apps/web/e2e/large/visitor/browse-blog.large.spec.ts
```

## 単体テスト

### テストファイルの配置

テストファイルは、テスト対象のファイルと同じディレクトリに配置します。

```text
app/
├── shared/
│   └── lib/
│       ├── formatDate.ts
│       └── formatDate.test.ts
└── features/
    └── blog-preview/
        ├── ui/
        │   ├── BlogPreview.tsx
        │   └── BlogPreview.test.tsx
        └── model/
            ├── types.ts
            └── types.test.ts
```

### Small Testsの書き方

#### 関数のテスト

```typescript
// app/shared/lib/formatDate.test.ts
import { describe, expect, it } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
    it("should format date correctly", () => {
        const date = new Date("2024-01-01");
        const result = formatDate(date);
        expect(result).toBe("2024-01-01");
    });

    it("should handle invalid date", () => {
        const date = new Date("invalid");
        expect(() => formatDate(date)).toThrow();
    });
});
```

#### Reactコンポーネントのテスト

```typescript
// app/features/blog-preview/ui/BlogPreview.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlogPreview } from "./BlogPreview";

describe("BlogPreview", () => {
    it("should render blog preview", () => {
        const props = {
            title: "Test Post",
            slug: "test-post",
            date: "2024-01-01",
        };

        render(<BlogPreview {...props} />);

        expect(screen.getByText("Test Post")).toBeInTheDocument();
    });

    it("should render link with correct href", () => {
        const props = {
            title: "Test Post",
            slug: "test-post",
            date: "2024-01-01",
        };

        render(<BlogPreview {...props} />);

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/blog/test-post");
    });
});
```

#### Remixローダーのテスト

```typescript
// app/routes/blog.$slug.test.ts
import { describe, expect, it, vi } from "vitest";
import { loader } from "./blog.$slug";

describe("loader", () => {
    it("should return blog post data", async () => {
        const request = new Request("http://localhost/blog/test-post");
        const params = { slug: "test-post" };

        const response = await loader({ request, params, context: {} });
        const data = await response.json();

        expect(data.post).toBeDefined();
        expect(data.post.slug).toBe("test-post");
    });

    it("should return 404 for non-existent post", async () => {
        const request = new Request("http://localhost/blog/non-existent");
        const params = { slug: "non-existent" };

        await expect(
            loader({ request, params, context: {} })
        ).rejects.toThrow();
    });
});
```

### テストユーティリティ

共通のテストユーティリティは `testing/vitest/` に配置されています。

```typescript
// testing/vitest/setup.ts で設定される共通のセットアップ
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
    cleanup();
});
```

### カバレッジ設定

カバレッジレポートは次の設定で生成されます：

- **レポート形式**: HTML, LCOV
- **閾値**: 90%（lines, functions, statements）、100%（branches）
- **除外**: `.cache/`, `node_modules/`, `**/*.test.{ts,tsx}`, `**/*.config.{ts,js}`
- **出力先**: `apps/e2e/public/reports/coverage/{project}/`（Test Portalで表示）

```bash
# カバレッジレポートを生成
bun run coverage

# 特定のパッケージのカバレッジ
turbo run coverage --filter=@portfolio/api
turbo run coverage --filter=@portfolio/web
turbo run coverage --filter=@portfolio/admin
```

## 統合テスト

### ディレクトリ構造

```text
apps/api/tests/
├── medium/
│   ├── setup/
│   │   ├── db.setup.ts           # テストDB初期化
│   │   └── container.setup.ts    # DIコンテナ初期化
│   ├── post/
│   │   ├── posts-list.medium.test.ts
│   │   └── post-by-slug.medium.test.ts
│   ├── portfolio/
│   │   ├── portfolios-list.medium.test.ts
│   │   └── portfolio-by-slug.medium.test.ts
│   ├── crm/
│   │   ├── customer-crud.medium.test.ts
│   │   ├── lead-conversion.medium.test.ts
│   │   └── deal-pipeline.medium.test.ts
│   └── ...
└── vitest.medium.config.ts       # Medium Test専用設定
```

### Medium Testsの書き方

Medium Tests はシーケンス図の各ステップを検証します。

```typescript
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { setupTestDb, teardownTestDb, seedTestData } from "../setup/db.setup";
import { createTestContainer } from "../setup/container.setup";
import type { DIContainer } from "@/di/container";

describe("Posts List Integration", () => {
    let container: DIContainer;

    beforeAll(async () => {
        await setupTestDb();
        container = createTestContainer();
    });

    afterAll(async () => {
        await teardownTestDb();
    });

    describe("シーケンス: Client → API → UseCase → Repository → DB", () => {
        test("正常系: 投稿一覧を取得する", async () => {
            // Given: DBに投稿が存在する
            await seedTestData({
                posts: [
                    { id: "1", title: "Test Post 1", slug: "test-1" },
                    { id: "2", title: "Test Post 2", slug: "test-2" },
                ],
            });

            // When: GET /api/posts を実行
            const useCase = container.getGetPostsUseCase();
            const result = await useCase.execute();

            // Then: 投稿一覧がレスポンスされる
            expect(result).toHaveLength(2);
            expect(result[0].title).toBe("Test Post 1");
        });

        test("異常系: 投稿が0件の場合は空配列を返す", async () => {
            // Given: DBに投稿が存在しない
            // (setupTestDbで初期化済み)

            // When: GET /api/posts を実行
            const useCase = container.getGetPostsUseCase();
            const result = await useCase.execute();

            // Then: 空配列がレスポンスされる
            expect(result).toHaveLength(0);
        });
    });
});
```

### Medium Tests実行コマンド

```bash
# API Medium Testsのみ実行
bun vitest run -c apps/api/tests/vitest.medium.config.ts

# 特定ドメインのMedium Tests
bun vitest run -c apps/api/tests/vitest.medium.config.ts --filter=post
```

## Integration Tests（Web/Admin）

フロントエンドアプリケーション（web/admin）のIntegration Testsは、Remixローダー/TanStack Routerとコンポーネントの統合を検証します。

### Integrationディレクトリ構造

```text
apps/web/
├── integration/                    # Web Integration Tests
│   ├── blog-list.integration.test.ts
│   ├── blog-detail.integration.test.ts
│   ├── portfolio-list.integration.test.ts
│   └── portfolio-detail.integration.test.ts
└── vitest.integration.config.ts

apps/admin/
├── integration/                    # Admin Integration Tests
│   ├── posts-list.integration.test.tsx
│   ├── portfolios-list.integration.test.tsx
│   └── customers-list.integration.test.tsx
└── vitest.integration.config.ts
```

### シーケンス図との対応

| シーケンス図 | Integration Test |
| ----------- | ---------------- |
| `docs/sequence/web/blog-list.md` | `apps/web/integration/blog-list.integration.test.ts` |
| `docs/sequence/web/blog-detail.md` | `apps/web/integration/blog-detail.integration.test.ts` |
| `docs/sequence/admin/posts/posts-list.md` | `apps/admin/integration/posts-list.integration.test.tsx` |

### Integration Testsの書き方

Integration Tests はMSWを使用してAPIをモックし、フロントエンドの統合フローを検証します。

```typescript
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { describe, expect, test } from "vitest";

const server = setupServer();

describe("Blog List Integration", () => {
    test("正常系: 投稿一覧を取得する", async () => {
        server.use(
            http.get(`${API_URL}/api/posts`, () => {
                return HttpResponse.json([{ id: "1", title: "Test" }]);
            }),
        );

        const response = await fetch(`${API_URL}/api/posts`);
        const data = await response.json();

        expect(data).toHaveLength(1);
    });
});
```

### Integration Tests実行コマンド

```bash
# Web Integration Tests
bun vitest run -c apps/web/vitest.integration.config.ts

# Admin Integration Tests
bun vitest run -c apps/admin/vitest.integration.config.ts
```

## E2Eテスト

### Largeディレクトリ構造

```text
apps/web/e2e/
├── large/                        # ユーザーストーリーベース
│   ├── visitor/
│   │   ├── browse-blog.large.spec.ts
│   │   └── browse-portfolio.large.spec.ts
│   ├── admin/
│   │   ├── manage-posts.large.spec.ts
│   │   └── manage-inquiries.large.spec.ts
│   └── crm-user/
│       └── manage-customers.large.spec.ts
├── api/                          # APIレスポンス検証（従来のE2E）
│   ├── posts.spec.ts
│   └── portfolios.spec.ts
├── accessibility/                # アクセシビリティテスト
├── visual/                       # ビジュアルリグレッションテスト
└── interactions/                 # インタラクションテスト
```

### ページオブジェクトモデル（POM）

E2Eテストでは、ページオブジェクトモデルパターンを採用しています。

#### ページオブジェクトの構造

```typescript
// e2e/pages/home.page.ts
import { Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async gotoHome(): Promise<void> {
        await this.page.goto("/");
    }

    async expectHeroVisible(): Promise<void> {
        await expect(this.page.locator("[data-testid='hero']")).toBeVisible();
    }

    async clickBlogLink(): Promise<void> {
        await this.page.getByRole("link", { name: "Blog" }).click();
    }
}
```

### ユーザーストーリーベースのテスト

Large Tests はユーザーストーリーのシナリオを検証します。

```typescript
import { expect, test } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { BlogPage } from "../pages/blog.page";

test.describe("訪問者がブログを閲覧する", () => {
    test("シナリオ1: ブログ一覧からブログ詳細へ遷移する", async ({ page }) => {
        // Given: トップページにアクセスしている
        const homePage = new HomePage(page);
        await homePage.gotoHome();

        // When: ブログ一覧リンクをクリック
        await homePage.clickBlogLink();

        // Then: ブログ一覧ページが表示される
        await expect(page).toHaveURL(/\/blog/);
        const blogPage = new BlogPage(page);
        await blogPage.expectBlogListVisible();

        // When: 最初のブログ記事をクリック
        await blogPage.clickFirstPost();

        // Then: ブログ詳細ページが表示される
        await blogPage.expectPostDetailVisible();
    });

    test("シナリオ2: 存在しないブログにアクセスすると404が表示される", async ({ page }) => {
        // Given: 存在しないスラッグでアクセス
        await page.goto("/blog/non-existent-post");

        // Then: 404ページが表示される
        await expect(page.locator("text=404")).toBeVisible();
    });
});
```

### APIテスト

APIエンドポイントのレスポンスを検証するテストも含まれています。

```typescript
// e2e/api/blog.spec.ts
import { expect, test } from "@playwright/test";

test("should return blog posts", async ({ request }) => {
    const response = await request.get("/api/blog");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
});

test("should return 404 for non-existent post", async ({ request }) => {
    const response = await request.get("/api/blog/non-existent");
    expect(response.status()).toBe(404);
});
```

## テスト実行

### ローカル環境

```bash
# Small Tests（すべてのユニットテスト）
bun run test

# 特定のパッケージのSmall Tests
turbo run test --filter=@portfolio/web

# ウォッチモード
bun vitest

# カバレッジレポート生成
bun run coverage

# Medium Tests（統合テスト）
bun vitest run -c apps/api/tests/vitest.medium.config.ts

# Large Tests（E2Eテスト）
bun run e2e

# アクセシビリティテスト
bun run accessibility

# ビジュアルリグレッションテスト
bun run visual

# インタラクションテスト
bun run interactions
```

### CI環境

CI環境では、Dockerコンテナ内でテストが実行されます。

```bash
# CI環境でのE2Eテスト実行例
docker run --rm -e CI=true \
  -v $(pwd):/work -w /work \
  -v $(pwd)/node_modules:/work/node_modules \
  e2e bunx playwright test
```

## テストのベストプラクティス

### 1. テストの独立性

各テストは独立して実行可能であるべきです。

```typescript
// ✅ Good: 各テストが独立している
describe("formatDate", () => {
    it("should format date correctly", () => {
        // テスト1
    });

    it("should handle invalid date", () => {
        // テスト2（テスト1に依存しない）
    });
});
```

### 2. 明確なテスト名

テスト名は、何をテストしているかが明確であるべきです。

```typescript
// ✅ Good: 明確なテスト名
it("should return 404 when blog post does not exist", () => {
    // ...
});

// ❌ Bad: 曖昧なテスト名
it("should work", () => {
    // ...
});
```

### 3. AAAパターン

テストは Arrange（準備）、Act（実行）、Assert（検証）の3つのセクションに分けます。

```typescript
it("should format date correctly", () => {
    // Arrange: テストデータの準備
    const date = new Date("2024-01-01");

    // Act: テスト対象の実行
    const result = formatDate(date);

    // Assert: 結果の検証
    expect(result).toBe("2024-01-01");
});
```

### 4. モックの適切な使用

外部依存関係は適切にモックします。

```typescript
import { vi } from "vitest";

it("should fetch data from API", async () => {
    // API呼び出しをモック
    const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: "test" }),
    });

    global.fetch = mockFetch;

    const result = await fetchData();
    expect(result.data).toBe("test");
    expect(mockFetch).toHaveBeenCalledWith("/api/data");
});
```

### 5. エッジケースのテスト

正常系だけでなく、エッジケースもテストします。

```typescript
describe("formatDate", () => {
    it("should handle normal date", () => {
        // 正常系
    });

    it("should handle invalid date", () => {
        // エッジケース1
    });

    it("should handle null", () => {
        // エッジケース2
    });

    it("should handle empty string", () => {
        // エッジケース3
    });
});
```

## テストカバレッジ

### カバレッジ目標

本プロジェクトでは、MC/DC（Modified Condition/Decision Coverage）に準拠したカバレッジ基準を採用しています。

| メトリクス | 閾値 | 説明 |
| --------- | ---- | ---- |
| **Lines** | 90% | 実行された行の割合 |
| **Functions** | 90% | 呼び出された関数の割合 |
| **Branches** | 100% | 通過した分岐の割合（MC/DC準拠） |
| **Statements** | 90% | 実行されたステートメントの割合 |

### MC/DC（Modified Condition/Decision Coverage）

MC/DCは航空・医療・自動車など安全性が重要なシステムで採用されるカバレッジ基準です。

#### MC/DCの3つの要件

1. **エントリ/エグジット網羅**: すべてのエントリポイントとエグジットポイントが呼び出される
2. **条件網羅**: 判定内のすべての条件がtrue/falseの両方を取る
3. **独立影響**: 各条件が独立して判定の結果に影響を与える

#### MC/DCテストパターン

複合条件 `if (A && B || C)` に対するMC/DCテストケース:

```typescript
describe("複合条件のMC/DCテスト", () => {
    // 条件Aの独立影響テスト
    it("Aがtrueからfalseに変化すると結果が変わる（B=true, C=false）", () => {
        expect(evaluate(true, true, false)).toBe(true);   // A=true
        expect(evaluate(false, true, false)).toBe(false); // A=false
    });

    // 条件Bの独立影響テスト
    it("Bがtrueからfalseに変化すると結果が変わる（A=true, C=false）", () => {
        expect(evaluate(true, true, false)).toBe(true);   // B=true
        expect(evaluate(true, false, false)).toBe(false); // B=false
    });

    // 条件Cの独立影響テスト
    it("Cがtrueからfalseに変化すると結果が変わる（A=false, B=false）", () => {
        expect(evaluate(false, false, true)).toBe(true);  // C=true
        expect(evaluate(false, false, false)).toBe(false); // C=false
    });
});
```

#### MC/DC真理値表

| A | B | C | A && B | A && B \|\| C | Aの影響 | Bの影響 | Cの影響 |
| - | - | - | ------ | ------------- | ------- | ------- | ------- |
| T | T | F | T | T | ✓ | ✓ | |
| F | T | F | F | F | ✓ | | |
| T | F | F | F | F | | ✓ | |
| F | F | T | F | T | | | ✓ |
| F | F | F | F | F | | | ✓ |

### 実践的なMC/DCガイドライン

#### 1. 複合条件の分解

```typescript
// ❌ Bad: 複雑な複合条件
if (user.isAdmin && (user.hasPermission || config.allowAll) && !user.isBanned) {
    // ...
}

// ✅ Good: 条件を分解して各条件を独立してテスト可能に
const isAdminUser = user.isAdmin;
const hasAccess = user.hasPermission || config.allowAll;
const isNotBanned = !user.isBanned;

if (isAdminUser && hasAccess && isNotBanned) {
    // ...
}
```

#### 2. 早期リターンの活用

```typescript
// ✅ Good: 各条件を個別にテスト可能
function canAccess(user: User, config: Config): boolean {
    if (!user.isAdmin) return false;
    if (user.isBanned) return false;
    if (!user.hasPermission && !config.allowAll) return false;
    return true;
}
```

#### 3. ガード句のテスト

```typescript
describe("canAccess MC/DC", () => {
    const baseUser = { isAdmin: true, isBanned: false, hasPermission: true };
    const baseConfig = { allowAll: false };

    it("isAdmin=falseで拒否", () => {
        expect(canAccess({ ...baseUser, isAdmin: false }, baseConfig)).toBe(false);
    });

    it("isBanned=trueで拒否", () => {
        expect(canAccess({ ...baseUser, isBanned: true }, baseConfig)).toBe(false);
    });

    it("hasPermission=false, allowAll=falseで拒否", () => {
        expect(canAccess({ ...baseUser, hasPermission: false }, baseConfig)).toBe(false);
    });

    it("hasPermission=false, allowAll=trueで許可", () => {
        expect(canAccess({ ...baseUser, hasPermission: false }, { allowAll: true })).toBe(true);
    });

    it("すべての条件を満たす場合は許可", () => {
        expect(canAccess(baseUser, baseConfig)).toBe(true);
    });
});
```

### カバレッジレポートの確認

カバレッジレポートは `apps/e2e/public/reports/coverage/` に出力されます。
Test Portalでブラウザから確認できます。

```bash
# Test Portalを起動してカバレッジレポートを表示
cd apps/e2e && bun run dev
# http://localhost:24000/coverage でアクセス

# HTMLレポートを直接開く（ローカル）
open apps/e2e/public/reports/coverage/api/{日時}/index.html
open apps/e2e/public/reports/coverage/web/{日時}/index.html
open apps/e2e/public/reports/coverage/admin/{日時}/index.html

# 特定ファイルのブランチカバレッジ詳細
bun vitest run --coverage --reporter=verbose
```

### カバレッジ除外

特定のコードをカバレッジから除外する場合は、コメントを使用します：

```typescript
/* istanbul ignore next */
function debugOnly() {
    // デバッグ専用コード
}

/* istanbul ignore if */
if (process.env.NODE_ENV === "development") {
    // 開発環境専用コード
}
```

## 独立したE2Eテスト（apps/e2e）

本番環境に対して実行する独立したE2Eテストは `apps/e2e` パッケージで管理します。

### アクセシビリティテスト

WCAG準拠とキーボードナビゲーションを検証します。

| ファイル | 検証内容 |
| -------- | -------- |
| `navigation.spec.ts` | ナビゲーションのアクセシビリティ |
| `keyboard.spec.ts` | キーボードナビゲーション、フォーカス管理 |
| `images.spec.ts` | 画像のalt属性 |
| `forms.spec.ts` | フォームラベル |
| `semantic.spec.ts` | 見出し階層、ARIAランドマーク、スキップリンク |
| `labels.spec.ts` | ボタン/リンクのラベル |
| `contrast.spec.ts` | 色のコントラスト |

```bash
# アクセシビリティテスト実行
cd apps/e2e && bun run accessibility:web:prd
```

### モンキーテスト

ランダム操作による安定性テストです。

| ファイル | 検証内容 |
| -------- | -------- |
| `interactions.spec.ts` | ランダムなクリック、入力、スクロール |
| `navigation.spec.ts` | 高速なページ遷移 |
| `mouse.spec.ts` | ランダムなマウス操作 |

```bash
# モンキーテスト実行
cd apps/e2e && bun run monkey:web:prd
```

### Page Object Model（POM）

E2Eテストでは、ページオブジェクトモデルを採用しています。

```typescript
// 使用例
import { HomePage, BlogPage } from "./pages";

test("ブログへの遷移", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.gotoHome();
    await homePage.clickBlogLink();

    const blogPage = new BlogPage(page);
    await blogPage.expectHeroVisible();
});
```

| ページオブジェクト | 対象ページ |
| ----------------- | ---------- |
| `HomePage` | トップページ |
| `BlogPage` | ブログページ |
| `PortfolioPage` | ポートフォリオページ |
| `ResumePage` | 履歴書ページ |
| `UsesPage` | Usesページ |

## 参考資料

- [Google Testing Blog - Test Sizes](https://testing.googleblog.com/2010/12/test-sizes.html)
- [Spotify Testing Honeycomb](https://engineering.atspotify.com/2018/01/testing-of-microservices)
- [Vitest公式ドキュメント](https://vitest.dev/)
- [Playwright公式ドキュメント](https://playwright.dev/)
- [Testing Library公式ドキュメント](https://testing-library.com/)
- [Page Object Modelパターン](https://playwright.dev/docs/pom)
