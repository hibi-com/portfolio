import { expect, test } from "@playwright/test";

test.describe("Button Interactions", () => {
    test("should increment count when clicked", async ({ page }) => {
        await page.goto("/iframe.html?id=shared-ui-button--interactive");

        const button = page.getByRole("button", { name: /Click me:/ });
        const initialText = await button.textContent();
        const initialCount = Number.parseInt(initialText?.match(/\d+/)?.[0] || "0", 10);

        await button.click();

        await expect(button).toContainText(`Click me: ${initialCount + 1}`);

        await button.click();

        await expect(button).toContainText(`Click me: ${initialCount + 2}`);
    });

    test("should be disabled when disabled prop is set", async ({ page }) => {
        await page.goto("/iframe.html?id=shared-ui-button--disabled");

        const button = page.getByRole("button", { name: "Disabled" });

        await expect(button).toBeDisabled();
    });

    test("should have correct variant styles", async ({ page }) => {
        await page.goto("/iframe.html?id=shared-ui-button--destructive");

        const button = page.getByRole("button", { name: "Destructive" });

        await expect(button).toBeVisible();
        await expect(button).toHaveClass(/bg-destructive/);
    });
});
