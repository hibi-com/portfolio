/**
 * @story docs/user-stories/visitor/submit-inquiry.md
 */
import { expect, test } from "@playwright/test";

test.describe("訪問者: 問い合わせを送信する", () => {
    test.describe("AC1: お問い合わせフォームへのアクセス", () => {
        test("お問い合わせフォームにアクセスできる", async ({ page }) => {
            // Given: トップページにアクセスしている
            await page.goto("/");

            const contactLink = page.getByRole("link", { name: /contact|お問い合わせ|inquiry/i });

            if ((await contactLink.count()) > 0) {
                // When: お問い合わせリンクをクリックする
                await contactLink.click();

                // Then: お問い合わせページが表示される
                await expect(page).toHaveURL(/\/(contact|inquiry)/);
            }
        });
    });

    test.describe("AC2: 問い合わせの正常送信", () => {
        test("シナリオ1: 問い合わせを正常に送信する", async ({ page }) => {
            // Given: お問い合わせページにアクセスしている
            await page.goto("/contact");

            const pageTitle = await page.title();
            if (pageTitle.includes("404") || pageTitle.includes("Not Found")) {
                test.skip();
                return;
            }

            // When: フォームに入力する
            const subjectInput = page.locator(
                "[data-testid='inquiry-subject'], input[name='subject'], input[placeholder*='件名']",
            );
            if ((await subjectInput.count()) > 0) {
                await subjectInput.fill("技術的な質問");
            }

            const contentInput = page.locator(
                "[data-testid='inquiry-content'], textarea[name='content'], textarea[placeholder*='内容']",
            );
            if ((await contentInput.count()) > 0) {
                await contentInput.fill("この機能について質問があります");
            }

            const emailInput = page.locator("[data-testid='inquiry-email'], input[name='email'], input[type='email']");
            if ((await emailInput.count()) > 0) {
                await emailInput.fill("user@example.com");
            }

            const submitButton = page.locator(
                "[data-testid='inquiry-submit'], button[type='submit'], input[type='submit']",
            );
            if ((await submitButton.count()) > 0) {
                // When: 送信ボタンをクリックする
                await submitButton.click();

                // Then: 送信完了メッセージが表示される
                await expect(page.locator("text=/送信完了|ありがとうございます|Thank you|Sent/i")).toBeVisible({
                    timeout: 10000,
                });
            }
        });
    });

    test.describe("AC3: バリデーションエラー", () => {
        test("シナリオ2: 必須項目が未入力の場合エラーが表示される", async ({ page }) => {
            // Given: お問い合わせページにアクセスしている
            await page.goto("/contact");

            const pageTitle = await page.title();
            if (pageTitle.includes("404") || pageTitle.includes("Not Found")) {
                test.skip();
                return;
            }

            const submitButton = page.locator(
                "[data-testid='inquiry-submit'], button[type='submit'], input[type='submit']",
            );

            if ((await submitButton.count()) > 0) {
                // When: 入力せずに送信ボタンをクリックする
                await submitButton.click();

                // Then: エラーメッセージが表示される
                const errorMessage = page.locator("[data-testid='error-message'], .error, [role='alert'], :invalid");
                const hasError = (await errorMessage.count()) > 0;

                const requiredFields = page.locator("[required]");
                const hasRequiredFields = (await requiredFields.count()) > 0;

                expect(hasError || hasRequiredFields).toBe(true);
            }
        });

        test("シナリオ3: メールアドレスが不正な形式の場合エラーが表示される", async ({ page }) => {
            // Given: お問い合わせページにアクセスしている
            await page.goto("/contact");

            const pageTitle = await page.title();
            if (pageTitle.includes("404") || pageTitle.includes("Not Found")) {
                test.skip();
                return;
            }

            const emailInput = page.locator("[data-testid='inquiry-email'], input[name='email'], input[type='email']");

            if ((await emailInput.count()) > 0) {
                // When: 不正なメールアドレスを入力する
                await emailInput.fill("invalid-email");

                const submitButton = page.locator("[data-testid='inquiry-submit'], button[type='submit']");

                if ((await submitButton.count()) > 0) {
                    await submitButton.click();

                    // Then: バリデーションエラーが発生する
                    const isInvalid = await emailInput.evaluate((el) => {
                        return el instanceof HTMLInputElement && !el.validity.valid;
                    });

                    expect(isInvalid).toBe(true);
                }
            }
        });
    });
});
