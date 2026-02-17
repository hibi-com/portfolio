import { expect, test } from "@playwright/test";

test.describe("Admin App", () => {
    test("should navigate to root page", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveURL("/");
    });

    test("should display CMS title", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByText("CMS")).toBeVisible();
    });

    test("should display main navigation", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByText("Dashboard")).toBeVisible();
        await expect(page.getByText("Posts")).toBeVisible();
        await expect(page.getByText("Portfolios")).toBeVisible();
    });

    test("should have responsive layout", async ({ page }) => {
        await page.goto("/");

        await page.setViewportSize({ width: 1280, height: 800 });
        await expect(page.getByText("CMS")).toBeVisible();

        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator("button[aria-label='Open sidebar']")).toBeVisible();
    });
});
