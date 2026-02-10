# E2Eテスト（Large Test）テンプレート

## IMPORTANT: このテンプレートに従って一貫した形式でE2Eテストを作成すること

## ファイル配置規則

```text
apps/web/e2e/large/{persona}/{story}.large.spec.ts
apps/admin/e2e/large/{feature}.large.spec.ts
```

## 命名規則

| 要素 | 規則 | 例 |
| ---- | ---- | -- |
| ファイル名 | `{story}.large.spec.ts` | `browse-blog.large.spec.ts` |
| describe | ユーザーストーリータイトル | `describe("ブログを閲覧する")` |

## ユーザーストーリーとの対応

```typescript
/**
 * @story docs/user-stories/{persona}/{story}.md
 */
```

## テンプレート本体

```typescript
import { test, expect, type Page } from "@playwright/test";

test.describe("{ペルソナ}: {ストーリータイトル}", () => {
    // ページオブジェクト（共通操作をまとめる）
    let page: Page;

    test.beforeEach(async ({ page: testPage }) => {
        page = testPage;
        // 共通セットアップ
        await page.goto("/");
    });

    test.describe("AC1: {受け入れ条件1のタイトル}", () => {
        test("{シナリオ: 期待される動作}", async () => {
            // Given: 前提状態
            // ユーザーがトップページにいる
            await expect(page).toHaveURL("/");

            // When: ユーザーのアクション
            await page.getByRole("link", { name: "{リンクテキスト}" }).click();

            // Then: 期待される結果
            await expect(page).toHaveURL("/{expected-path}");
            await expect(page.getByRole("heading", { level: 1 })).toHaveText("{期待されるタイトル}");
        });
    });

    test.describe("AC2: {受け入れ条件2のタイトル}", () => {
        test("{シナリオ: フォーム送信}", async () => {
            // Given: フォームページにアクセス
            await page.goto("/{form-path}");

            // When: フォームに入力して送信
            await page.getByLabel("{ラベル1}").fill("{入力値1}");
            await page.getByLabel("{ラベル2}").fill("{入力値2}");
            await page.getByRole("button", { name: "{送信ボタン}" }).click();

            // Then: 成功メッセージが表示される
            await expect(page.getByRole("alert")).toHaveText("{成功メッセージ}");
        });

        test("{シナリオ: バリデーションエラー}", async () => {
            // Given: フォームページにアクセス
            await page.goto("/{form-path}");

            // When: 不正な入力で送信
            await page.getByLabel("{ラベル1}").fill(""); // 空
            await page.getByRole("button", { name: "{送信ボタン}" }).click();

            // Then: エラーメッセージが表示される
            await expect(page.getByText("{エラーメッセージ}")).toBeVisible();
        });
    });

    test.describe("AC3: {受け入れ条件3: 一覧表示}", () => {
        test("{シナリオ: アイテム一覧の表示}", async () => {
            // Given: 一覧ページにアクセス
            await page.goto("/{list-path}");

            // Then: アイテムが表示される
            const items = page.getByTestId("item");
            await expect(items).toHaveCount(expect.any(Number));
            await expect(items.first()).toBeVisible();
        });

        test("{シナリオ: ページネーション}", async () => {
            // Given: 一覧ページにアクセス
            await page.goto("/{list-path}");

            // When: 次のページに移動
            await page.getByRole("button", { name: "次へ" }).click();

            // Then: URLが更新される
            await expect(page).toHaveURL("/{list-path}?page=2");
        });

        test("{シナリオ: フィルタリング}", async () => {
            // Given: 一覧ページにアクセス
            await page.goto("/{list-path}");

            // When: フィルターを適用
            await page.getByRole("combobox", { name: "{フィルター名}" }).selectOption("{オプション}");

            // Then: フィルターされた結果が表示される
            await expect(page.getByTestId("item")).toHaveCount(expect.any(Number));
        });
    });

    test.describe("レスポンシブ対応", () => {
        test("{モバイル表示}", async () => {
            // Given: モバイルビューポート
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto("/");

            // Then: モバイルメニューが表示される
            await expect(page.getByTestId("mobile-menu")).toBeVisible();
            await expect(page.getByTestId("desktop-menu")).not.toBeVisible();
        });
    });

    test.describe("アクセシビリティ", () => {
        test("{キーボードナビゲーション}", async () => {
            // Given: ページにアクセス
            await page.goto("/");

            // When: Tabキーでナビゲーション
            await page.keyboard.press("Tab");

            // Then: フォーカスが移動する
            await expect(page.getByRole("link").first()).toBeFocused();
        });
    });
});
```

## ページオブジェクトパターン

```typescript
// e2e/pages/blog-page.ts
import type { Page, Locator } from "@playwright/test";

export class BlogPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly posts: Locator;
    readonly searchInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole("heading", { level: 1 });
        this.posts = page.getByTestId("post-item");
        this.searchInput = page.getByRole("searchbox");
    }

    async goto() {
        await this.page.goto("/blog");
    }

    async search(query: string) {
        await this.searchInput.fill(query);
        await this.searchInput.press("Enter");
    }

    async clickPost(index: number) {
        await this.posts.nth(index).click();
    }
}

// テストでの使用
test("ブログを検索する", async ({ page }) => {
    const blogPage = new BlogPage(page);
    await blogPage.goto();
    await blogPage.search("TypeScript");
    await expect(blogPage.posts).toHaveCount(expect.any(Number));
});
```

## テストデータ管理

```typescript
// e2e/fixtures/test-data.ts
export const testUser = {
    email: "e2e-test@example.com",
    password: "test-password-123",
};

export const testPost = {
    title: "E2Eテスト用記事",
    content: "テスト内容",
};
```

## 実行コマンド

```bash
# 全E2Eテスト実行
bun run e2e

# 特定アプリのみ
bun --cwd apps/web playwright test

# UIモード（デバッグ）
bun --cwd apps/web playwright test --ui

# ヘッドフルモード
bun --cwd apps/web playwright test --headed

# 特定テストファイル
bun --cwd apps/web playwright test e2e/large/visitor/browse-blog.large.spec.ts
```

## 前提条件

```bash
# 開発サーバーが起動していること
bun run dev

# または webServer 設定を playwright.config.ts に追加
export default defineConfig({
    webServer: {
        command: "bun run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
    },
});
```

## 出力フォーマット（テスト作成後）

```markdown
## 作成したE2Eテスト

- **ファイル**: {path}
- **対応ストーリー**: [{story}]({story-path})
- **テストケース数**: {count}

### 受け入れ条件との対応

| AC | 条件 | テストケース |
| -- | ---- | ------------ |
| AC1 | {条件} | {テスト名} |
| AC2 | {条件} | {テスト名} |
| AC3 | {条件} | {テスト名} |

### テストカバレッジ

| シナリオ | カバー |
| -------- | ------ |
| 正常系 | ✅ |
| エラー系 | ✅ |
| 境界値 | ✅ |
| レスポンシブ | ✅ |
| アクセシビリティ | ✅ |

### 確認事項

- [ ] ローカルでテストが通過
- [ ] 全ACがカバーされている
- [ ] ページオブジェクトパターンを使用
```
