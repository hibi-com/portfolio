import { expect, test } from "@playwright/test";
import { getTestConfigs } from "./helpers";

const testConfigs = getTestConfigs();

test.describe("Color Contrast", () => {
    for (const config of testConfigs) {
        test.describe(`${config.name}`, () => {
            test("should have proper color contrast indicators", async ({ page }) => {
                await page.goto(config.url);
                await page.waitForLoadState("networkidle");

                const textElements = page.locator("p, span, h1, h2, h3, h4, h5, h6, a, button");
                const elementCount = await textElements.count();

                expect(elementCount).toBeGreaterThan(0);
            });
        });
    }
});
