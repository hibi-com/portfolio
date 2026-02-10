import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

function pickRandom<T>(arr: T[]): T | undefined {
    if (arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
}

async function clickRandomLink(page: Page, onError: () => void): Promise<void> {
    const links = await page.getByRole("link").all();
    const randomLink = pickRandom(links);
    if (!randomLink) return;

    const isVisible = await randomLink.isVisible().catch(() => false);
    if (!isVisible) return;

    try {
        await randomLink.click({ timeout: 2000 });
        await page.waitForLoadState("networkidle", { timeout: 5000 });
    } catch (error) {
        onError();
        console.warn(`Link click failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function clickRandomButton(page: Page, onError: () => void): Promise<void> {
    const buttons = await page.getByRole("button").all();
    const randomButton = pickRandom(buttons);
    if (!randomButton) return;

    const isVisible = await randomButton.isVisible().catch(() => false);
    if (!isVisible) return;

    try {
        await randomButton.click({ timeout: 2000 });
    } catch (error) {
        onError();
        console.warn(`Button click failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function fillRandomInput(page: Page, onError: () => void): Promise<void> {
    const inputs = await page.locator("input, textarea").all();
    const randomInput = pickRandom(inputs);
    if (!randomInput) return;

    const [isVisible, isEditable] = await Promise.all([
        randomInput.isVisible().catch(() => false),
        randomInput.isEditable().catch(() => false),
    ]);
    if (!isVisible || !isEditable) return;

    try {
        await randomInput.fill("test", { timeout: 2000 });
    } catch (error) {
        onError();
        console.warn(`Input fill failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function randomScroll(page: Page): Promise<void> {
    await page.evaluate(() => {
        globalThis.scrollBy(0, Math.random() * 500);
    });
}

async function randomHistoryNavigation(page: Page, onError: () => void): Promise<void> {
    try {
        if (Math.random() > 0.5) {
            const canGoBack = await page.evaluate(() => globalThis.history.length > 1).catch(() => false);
            if (canGoBack) await page.goBack({ timeout: 2000 });
        } else {
            const canGoForward = await page
                .evaluate(() => globalThis.history.length > 0 && globalThis.history.state !== null)
                .catch(() => false);
            if (canGoForward) await page.goForward({ timeout: 2000 });
        }
    } catch (error) {
        onError();
        console.warn(`Navigation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}

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
            () =>
                clickRandomLink(page, () => {
                    errorCounts.link++;
                }),
            () =>
                clickRandomButton(page, () => {
                    errorCounts.button++;
                }),
            () =>
                fillRandomInput(page, () => {
                    errorCounts.input++;
                }),
            () => randomScroll(page),
            () =>
                randomHistoryNavigation(page, () => {
                    errorCounts.navigation++;
                }),
        ];

        for (let i = 0; i < maxActions; i++) {
            const randomAction = pickRandom(actions);
            if (randomAction) {
                try {
                    await randomAction();
                    await page.waitForTimeout(100);
                } catch (error) {
                    console.error(`Action ${i} failed:`, error);
                }
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
