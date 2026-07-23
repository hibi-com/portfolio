import { expect, test } from "@playwright/test";

test.describe("NavToggle Interactions", () => {
    test("should toggle menu state when clicked", async ({ page }) => {
        await page.goto("/iframe.html?id=widgets-navbar-navtoggle--interactive");

        const button = page.getByRole("button", { name: "Menu" });
        const statusText = page.getByText(/Menu is:/);

        await expect(statusText).toHaveText("Menu is: Closed");
        await expect(button).toHaveAttribute("aria-expanded", "false");

        await button.click();

        await expect(statusText).toHaveText("Menu is: Open");
        await expect(button).toHaveAttribute("aria-expanded", "true");

        await button.click();

        await expect(statusText).toHaveText("Menu is: Closed");
        await expect(button).toHaveAttribute("aria-expanded", "false");
    });

    test("should show menu icon when closed", async ({ page }) => {
        await page.goto("/iframe.html?id=widgets-navbar-navtoggle--closed");

        const button = page.getByRole("button", { name: "Menu" });
        const menuIcon = button.locator('[data-menu="true"]');

        await expect(button).toHaveAttribute("aria-expanded", "false");
        await expect(menuIcon).toBeVisible();
    });

    test("should show close icon when open", async ({ page }) => {
        await page.goto("/iframe.html?id=widgets-navbar-navtoggle--open");

        const button = page.getByRole("button", { name: "Menu" });
        const closeIcon = button.locator('[data-close="true"]');

        await expect(button).toHaveAttribute("aria-expanded", "true");
        await expect(closeIcon).toBeVisible();
    });
});
