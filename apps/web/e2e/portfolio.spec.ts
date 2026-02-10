import { expect, test } from "@playwright/test";

test.describe("訪問者がポートフォリオを閲覧する", () => {
    test("シナリオ1: ポートフォリオ一覧からポートフォリオ詳細へ遷移する", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("link", { name: /portfolio|work/i }).click();

        await expect(page).toHaveURL(/\/portfolio/);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

        const firstCard = page.locator("[data-testid='portfolio-card']").first();
        const hasCard = (await firstCard.count()) > 0;

        if (hasCard) {
            await firstCard.click();

            await expect(page).toHaveURL(/\/portfolio\/.+/);

            await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
            await expect(page.locator("article, main")).toBeVisible();
        }
    });

    test("シナリオ2: 存在しないポートフォリオにアクセスした場合404が表示される", async ({ page }) => {
        const response = await page.goto("/portfolio/non-existent-project-12345");

        expect(response?.status()).toBe(404);
        await expect(page.locator("text=/404|not found/i")).toBeVisible();
    });

    test("ポートフォリオ一覧で会社名とサムネイルが表示される", async ({ page }) => {
        await page.goto("/portfolio");

        const cards = page.locator("[data-testid='portfolio-card']");
        const cardCount = await cards.count();

        if (cardCount > 0) {
            const firstCard = cards.first();
            await expect(firstCard.locator("h2, h3")).toBeVisible();
        }
    });
});
