import { describe, expect, test } from "vitest";
import { customerFormDataSchema, customerListItemSchema, customerSchema, customerStatusSchema } from "./schemas";

describe("Customer Entity Schemas", () => {
    describe("customerStatusSchema", () => {
        test("should validate valid status values", () => {
            const validStatuses = ["ACTIVE", "INACTIVE", "PROSPECT", "CHURNED"];

            for (const status of validStatuses) {
                const result = customerStatusSchema.safeParse(status);
                expect(result.success).toBe(true);
            }
        });

        test("should reject invalid status", () => {
            const result = customerStatusSchema.safeParse("INVALID");
            expect(result.success).toBe(false);
        });
    });

    describe("customerSchema", () => {
        test("should validate valid customer", () => {
            const validCustomer = {
                id: "cust-1",
                name: "John Doe",
                email: "john@example.com",
                status: "ACTIVE",
                createdAt: "2024-01-01",
                updatedAt: "2024-01-01",
            };

            const result = customerSchema.safeParse(validCustomer);
            expect(result.success).toBe(true);
        });

        test("should validate customer with optional fields", () => {
            const customerWithOptional = {
                id: "cust-1",
                name: "John Doe",
                email: "john@example.com",
                phone: "090-1234-5678",
                company: "Example Corp",
                website: "https://example.com",
                address: "Tokyo, Japan",
                notes: "VIP customer",
                status: "ACTIVE",
                tags: ["vip", "tech"],
                customFields: { industry: "IT" },
                createdAt: "2024-01-01",
                updatedAt: "2024-01-02",
            };

            const result = customerSchema.safeParse(customerWithOptional);
            expect(result.success).toBe(true);
        });

        test("should reject invalid customer", () => {
            const invalidCustomers = [
                { id: "", name: "John", status: "ACTIVE", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
                { id: "cust-1", name: "", status: "ACTIVE", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
            ];

            for (const invalid of invalidCustomers) {
                const result = customerSchema.safeParse(invalid);
                expect(result.success).toBe(false);
            }
        });
    });

    describe("customerListItemSchema", () => {
        test("should validate valid list item", () => {
            const validListItem = {
                id: "cust-1",
                name: "John Doe",
                status: "ACTIVE",
                createdAt: "2024-01-01",
            };

            const result = customerListItemSchema.safeParse(validListItem);
            expect(result.success).toBe(true);
        });

        test("should validate list item with optional fields", () => {
            const listItemWithOptional = {
                id: "cust-1",
                name: "John Doe",
                email: "john@example.com",
                company: "Example Corp",
                status: "PROSPECT",
                createdAt: "2024-01-01",
            };

            const result = customerListItemSchema.safeParse(listItemWithOptional);
            expect(result.success).toBe(true);
        });
    });

    describe("customerFormDataSchema", () => {
        test("should validate valid form data", () => {
            const validFormData = {
                name: "John Doe",
            };

            const result = customerFormDataSchema.safeParse(validFormData);
            expect(result.success).toBe(true);
        });

        test("should validate form data with optional fields", () => {
            const formDataWithOptional = {
                name: "John Doe",
                email: "john@example.com",
                phone: "090-1234-5678",
                company: "Example Corp",
                website: "https://example.com",
                address: "Tokyo, Japan",
                notes: "New customer",
                status: "PROSPECT",
                tags: ["new"],
            };

            const result = customerFormDataSchema.safeParse(formDataWithOptional);
            expect(result.success).toBe(true);
        });

        test("should reject invalid form data", () => {
            const invalidFormData = {
                name: "",
            };

            const result = customerFormDataSchema.safeParse(invalidFormData);
            expect(result.success).toBe(false);
        });
    });
});
