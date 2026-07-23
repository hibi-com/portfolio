import { expect, test } from "@playwright/test";
import { getTestConfigs } from "./helpers";

const testConfigs = getTestConfigs();

test.describe("Form Accessibility", () => {
    for (const config of testConfigs) {
        test.describe(`${config.name}`, () => {
            test("should have proper form labels", async ({ page }) => {
                await page.goto(config.url);
                await page.waitForLoadState("networkidle");

                const inputs = page.locator("input[type='text'], input[type='email'], textarea");
                const inputCount = await inputs.count();

                for (let i = 0; i < inputCount; i++) {
                    const input = inputs.nth(i);
                    const id = await input.getAttribute("id");
                    const ariaLabel = await input.getAttribute("aria-label");
                    const ariaLabelledBy = await input.getAttribute("aria-labelledby");
                    const placeholder = await input.getAttribute("placeholder");

                    expect(id || ariaLabel || ariaLabelledBy || placeholder).toBeTruthy();
                }
            });
        });
    }
});
