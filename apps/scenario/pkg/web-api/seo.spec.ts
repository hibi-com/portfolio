import { expect, test } from "@playwright/test";

test.describe("SEO Files", () => {
    test("should return sitemap.xml with valid structure", async ({ request }) => {
        const response = await request.get("/sitemap.xml");
        expect(response.status()).toBe(200);
        expect(response.headers()["content-type"]).toContain("xml");

        const text = await response.text();
        expect(text).toContain("<?xml");
        expect(text).toContain("<urlset");
        expect(text).toContain("<url>");
    });

    test("should return robots.txt", async ({ request }) => {
        const response = await request.get("/robots.txt");
        expect(response.status()).toBe(200);
        expect(response.headers()["content-type"]).toContain("text/plain");

        const text = await response.text();
        expect(text.length).toBeGreaterThan(0);
    });
});
