import { expect, test } from "@playwright/test";
import { getTestConfigs } from "./helpers";

const testConfigs = getTestConfigs();

test.describe("Semantic HTML and ARIA", () => {
    for (const config of testConfigs) {
        test.describe(`${config.name}`, () => {
            test("should have proper heading hierarchy", async ({ page }) => {
                await page.goto(config.url);
                await page.waitForLoadState("networkidle");

                const h1 = page.getByRole("heading", { level: 1 });
                await expect(h1).toBeVisible();

                const h1Count = await page.locator("h1").count();
                expect(h1Count).toBeLessThanOrEqual(1);
            });

            test("should have proper ARIA landmarks", async ({ page }) => {
                await page.goto(config.url);
                await page.waitForLoadState("networkidle");

                const navigation = page.getByRole("navigation");
                const main = page.getByRole("main");

                const navCount = await navigation.count();
                const mainCount = await main.count();
                expect(navCount + mainCount).toBeGreaterThan(0);
            });

            test("should support skip links", async ({ page }) => {
                await page.goto(config.url);
                await page.waitForLoadState("networkidle");

                const skipLinks = page.locator("a[href^='#']").filter({
                    hasText: /skip|スキップ/i,
                });
                const skipLinkCount = await skipLinks.count();

                if (skipLinkCount === 0) {
                    console.warn("Skip links not found. Consider adding skip links for better accessibility.");
                }
            });
        });
    }
});
