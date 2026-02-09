import { expect, test } from "@playwright/test";
import { getTestConfigs } from "./helpers";

const testConfigs = getTestConfigs();

test.describe("Button and Link Labels", () => {
    for (const config of testConfigs) {
        test.describe(`${config.name}`, () => {
            test("should have proper button labels", async ({ page }) => {
                await page.goto(config.url);
                await page.waitForLoadState("networkidle");

                const buttons = page.getByRole("button");
                const buttonCount = await buttons.count();

                for (let i = 0; i < buttonCount; i++) {
                    const button = buttons.nth(i);
                    const text = await button.textContent();
                    const ariaLabel = await button.getAttribute("aria-label");
                    const ariaLabelledBy = await button.getAttribute("aria-labelledby");

                    expect(text || ariaLabel || ariaLabelledBy).toBeTruthy();
                }
            });

            test("should have proper link text", async ({ page }) => {
                await page.goto(config.url);
                await page.waitForLoadState("networkidle");

                const links = page.getByRole("link");
                const linkCount = await links.count();

                for (let i = 0; i < linkCount; i++) {
                    const link = links.nth(i);
                    const text = await link.textContent();
                    const ariaLabel = await link.getAttribute("aria-label");
                    const title = await link.getAttribute("title");

                    if (!ariaLabel && !title) {
                        expect(text?.trim().length).toBeGreaterThan(0);
                    }
                }
            });
        });
    }
});
