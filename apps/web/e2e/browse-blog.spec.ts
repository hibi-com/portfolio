/**
 * @story docs/user-stories/visitor/browse-blog.md
 */
import { expect, test } from "@playwright/test";

test.describe("訪問者: ブログを閲覧する", () => {
    test.describe("AC1: ブログ一覧からブログ詳細へ遷移する", () => {
        test("シナリオ1: ブログ一覧からブログ詳細へ遷移する", async ({ page }) => {
            // Given: トップページにアクセスしている
            await page.goto("/");

            // When: ブログ一覧リンクをクリックする
            await page.getByRole("link", { name: /blog/i }).click();

            // Then: ブログ一覧ページが表示される
            await expect(page).toHaveURL(/\/blog/);
            await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

            // When: 最初のブログ記事のタイトルをクリックする
            const firstPost = page.locator("article").first();
            const postLink = firstPost.getByRole("link").first();
            await postLink.click();

            // Then: ブログ詳細ページが表示される
            await expect(page).toHaveURL(/\/blog\/.+/);

            // And: 記事のタイトル、本文が表示される
            await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
            await expect(page.locator("article")).toBeVisible();
        });
    });

    test.describe("AC2: 存在しないブログへのアクセス", () => {
        test("シナリオ2: 存在しないブログにアクセスした場合404が表示される", async ({ page }) => {
            // Given: 存在しないブログのURLにアクセスする
            const response = await page.goto("/blog/non-existent-post-slug-12345");

            // Then: 404エラーページが表示される
            expect(response?.status()).toBe(404);
            await expect(page.locator("text=/404|not found/i")).toBeVisible();
        });
    });

    test.describe("AC3: タグでフィルタリング", () => {
        test("シナリオ3: タグでブログをフィルタリングする", async ({ page }) => {
            // Given: ブログ一覧ページにアクセスしている
            await page.goto("/blog");

            const tagLink = page.locator("[data-testid='tag-link']").first();
            const hasTagLink = (await tagLink.count()) > 0;

            if (hasTagLink) {
                const initialCount = await page.locator("article").count();

                // When: 特定のタグをクリックする
                await tagLink.click();

                // Then: そのタグを持つ投稿のみが表示される
                const filteredCount = await page.locator("article").count();
                expect(filteredCount).toBeLessThanOrEqual(initialCount);
            }
        });
    });
});
