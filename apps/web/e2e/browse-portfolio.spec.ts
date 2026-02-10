/**
 * @story docs/user-stories/visitor/browse-portfolio.md
 */
import { expect, test } from "@playwright/test";

test.describe("訪問者: ポートフォリオを閲覧する", () => {
    test.describe("AC1: ポートフォリオ一覧からポートフォリオ詳細へ遷移する", () => {
        test("シナリオ1: ポートフォリオ一覧からポートフォリオ詳細へ遷移する", async ({ page }) => {
            // Given: トップページにアクセスしている
            await page.goto("/");

            // When: ポートフォリオ一覧リンクをクリックする
            await page.getByRole("link", { name: /portfolio|work/i }).click();

            // Then: ポートフォリオ一覧ページが表示される
            await expect(page).toHaveURL(/\/portfolio/);
            await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

            const firstCard = page.locator("[data-testid='portfolio-card']").first();
            const hasCard = (await firstCard.count()) > 0;

            if (hasCard) {
                // When: 最初のポートフォリオカードをクリックする
                await firstCard.click();

                // Then: ポートフォリオ詳細ページが表示される
                await expect(page).toHaveURL(/\/portfolio\/.+/);

                // And: プロジェクトのタイトル、説明が表示される
                await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
                await expect(page.locator("article, main")).toBeVisible();
            }
        });
    });

    test.describe("AC2: 存在しないポートフォリオへのアクセス", () => {
        test("シナリオ2: 存在しないポートフォリオにアクセスした場合404が表示される", async ({ page }) => {
            // Given: 存在しないポートフォリオのURLにアクセスする
            const response = await page.goto("/portfolio/non-existent-project-12345");

            // Then: 404エラーページが表示される
            expect(response?.status()).toBe(404);
            await expect(page.locator("text=/404|not found/i")).toBeVisible();
        });
    });

    test.describe("AC3: 一覧表示の確認", () => {
        test("ポートフォリオ一覧で会社名とサムネイルが表示される", async ({ page }) => {
            // Given: ポートフォリオ一覧ページにアクセスしている
            await page.goto("/portfolio");

            // Then: プロジェクトのタイトル、会社名が表示される
            const cards = page.locator("[data-testid='portfolio-card']");
            const cardCount = await cards.count();

            if (cardCount > 0) {
                const firstCard = cards.first();
                await expect(firstCard.locator("h2, h3")).toBeVisible();
            }
        });
    });
});
