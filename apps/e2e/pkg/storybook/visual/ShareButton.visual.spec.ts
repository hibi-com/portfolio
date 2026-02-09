import { expect, test } from "@playwright/test";

test.describe("ShareButton Visual Regression", () => {
    test("should match default share button snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=features-share-button-sharebutton--default");
        await expect(page).toHaveScreenshot("sharebutton-default.png");
    });

    test("should match share button with label snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=features-share-button-sharebutton--with-label");
        await expect(page).toHaveScreenshot("sharebutton-with-label.png");
    });

    test("should match disabled share button snapshot", async ({ page }) => {
        await page.goto("/iframe.html?id=features-share-button-sharebutton--disabled");
        await expect(page).toHaveScreenshot("sharebutton-disabled.png");
    });
});
