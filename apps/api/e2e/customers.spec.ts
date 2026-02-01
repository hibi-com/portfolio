import { expect, test } from "@playwright/test";

const API_URL = process.env.VITE_API_URL ?? "http://localhost:8787";

test.describe("Customers API", () => {
    test("should return customers list", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/crm/customers`);

        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    test("should return 400 for invalid customer ID format", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/crm/customers/invalid-id`);

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 404 for non-existent customer", async ({ request }) => {
        const response = await request.get(`${API_URL}/api/crm/customers/00000000-0000-0000-0000-000000000000`);

        expect(response.status()).toBe(404);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });

    test("should return 400 when creating customer without name", async ({ request }) => {
        const response = await request.post(`${API_URL}/api/crm/customers`, {
            data: {
                email: "test@example.com",
            },
        });

        expect(response.status()).toBe(400);

        const data = await response.json();
        expect(data).toHaveProperty("error");
    });
});
