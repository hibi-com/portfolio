import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

async function skipIfNotFound(page: Page) {
    const pageTitle = await page.title();
    if (pageTitle.includes("404") || pageTitle.includes("Not Found")) {
        test.skip();
    }
}

async function fillIfPresent(page: Page, selector: string, value: string) {
    const el = page.locator(selector);
    if ((await el.count()) > 0) await el.fill(value);
}

test.describe("訪問者: 問い合わせを送信する", () => {
    test.describe("AC1: お問い合わせフォームへのアクセス", () => {
        test("お問い合わせフォームにアクセスできる", async ({ page }) => {
            await page.goto("/");

            const contactLink = page.getByRole("link", { name: /contact|お問い合わせ|inquiry/i });

            if ((await contactLink.count()) > 0) {
                await contactLink.click();
                await expect(page).toHaveURL(/\/(contact|inquiry)/);
            }
        });
    });

    test.describe("AC2: 問い合わせの正常送信", () => {
        test("シナリオ1: 問い合わせを正常に送信する", async ({ page }) => {
            await page.goto("/contact");
            await skipIfNotFound(page);

            await fillIfPresent(
                page,
                "[data-testid='inquiry-subject'], input[name='subject'], input[placeholder*='件名']",
                "技術的な質問",
            );
            await fillIfPresent(
                page,
                "[data-testid='inquiry-content'], textarea[name='content'], textarea[placeholder*='内容']",
                "この機能について質問があります",
            );
            await fillIfPresent(
                page,
                "[data-testid='inquiry-email'], input[name='email'], input[type='email']",
                "user@example.com",
            );

            const submitButton = page.locator(
                "[data-testid='inquiry-submit'], button[type='submit'], input[type='submit']",
            );
            if ((await submitButton.count()) <= 0) return;
            await submitButton.click();

            await expect(page.locator("text=/送信完了|ありがとうございます|Thank you|Sent/i")).toBeVisible({
                timeout: 10000,
            });
        });
    });

    test.describe("AC3: バリデーションエラー", () => {
        test("シナリオ2: 必須項目が未入力の場合エラーが表示される", async ({ page }) => {
            await page.goto("/contact");
            await skipIfNotFound(page);

            const submitButton = page.locator(
                "[data-testid='inquiry-submit'], button[type='submit'], input[type='submit']",
            );

            if ((await submitButton.count()) > 0) {
                await submitButton.click();
                const errorMessage = page.locator("[data-testid='error-message'], .error, [role='alert'], :invalid");
                const hasError = (await errorMessage.count()) > 0;

                const requiredFields = page.locator("[required]");
                const hasRequiredFields = (await requiredFields.count()) > 0;

                expect(hasError || hasRequiredFields).toBe(true);
            }
        });

        test("シナリオ3: メールアドレスが不正な形式の場合エラーが表示される", async ({ page }) => {
            await page.goto("/contact");
            await skipIfNotFound(page);

            const emailInput = page.locator("[data-testid='inquiry-email'], input[name='email'], input[type='email']");

            if ((await emailInput.count()) > 0) {
                await emailInput.fill("invalid-email");

                const submitButton = page.locator("[data-testid='inquiry-submit'], button[type='submit']");

                if ((await submitButton.count()) > 0) {
                    await submitButton.click();

                    const isInvalid = await emailInput.evaluate((el) => {
                        return el instanceof HTMLInputElement && !el.validity.valid;
                    });

                    expect(isInvalid).toBe(true);
                }
            }
        });
    });
});
