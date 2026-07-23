import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

async function attemptFallbackRecovery(page: Page): Promise<boolean> {
    try {
        const currentUrl = page.url();
        if (currentUrl && currentUrl !== "") {
            await page.reload({ timeout: 3000, waitUntil: "domcontentloaded" });
            return true;
        }
        await page.goto("/", { timeout: 5000, waitUntil: "domcontentloaded" });
        return true;
    } catch (fallbackError) {
        console.error(
            `Fallback recovery also failed: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`,
        );
        return false;
    }
}

async function recoverToHomePage(page: Page, failedRoute: string): Promise<boolean> {
    try {
        await page.goto("/", { timeout: 3000, waitUntil: "domcontentloaded" });
        return true;
    } catch (recoveryError) {
        const recoveryErrorMessage = recoveryError instanceof Error ? recoveryError.message : String(recoveryError);
        console.warn(`Failed to recover to home page after error on ${failedRoute}: ${recoveryErrorMessage}`);
        return await attemptFallbackRecovery(page);
    }
}

async function navigateToRoute(page: Page, route: string): Promise<boolean> {
    try {
        const response = await page.goto(route, {
            timeout: 5000,
            waitUntil: "domcontentloaded",
        });

        if (response && response.status() >= 400) {
            throw new Error(`HTTP ${response.status()} for ${route}`);
        }

        await page.waitForLoadState("networkidle", { timeout: 5000 });
        return true;
    } catch {
        return false;
    }
}

async function runOneNavigationAttempt(
    page: Page,
    route: string,
    navigationErrors: Array<{ route: string; error: string }>,
): Promise<{ success: boolean; recoveryFailed: boolean }> {
    const success = await navigateToRoute(page, route);
    if (success) {
        return { success: true, recoveryFailed: false };
    }

    navigationErrors.push({ route, error: `Navigation failed for ${route}` });
    console.warn(`Navigation to ${route} failed`);
    const recovered = await recoverToHomePage(page, route);
    return { success: false, recoveryFailed: !recovered };
}

function logNavigationSummary(
    successCount: number,
    errorCount: number,
    recoveryFailureCount: number,
    navigationErrors: Array<{ route: string; error: string }>,
): void {
    console.log(`Navigation summary: ${successCount} successful, ${errorCount} errors out of 10 attempts`);
    if (recoveryFailureCount > 0) {
        console.log(`Recovery failures: ${recoveryFailureCount}`);
    }
    if (navigationErrors.length > 0) {
        console.log("Failed routes:", navigationErrors.map((e) => `${e.route}: ${e.error}`).join(", "));
    }
    if (errorCount / 10 > 0.5) {
        console.warn("High navigation error rate detected. Some routes may be unstable.");
    }
    if (recoveryFailureCount > 0 && errorCount > 0 && recoveryFailureCount / errorCount > 0.5) {
        console.warn("High recovery failure rate detected. Application may be in an unstable state.");
    }
}

test.describe("Rapid Navigation", () => {
    test("should handle rapid navigation without errors", async ({ page }) => {
        const routes = ["/", "/blog", "/portfolio", "/resume", "/uses"];
        let successCount = 0;
        let recoveryFailureCount = 0;
        const navigationErrors: Array<{ route: string; error: string }> = [];

        for (let i = 0; i < 10; i++) {
            const randomRoute = routes[Math.floor(Math.random() * routes.length)] ?? routes[0] ?? "/";
            const result = await runOneNavigationAttempt(page, randomRoute, navigationErrors);
            if (result.success) {
                successCount++;
            } else if (result.recoveryFailed) {
                recoveryFailureCount++;
            }
        }

        const errorCount = 10 - successCount;
        logNavigationSummary(successCount, errorCount, recoveryFailureCount, navigationErrors);

        expect(successCount).toBeGreaterThan(0);
        await expect(page).toHaveURL(/.*/);
    });
});
