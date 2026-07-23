import { expect, test } from "@playwright/test";
import { getTestConfigs } from "./helpers";

const testConfigs = getTestConfigs();

test.describe("Image Accessibility", () => {
    for (const config of testConfigs) {
        test.describe(`${config.name}`, () => {
            test("should have proper alt text for images", async ({ page }) => {
                await page.goto(config.url);
                await page.waitForLoadState("networkidle");

                const images = page.locator("img");
                const imageCount = await images.count();

                for (let i = 0; i < imageCount; i++) {
                    const img = images.nth(i);
                    const alt = await img.getAttribute("alt");
                    const role = await img.getAttribute("role");

                    if (!role || role !== "presentation") {
                        expect(alt).not.toBeNull();
                    }
                }
            });
        });
    }
});
