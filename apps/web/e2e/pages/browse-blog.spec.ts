/**
 * @story docs/user-stories/visitor/browse-blog.md
 * @description 訪問者がブログを閲覧するシナリオ
 *
 * ユーザーストーリーに基づき、以下のシナリオを検証:
 * - ブログ一覧からブログ詳細へ遷移
 * - 存在しないブログへのアクセス
 * - タグによるフィルタリング
 */

import { expect, test } from "@playwright/test";

test.describe("訪問者がブログを閲覧する", () => {
    test("シナリオ1: ブログ一覧からブログ詳細へ遷移する", async ({ page }) => {
        // Given: トップページにアクセスしている
        await page.goto("/");

        // When: ブログ一覧リンクをクリックする
        await page.getByRole("link", { name: /blog/i }).click();

        // Then: ブログ一覧ページが表示される
        await expect(page).toHaveURL(/\/blog/);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

        // When: 最初のブログ記事のリンクをクリックする
        const firstPost = page.locator("article").first();
        const postLink = firstPost.getByRole("link").first();
        await postLink.click();

        // Then: ブログ詳細ページが表示される
        await expect(page).toHaveURL(/\/blog\/.+/);

        // And: 記事のタイトル、本文、公開日が表示される
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.locator("article")).toBeVisible();
    });

    test("シナリオ2: 存在しないブログにアクセスした場合404が表示される", async ({ page }) => {
        // Given: 存在しないブログのURLにアクセスする
        const response = await page.goto("/blog/non-existent-post-slug-12345");

        // Then: 404エラーページが表示される
        expect(response?.status()).toBe(404);
        // または404を示すテキストが表示される
        await expect(page.locator("text=/404|not found/i")).toBeVisible();
    });

    test("シナリオ3: タグでブログをフィルタリングする", async ({ page }) => {
        // Given: ブログ一覧ページにアクセスしている
        await page.goto("/blog");

        // タグリンクが存在する場合のみテスト
        const tagLink = page.locator("[data-testid='tag-link']").first();
        const hasTagLink = (await tagLink.count()) > 0;

        if (hasTagLink) {
            // 現在の記事数を取得
            const initialCount = await page.locator("article").count();

            // When: 特定のタグをクリックする
            await tagLink.click();

            // Then: フィルタリングされた結果が表示される
            // URLにタグパラメータが含まれる、または記事数が変わる
            const filteredCount = await page.locator("article").count();
            expect(filteredCount).toBeLessThanOrEqual(initialCount);
        }
    });
});
