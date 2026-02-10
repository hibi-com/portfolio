import { describe, expect, test } from "vitest";
import {
	createCustomerInputSchema,
	customerSchema,
	customerStatusSchema,
	updateCustomerInputSchema,
} from "./customer";

describe("Customer Zod Schemas", () => {
	describe("customerStatusSchema", () => {
		test("should validate valid status values", () => {
			expect(customerStatusSchema.safeParse("ACTIVE").success).toBe(true);
			expect(customerStatusSchema.safeParse("INACTIVE").success).toBe(true);
			expect(customerStatusSchema.safeParse("PROSPECT").success).toBe(true);
			expect(customerStatusSchema.safeParse("CHURNED").success).toBe(true);
		});

		test("should reject invalid status", () => {
			expect(customerStatusSchema.safeParse("UNKNOWN").success).toBe(false);
			expect(customerStatusSchema.safeParse("").success).toBe(false);
		});
	});

	describe("customerSchema", () => {
		test("should validate complete customer", () => {
			const result = customerSchema.safeParse({
				id: "cust-123",
				name: "Test Customer",
				email: "test@example.com",
				phone: "090-1234-5678",
				company: "Test Corp",
				website: "https://example.com",
				address: "Tokyo, Japan",
				notes: "Test notes",
				status: "ACTIVE",
				tags: ["vip", "partner"],
				customFields: { industry: "IT" },
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate customer with minimum required fields", () => {
			const result = customerSchema.safeParse({
				id: "cust-123",
				name: "Test Customer",
				status: "ACTIVE",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should reject customer without id", () => {
			const result = customerSchema.safeParse({
				name: "Test Customer",
				status: "ACTIVE",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});

		test("should reject customer with invalid email", () => {
			const result = customerSchema.safeParse({
				id: "cust-123",
				name: "Test Customer",
				email: "invalid-email",
				status: "ACTIVE",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});

		test("should reject customer with invalid website URL", () => {
			const result = customerSchema.safeParse({
				id: "cust-123",
				name: "Test Customer",
				website: "not-a-url",
				status: "ACTIVE",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("createCustomerInputSchema", () => {
		test("should validate create input with all fields", () => {
			const result = createCustomerInputSchema.safeParse({
				name: "New Customer",
				email: "new@example.com",
				phone: "090-1234-5678",
				company: "New Corp",
				website: "https://new.example.com",
				status: "PROSPECT",
				tags: ["new"],
			});
			expect(result.success).toBe(true);
		});

		test("should validate create input with minimum fields", () => {
			const result = createCustomerInputSchema.safeParse({
				name: "New Customer",
			});
			expect(result.success).toBe(true);
		});

		test("should reject create input without name", () => {
			const result = createCustomerInputSchema.safeParse({
				email: "test@example.com",
			});
			expect(result.success).toBe(false);
		});

		test("should reject create input with empty name", () => {
			const result = createCustomerInputSchema.safeParse({
				name: "",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("updateCustomerInputSchema", () => {
		test("should validate update input with partial fields", () => {
			const result = updateCustomerInputSchema.safeParse({
				name: "Updated Name",
				status: "INACTIVE",
			});
			expect(result.success).toBe(true);
		});

		test("should validate update input with empty object", () => {
			const result = updateCustomerInputSchema.safeParse({});
			expect(result.success).toBe(true);
		});

		test("should reject update with empty name", () => {
			const result = updateCustomerInputSchema.safeParse({
				name: "",
			});
			expect(result.success).toBe(false);
		});
	});
});
