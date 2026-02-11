import { expect, test } from "@playwright/test";

/**
 * @story docs/user-stories/admin/manage-posts.md
 */
test.describe("管理者: ブログ記事を管理する", () => {
    test.describe("AC1: 記事一覧の表示", () => {
        test("記事一覧ページに遷移できる", async ({ page }) => {
            await page.goto("/");

            await page.getByText("Posts").click();

            await expect(page).toHaveURL("/posts");
            await expect(page.getByRole("heading", { name: "Posts" })).toBeVisible();
        });

        test("記事一覧が表示される", async ({ page }) => {
            await page.goto("/posts");

            await expect(page.getByText("Posts list will be displayed here")).toBeVisible();
        });
    });

    test.describe("AC2: ナビゲーション", () => {
        test("アクティブなナビゲーションアイテムがハイライトされる", async ({ page }) => {
            await page.goto("/posts");

            const postsLink = page.getByRole("link", { name: "Posts" });
            await expect(postsLink).toBeVisible();
            await expect(postsLink).toHaveClass(/bg-primary/);
        });

        test("レイアウトが維持される", async ({ page }) => {
            await page.goto("/posts");

            await expect(page.getByText("CMS")).toBeVisible();
            await expect(page.getByText("Dashboard")).toBeVisible();
            await expect(page.getByText("Portfolios")).toBeVisible();
        });
    });

    test.describe("レスポンシブ", () => {
        test("モバイル表示に対応している", async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });

            await page.goto("/posts");

            await expect(page.getByRole("heading", { name: "Posts" })).toBeVisible();
            await expect(page.locator("button[aria-label='Open sidebar']")).toBeVisible();
        });
    });
});
