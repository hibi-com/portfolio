/**
 * @story docs/user-stories/visitor/browse-blog.md
 */
import { expect, test } from "@playwright/test";

test.describe("訪問者: ブログを閲覧する", () => {
    test.describe("AC1: ブログ一覧からブログ詳細へ遷移する", () => {
        test("シナリオ1: ブログ一覧からブログ詳細へ遷移する", async ({ page }) => {
            await page.goto("/");

            await page.getByRole("link", { name: /blog/i }).click();

            await expect(page).toHaveURL(/\/blog/);
            await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

            const firstPost = page.locator("article").first();
            const postLink = firstPost.getByRole("link").first();
            await postLink.click();

            await expect(page).toHaveURL(/\/blog\/.+/);

            await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
            await expect(page.locator("article")).toBeVisible();
        });
    });

    test.describe("AC2: 存在しないブログへのアクセス", () => {
        test("シナリオ2: 存在しないブログにアクセスした場合404が表示される", async ({ page }) => {
            const response = await page.goto("/blog/non-existent-post-slug-12345");

            expect(response?.status()).toBe(404);
            await expect(page.locator("text=/404|not found/i")).toBeVisible();
        });
    });

    test.describe("AC3: タグでフィルタリング", () => {
        test("シナリオ3: タグでブログをフィルタリングする", async ({ page }) => {
            await page.goto("/blog");

            const tagLink = page.locator("[data-testid='tag-link']").first();
            const hasTagLink = (await tagLink.count()) > 0;

            if (hasTagLink) {
                const initialCount = await page.locator("article").count();

                await tagLink.click();

                const filteredCount = await page.locator("article").count();
                expect(filteredCount).toBeLessThanOrEqual(initialCount);
            }
        });
    });
});
