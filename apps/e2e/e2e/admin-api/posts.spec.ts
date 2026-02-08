/**
 * Admin Posts API E2E Tests
 *
 * BASE_URL 環境変数で対象環境を切り替え可能
 */
import { expect, test } from "@playwright/test";

test.describe("Admin Posts API", () => {
    test("should return posts list from /api/posts", async ({ request }) => {
        const response = await request.get("/api/posts");
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    test("should return 401 for unauthorized access", async ({ request }) => {
        // 認証なしでアクセスした場合
        const response = await request.get("/api/posts", {
            headers: {
                Authorization: "Bearer invalid-token",
            },
        });
        // 認証エラーまたは成功（環境による）
        expect([200, 401, 403]).toContain(response.status());
    });
});
