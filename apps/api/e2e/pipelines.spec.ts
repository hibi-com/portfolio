import { expect, test } from "@playwright/test";

const API_URL = process.env.VITE_API_URL ?? "http://localhost:8787";

test.describe("Pipelines API", () => {
    test("should return pipelines list", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/crm/pipelines`);

        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    test("should return 400 for invalid pipeline ID format", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/crm/pipelines/invalid-id`);

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 404 for non-existent pipeline", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/crm/pipelines/00000000-0000-0000-0000-000000000000`);

        expect(response.status()).toBe(404);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 400 when creating pipeline without name", async ({ request }) => {
        const response = await request.post(`${API_URL}/api/crm/pipelines`, {
            data: {
                description: "Test Pipeline",
            },
        });

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });
});
