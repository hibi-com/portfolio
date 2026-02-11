import { expect, test } from "@playwright/test";

test.describe("管理画面: ナビゲーション", () => {
    test.describe("ページ遷移", () => {
        test("Postsページに遷移できる", async ({ page }) => {
            await page.goto("/");

            await page.getByText("Posts").click();

            await expect(page).toHaveURL("/posts");
        });

        test("Portfoliosページに遷移できる", async ({ page }) => {
            await page.goto("/");

            await page.getByText("Portfolios").click();

            await expect(page).toHaveURL("/portfolios");
        });

        test("Dashboardに戻れる", async ({ page }) => {
            await page.goto("/posts");

            await page.getByText("Dashboard").click();

            await expect(page).toHaveURL("/");
        });
    });

    test.describe("アクティブ状態", () => {
        test("アクティブなナビゲーションアイテムがハイライトされる", async ({ page }) => {
            await page.goto("/posts");

            const postsLink = page.getByRole("link", { name: "Posts" });
            await expect(postsLink).toHaveClass(/bg-primary/);
        });
    });

    test.describe("モバイル対応", () => {
        test("モバイルメニューが機能する", async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto("/");

            await page.locator("button[aria-label='Open sidebar']").click();
            await page.getByText("Posts").click();

            await expect(page).toHaveURL("/posts");
        });
    });
});
