import { expect, test } from "@playwright/test";

const API_URL = process.env.VITE_API_URL ?? "http://localhost:8787";

test.describe("Deals API", () => {
    test("should return deals list", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/crm/deals`);

        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    test("should return 400 for invalid deal ID format", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/crm/deals/invalid-id`);

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 404 for non-existent deal", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/crm/deals/00000000-0000-0000-0000-000000000000`);

        expect(response.status()).toBe(404);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 400 when creating deal without required fields", async ({ request }) => {
        const response = await request.post(`${API_URL}/api/crm/deals`, {
            data: {
                value: 10000,
            },
        });

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 400 when moving deal with invalid ID", async ({ request }) => {
        const response = await request.put(`${API_URL}/api/crm/deals/invalid-id/stage`, {
            data: {
                stageId: "stage-1",
            },
        });

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 400 when moving deal without stageId", async ({ request }) => {
        const response = await request.put(`${API_URL}/api/crm/deals/00000000-0000-0000-0000-000000000000/stage`, {
            data: {},
        });

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });
});
