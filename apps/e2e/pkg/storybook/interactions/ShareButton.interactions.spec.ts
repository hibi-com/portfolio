import { expect, test } from "@playwright/test";

test.describe("ShareButton Interactions", () => {
    test("should trigger alert when clicked", async ({ page }) => {
        await page.goto("/iframe.html?id=features-share-button-sharebutton--default");

        page.on("dialog", async (dialog) => {
            expect(dialog.message()).toBe("Share clicked!");
            await dialog.accept();
        });

        const button = page.getByRole("button");
        await button.click();
    });

    test("should display label when WithLabel variant is used", async ({ page }) => {
        await page.goto("/iframe.html?id=features-share-button-sharebutton--with-label");

        const button = page.getByRole("button");
        const label = button.getByText("Share");

        await expect(label).toBeVisible();
        await expect(button).toBeVisible();
    });

    test("should be disabled when Disabled variant is used", async ({ page }) => {
        await page.goto("/iframe.html?id=features-share-button-sharebutton--disabled");

        const button = page.getByRole("button", { disabled: true });

        await expect(button).toBeDisabled();
    });
});
