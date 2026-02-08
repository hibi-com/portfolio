import { expect, test } from "@playwright/test";
import { getTestConfigs } from "./helpers";

const testConfigs = getTestConfigs();

test.describe("Navigation Accessibility", () => {
    for (const config of testConfigs) {
        test.describe(`${config.name}`, () => {
            test("should have accessible navigation", async ({ page }) => {
                await page.goto(config.url);
                await page.waitForLoadState("networkidle");

                const navigation = page.getByRole("navigation");
                await expect(navigation).toBeVisible();

                const navLinks = navigation.getByRole("link");
                const linkCount = await navLinks.count();
                expect(linkCount).toBeGreaterThan(0);

                for (let i = 0; i < linkCount; i++) {
                    const link = navLinks.nth(i);
                    const text = await link.textContent();
                    const ariaLabel = await link.getAttribute("aria-label");
                    expect(text || ariaLabel).toBeTruthy();
                }
            });
        });
    }
});
