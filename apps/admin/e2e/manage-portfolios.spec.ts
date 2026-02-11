import { expect, test } from "@playwright/test";

/**
 * @story docs/user-stories/admin/manage-portfolios.md
 */
test.describe("管理者: ポートフォリオを管理する", () => {
    test.describe("AC1: ポートフォリオ一覧の表示", () => {
        test("ポートフォリオ一覧ページに遷移できる", async ({ page }) => {
            await page.goto("/");

            await page.getByText("Portfolios").click();

            await expect(page).toHaveURL("/portfolios");
            await expect(page.getByRole("heading", { name: "Portfolios" })).toBeVisible();
        });

        test("ポートフォリオ一覧が表示される", async ({ page }) => {
            await page.goto("/portfolios");

            await expect(page.getByText("Portfolios list will be displayed here")).toBeVisible();
        });
    });

    test.describe("AC2: ナビゲーション", () => {
        test("アクティブなナビゲーションアイテムがハイライトされる", async ({ page }) => {
            await page.goto("/portfolios");

            const portfoliosLink = page.getByRole("link", { name: "Portfolios" });
            await expect(portfoliosLink).toBeVisible();
            await expect(portfoliosLink).toHaveClass(/bg-primary/);
        });

        test("レイアウトが維持される", async ({ page }) => {
            await page.goto("/portfolios");

            await expect(page.getByText("CMS")).toBeVisible();
            await expect(page.getByText("Dashboard")).toBeVisible();
            await expect(page.getByText("Posts")).toBeVisible();
        });
    });

    test.describe("レスポンシブ", () => {
        test("モバイル表示に対応している", async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });

            await page.goto("/portfolios");

            await expect(page.getByRole("heading", { name: "Portfolios" })).toBeVisible();
            await expect(page.locator("button[aria-label='Open sidebar']")).toBeVisible();
        });
    });
});
