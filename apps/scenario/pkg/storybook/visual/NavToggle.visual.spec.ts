import { expect, test } from "@playwright/test";

test.describe("NavToggle Visual Regression", () => {
    test("should match closed state snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=widgets-navbar-navtoggle--closed");
        await expect(page).toHaveScreenshot("navtoggle-closed.png");
    });

    test("should match open state snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=widgets-navbar-navtoggle--open");
        await expect(page).toHaveScreenshot("navtoggle-open.png");
    });

    test("should match interactive state snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=widgets-navbar-navtoggle--interactive");
        await expect(page).toHaveScreenshot("navtoggle-interactive.png");
    });
});
