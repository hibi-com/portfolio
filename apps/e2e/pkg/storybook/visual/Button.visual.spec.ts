import { expect, test } from "@playwright/test";

test.describe("Button Visual Regression", () => {
    test("should match default button snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=shared-ui-button--default");
        await expect(page).toHaveScreenshot("button-default.png");
    });

    test("should match destructive button snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=shared-ui-button--destructive");
        await expect(page).toHaveScreenshot("button-destructive.png");
    });

    test("should match outline button snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=shared-ui-button--outline");
        await expect(page).toHaveScreenshot("button-outline.png");
    });

    test("should match secondary button snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=shared-ui-button--secondary");
        await expect(page).toHaveScreenshot("button-secondary.png");
    });

    test("should match ghost button snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=shared-ui-button--ghost");
        await expect(page).toHaveScreenshot("button-ghost.png");
    });

    test("should match link button snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=shared-ui-button--link");
        await expect(page).toHaveScreenshot("button-link.png");
    });

    test("should match small button snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=shared-ui-button--small");
        await expect(page).toHaveScreenshot("button-small.png");
    });

    test("should match large button snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=shared-ui-button--large");
        await expect(page).toHaveScreenshot("button-large.png");
    });

    test("should match disabled button snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=shared-ui-button--disabled");
        await expect(page).toHaveScreenshot("button-disabled.png");
    });
});
