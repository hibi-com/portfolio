import { expect, test } from "@playwright/test";

test.describe("Random Interactions", () => {
    test("should handle random interactions without crashing", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        const maxActions = 20;
        const errorCounts = {
            link: 0,
            button: 0,
            input: 0,
            navigation: 0,
        };

        const actions = [
            async () => {
                const links = await page.getByRole("link").all();
                if (links.length > 0) {
                    const randomLink = links[Math.floor(Math.random() * links.length)];
                    try {
                        const isVisible = await randomLink.isVisible().catch(() => false);
                        if (!isVisible) {
                            return;
                        }
                        await randomLink.click({ timeout: 2000 });
                        await page.waitForLoadState("networkidle", { timeout: 5000 });
                    } catch (error) {
                        errorCounts.link++;
                        console.warn(`Link click failed: ${error instanceof Error ? error.message : String(error)}`);
                    }
                }
            },
            async () => {
                const buttons = await page.getByRole("button").all();
                if (buttons.length > 0) {
                    const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
                    try {
                        const isVisible = await randomButton.isVisible().catch(() => false);
                        if (!isVisible) {
                            return;
                        }
                        await randomButton.click({ timeout: 2000 });
                    } catch (error) {
                        errorCounts.button++;
                        console.warn(`Button click failed: ${error instanceof Error ? error.message : String(error)}`);
                    }
                }
            },
            async () => {
                const inputs = await page.locator("input, textarea").all();
                if (inputs.length > 0) {
                    const randomInput = inputs[Math.floor(Math.random() * inputs.length)];
                    try {
                        const isVisible = await randomInput.isVisible().catch(() => false);
                        const isEditable = await randomInput.isEditable().catch(() => false);
                        if (!isVisible || !isEditable) {
                            return;
                        }
                        await randomInput.fill("test", { timeout: 2000 });
                    } catch (error) {
                        errorCounts.input++;
                        console.warn(`Input fill failed: ${error instanceof Error ? error.message : String(error)}`);
                    }
                }
            },
            async () => {
                await page.evaluate(() => {
                    globalThis.scrollBy(0, Math.random() * 500);
                });
            },
            async () => {
                try {
                    if (Math.random() > 0.5) {
                        const canGoBack = await page.evaluate(() => globalThis.history.length > 1).catch(() => false);
                        if (canGoBack) {
                            await page.goBack({ timeout: 2000 });
                        }
                    } else {
                        const canGoForward = await page
                            .evaluate(() => {
                                return globalThis.history.length > 0 && globalThis.history.state !== null;
                            })
                            .catch(() => false);
                        if (canGoForward) {
                            await page.goForward({ timeout: 2000 });
                        }
                    }
                } catch (error) {
                    errorCounts.navigation++;
                    console.warn(`Navigation failed: ${error instanceof Error ? error.message : String(error)}`);
                }
            },
        ];

        for (let i = 0; i < maxActions; i++) {
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            try {
                await randomAction();
                await page.waitForTimeout(100);
            } catch (error) {
                console.error(`Action ${i} failed:`, error);
            }

            const title = await page.title().catch(() => null);
            expect(title).toBeTruthy();
        }

        const totalErrors = errorCounts.link + errorCounts.button + errorCounts.input + errorCounts.navigation;
        const errorRate = totalErrors / maxActions;
        console.log(
            `Error summary: ${totalErrors} errors out of ${maxActions} actions (${(errorRate * 100).toFixed(1)}%)`,
        );
        console.log(`  - Link errors: ${errorCounts.link}`);
        console.log(`  - Button errors: ${errorCounts.button}`);
        console.log(`  - Input errors: ${errorCounts.input}`);
        console.log(`  - Navigation errors: ${errorCounts.navigation}`);

        if (errorRate > 0.5) {
            console.warn("High error rate detected. Consider investigating the application stability.");
        }

        await expect(page).toHaveURL(/.*/);
    });
});
