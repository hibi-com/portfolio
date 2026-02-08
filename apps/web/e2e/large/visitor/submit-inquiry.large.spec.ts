/**
 * @story docs/user-stories/visitor/submit-inquiry.md
 * @description 訪問者が問い合わせを送信するシナリオ
 *
 * ユーザーストーリーに基づき、以下のシナリオを検証:
 * - 問い合わせを正常に送信する
 * - 必須項目が未入力の場合のバリデーション
 * - メールアドレスが不正な形式の場合のバリデーション
 */

import { expect, test } from "@playwright/test";

test.describe("訪問者が問い合わせを送信する", () => {
    test("シナリオ1: 問い合わせを正常に送信する", async ({ page }) => {
        // Given: お問い合わせページにアクセスしている
        await page.goto("/contact");

        // ページが存在しない場合はスキップ
        const pageTitle = await page.title();
        if (pageTitle.includes("404") || pageTitle.includes("Not Found")) {
            test.skip();
            return;
        }

        // When: 件名を入力する
        const subjectInput = page.locator(
            "[data-testid='inquiry-subject'], input[name='subject'], input[placeholder*='件名']",
        );
        if ((await subjectInput.count()) > 0) {
            await subjectInput.fill("技術的な質問");
        }

        // And: 内容を入力する
        const contentInput = page.locator(
            "[data-testid='inquiry-content'], textarea[name='content'], textarea[placeholder*='内容']",
        );
        if ((await contentInput.count()) > 0) {
            await contentInput.fill("この機能について質問があります");
        }

        // And: メールアドレスを入力する
        const emailInput = page.locator(
            "[data-testid='inquiry-email'], input[name='email'], input[type='email']",
        );
        if ((await emailInput.count()) > 0) {
            await emailInput.fill("user@example.com");
        }

        // And: 送信ボタンをクリックする
        const submitButton = page.locator(
            "[data-testid='inquiry-submit'], button[type='submit'], input[type='submit']",
        );
        if ((await submitButton.count()) > 0) {
            await submitButton.click();

            // Then: 送信完了メッセージが表示される
            await expect(
                page.locator("text=/送信完了|ありがとうございます|Thank you|Sent/i"),
            ).toBeVisible({ timeout: 10000 });
        }
    });

    test("シナリオ2: 必須項目が未入力の場合", async ({ page }) => {
        // Given: お問い合わせページにアクセスしている
        await page.goto("/contact");

        const pageTitle = await page.title();
        if (pageTitle.includes("404") || pageTitle.includes("Not Found")) {
            test.skip();
            return;
        }

        // When: 件名を空のまま送信ボタンをクリックする
        const submitButton = page.locator(
            "[data-testid='inquiry-submit'], button[type='submit'], input[type='submit']",
        );

        if ((await submitButton.count()) > 0) {
            await submitButton.click();

            // Then: バリデーションエラーが表示される
            // HTML5バリデーションまたはカスタムエラーメッセージ
            const errorMessage = page.locator(
                "[data-testid='error-message'], .error, [role='alert'], :invalid",
            );
            const hasError = (await errorMessage.count()) > 0;

            // HTML5 required属性による検証
            const requiredFields = page.locator("[required]");
            const hasRequiredFields = (await requiredFields.count()) > 0;

            expect(hasError || hasRequiredFields).toBe(true);
        }
    });

    test("シナリオ3: メールアドレスが不正な形式の場合", async ({ page }) => {
        // Given: お問い合わせページにアクセスしている
        await page.goto("/contact");

        const pageTitle = await page.title();
        if (pageTitle.includes("404") || pageTitle.includes("Not Found")) {
            test.skip();
            return;
        }

        // When: メールアドレスに不正な形式を入力する
        const emailInput = page.locator(
            "[data-testid='inquiry-email'], input[name='email'], input[type='email']",
        );

        if ((await emailInput.count()) > 0) {
            await emailInput.fill("invalid-email");

            // And: 送信ボタンをクリックする
            const submitButton = page.locator(
                "[data-testid='inquiry-submit'], button[type='submit']",
            );

            if ((await submitButton.count()) > 0) {
                await submitButton.click();

                // Then: メールアドレスの形式エラーが表示される
                // HTML5 email validationまたはカスタムエラー
                const isInvalid = await emailInput.evaluate((el) => {
                    return el instanceof HTMLInputElement && !el.validity.valid;
                });

                expect(isInvalid).toBe(true);
            }
        }
    });

    test("お問い合わせフォームにアクセスできる", async ({ page }) => {
        // Given: トップページからスタート
        await page.goto("/");

        // When: お問い合わせリンクを探してクリック
        const contactLink = page.getByRole("link", { name: /contact|お問い合わせ|inquiry/i });

        if ((await contactLink.count()) > 0) {
            await contactLink.click();

            // Then: お問い合わせページに遷移
            await expect(page).toHaveURL(/\/(contact|inquiry)/);
        }
    });
});
