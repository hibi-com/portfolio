import { expect, test } from "@playwright/test";

const API_URL = process.env.VITE_API_URL ?? "http://localhost:8787";

test.describe("Leads API", () => {
    test("should return leads list", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/crm/leads`);

        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    test("should return 400 for invalid lead ID format", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/crm/leads/invalid-id`);

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 404 for non-existent lead", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/crm/leads/00000000-0000-0000-0000-000000000000`);

        expect(response.status()).toBe(404);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 400 when creating lead without name", async ({ request }) => {
        const response = await request.post(`${API_URL}/api/crm/leads`, {
            data: {
                email: "lead@example.com",
            },
        });

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 400 when converting invalid lead ID", async ({ request }) => {
        const response = await request.post(`${API_URL}/api/crm/leads/invalid-id/convert`);

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });
});
