import { expect, test } from "@playwright/test";

test.describe("Blog API", () => {
    test("should return blog posts from /api/blog", async ({ request }) => {
        const response = await request.get("/api/blog");
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data).toHaveProperty("posts");
        expect(data).toHaveProperty("tags");
        expect(Array.isArray(data.posts)).toBe(true);
        expect(Array.isArray(data.tags)).toBe(true);

        if (data.posts.length > 0) {
            const post = data.posts[0];
            expect(post).toHaveProperty("slug");
            expect(post).toHaveProperty("title");
            expect(post).toHaveProperty("date");
        }
    });

    test("should return 404 for non-existent blog post", async ({ request }) => {
        const response = await request.get("/api/blog/non-existent-slug");
        expect(response.status()).toBe(404);
    });

    test("should return valid JSON response from /api/blog", async ({ request }) => {
        const response = await request.get("/api/blog");
        expect(response.headers()["content-type"]).toContain("application/json");

        const data = await response.json();
        expect(typeof data).toBe("object");
    });
});
