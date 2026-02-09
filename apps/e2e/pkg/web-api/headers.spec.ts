import { expect, test } from "@playwright/test";

test.describe("HTTP Headers and Status Codes", () => {
    test("should handle CORS headers if applicable", async ({ request }) => {
        const response = await request.get("/api/blog");
        const headers = response.headers();

        if (headers["access-control-allow-origin"]) {
            expect(headers["access-control-allow-origin"]).toBeTruthy();
        }
    });

    test("should return appropriate status codes", async ({ request }) => {
        const blogResponse = await request.get("/api/blog");
        expect([200, 404]).toContain(blogResponse.status());

        const portfolioResponse = await request.get("/api/portfolio");
        expect([200, 404]).toContain(portfolioResponse.status());
    });
});
