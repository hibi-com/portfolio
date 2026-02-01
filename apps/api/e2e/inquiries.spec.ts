import { expect, test } from "@playwright/test";

const API_URL = process.env.VITE_API_URL ?? "http://localhost:8787";

test.describe("Inquiries API", () => {
    test("should return inquiries list", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/support/inquiries`);

        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    test("should return 400 for invalid inquiry ID format", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/support/inquiries/invalid-id`);

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 404 for non-existent inquiry", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/support/inquiries/00000000-0000-0000-0000-000000000000`);

        expect(response.status()).toBe(404);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 400 when creating inquiry without required fields", async ({ request }) => {
        const response = await request.post(`${API_URL}/api/support/inquiries`, {
            data: {
                priority: "HIGH",
            },
        });

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 400 when resolving invalid inquiry ID", async ({ request }) => {
        const response = await request.post(`${API_URL}/api/support/inquiries/invalid-id/resolve`);

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 400 when closing invalid inquiry ID", async ({ request }) => {
        const response = await request.post(`${API_URL}/api/support/inquiries/invalid-id/close`);

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 400 for invalid inquiry ID when getting responses", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/support/inquiries/invalid-id/responses`);

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 400 when adding response without content", async ({ request }) => {
        const response = await request.post(`${API_URL}/api/support/inquiries/00000000-0000-0000-0000-000000000000/responses`, {
            data: {
                isInternal: true,
            },
        });

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });
});
