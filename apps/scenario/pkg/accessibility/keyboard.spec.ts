import { expect, test } from "@playwright/test";
import { getTestConfigs } from "./helpers";

const testConfigs = getTestConfigs();

test.describe("Keyboard Navigation", () => {
    for (const config of testConfigs) {
        test.describe(`${config.name}`, () => {
            test("should be keyboard navigable", async ({ page }) => {
                await page.goto(config.url);
                await page.waitForLoadState("networkidle");

                await page.keyboard.press("Tab");

                const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
                expect(focusedElement).toBeTruthy();
            });

            test("should handle focus management", async ({ page }) => {
                await page.goto(config.url);
                await page.waitForLoadState("networkidle");

                const focusableElements = page.locator(
                    "a, button, input, textarea, select, [tabindex]:not([tabindex='-1'])",
                );
                const focusableCount = await focusableElements.count();
                expect(focusableCount).toBeGreaterThan(0);

                await page.keyboard.press("Tab");
                const focused = await page.evaluate(() => document.activeElement);
                expect(focused).toBeTruthy();
            });
        });
    }
});
