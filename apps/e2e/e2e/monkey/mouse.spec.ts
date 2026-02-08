import { expect, test } from "@playwright/test";

test.describe("Random Mouse Interactions", () => {
    test("should handle random mouse movements and clicks", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");

        const viewportSize = page.viewportSize();
        const maxX = viewportSize?.width || 800;
        const maxY = viewportSize?.height || 600;
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < 10; i++) {
            const x = Math.floor(Math.random() * maxX);
            const y = Math.floor(Math.random() * maxY);

            try {
                const elementAtPoint = await page.evaluate(
                    ({ x, y }) => {
                        return document.elementFromPoint(x, y);
                    },
                    { x, y },
                );

                if (elementAtPoint) {
                    await page.mouse.click(x, y);
                    successCount++;
                } else {
                    await page.mouse.move(x, y);
                }
                await page.waitForTimeout(200);
            } catch (error) {
                errorCount++;
                console.warn(
                    `Mouse click at (${x}, ${y}) failed: ${error instanceof Error ? error.message : String(error)}`,
                );
                await page.waitForTimeout(100);
            }
        }

        console.log(`Mouse interactions: ${successCount} successful, ${errorCount} errors out of 10 attempts`);

        if (errorCount / 10 > 0.8) {
            console.warn("High mouse interaction error rate detected.");
        }

        const title = await page.title();
        expect(title).toBeTruthy();
    });
});
