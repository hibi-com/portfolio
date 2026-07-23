import { expect, test } from "@playwright/test";

test.describe("Portfolio API", () => {
    test("should return portfolio items from /api/portfolio", async ({ request }) => {
        const response = await request.get("/api/portfolio");
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);

        if (data.length > 0) {
            const item = data[0];
            expect(item).toHaveProperty("slug");
            expect(item).toHaveProperty("title");
            expect(item).toHaveProperty("date");
        }
    });

    test("should return 404 for non-existent portfolio item", async ({ request }) => {
        const response = await request.get("/api/portfolio/non-existent-slug");
        expect(response.status()).toBe(404);
    });

    test("should return valid JSON response from /api/portfolio", async ({ request }) => {
        const response = await request.get("/api/portfolio");
        expect(response.headers()["content-type"]).toContain("application/json");

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });
});
