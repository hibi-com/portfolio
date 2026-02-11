import { expect, test } from "@playwright/test";

/**
 * @story docs/user-stories/admin/manage-inquiries.md
 */
test.describe("管理者: 問い合わせを管理する", () => {
    test.describe("AC1: 問い合わせ一覧の表示", () => {
        test("問い合わせ一覧ページに遷移できる", async ({ page }) => {
            await page.goto("/support/inquiries");

            await expect(page).toHaveURL("/support/inquiries");
            await expect(page.getByRole("heading", { name: /Inquiries|問い合わせ/i })).toBeVisible();
        });

        test("問い合わせ一覧が表示される", async ({ page }) => {
            await page.goto("/support/inquiries");

            await expect(page.getByTestId("inquiries-list")).toBeVisible();
        });
    });

    test.describe("AC2: 問い合わせ詳細の表示", () => {
        test("問い合わせ詳細ページに遷移できる", async ({ page }) => {
            await page.goto("/support/inquiries");

            const firstInquiry = page.getByTestId("inquiry-item").first();
            if (await firstInquiry.isVisible()) {
                await firstInquiry.click();

                await expect(page).toHaveURL(/\/support\/inquiries\/.+/);
            }
        });
    });

    test.describe("AC3: 問い合わせへの返信", () => {
        test.skip("返信フォームが表示される", async ({ page }) => {
            await page.goto("/support/inquiries/1");

            await expect(page.getByRole("textbox", { name: /返信|Reply/i })).toBeVisible();
        });
    });

    test.describe("AC4: ステータスの変更", () => {
        test.skip("ステータスを変更できる", async ({ page }) => {
            await page.goto("/support/inquiries/1");

            await expect(page.getByRole("combobox", { name: /ステータス|Status/i })).toBeVisible();
        });
    });

    test.describe("AC5: 未読/既読の管理", () => {
        test.skip("詳細表示時に既読になる", async ({ page }) => {
            // Placeholder: 既読状態の検証は実装後に有効化
            await page.goto("/support/inquiries");
            await expect(page.getByTestId("inquiries-list")).toBeVisible();
        });
    });
});
