import { describe, expect, test } from "vitest";
import {
	createDealInputSchema,
	dealSchema,
	dealStatusSchema,
	updateDealInputSchema,
} from "./deal";

describe("Deal Zod Schemas", () => {
	describe("dealStatusSchema", () => {
		test("should validate valid status values", () => {
			expect(dealStatusSchema.safeParse("OPEN").success).toBe(true);
			expect(dealStatusSchema.safeParse("WON").success).toBe(true);
			expect(dealStatusSchema.safeParse("LOST").success).toBe(true);
			expect(dealStatusSchema.safeParse("STALLED").success).toBe(true);
		});

		test("should reject invalid status", () => {
			expect(dealStatusSchema.safeParse("UNKNOWN").success).toBe(false);
			expect(dealStatusSchema.safeParse("").success).toBe(false);
		});
	});

	describe("dealSchema", () => {
		test("should validate complete deal", () => {
			const result = dealSchema.safeParse({
				id: "deal-123",
				customerId: "cust-123",
				leadId: "lead-123",
				stageId: "stage-1",
				name: "Big Deal",
				value: 100000,
				currency: "JPY",
				expectedCloseDate: "2024-06-01T00:00:00Z",
				actualCloseDate: "2024-05-15T00:00:00Z",
				status: "WON",
				notes: "Important client",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate deal with minimum required fields", () => {
			const result = dealSchema.safeParse({
				id: "deal-123",
				stageId: "stage-1",
				name: "Test Deal",
				currency: "JPY",
				status: "OPEN",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should reject deal with negative value", () => {
			const result = dealSchema.safeParse({
				id: "deal-123",
				stageId: "stage-1",
				name: "Test Deal",
				value: -1000,
				currency: "JPY",
				status: "OPEN",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});

		test("should accept deal with value 0", () => {
			const result = dealSchema.safeParse({
				id: "deal-123",
				stageId: "stage-1",
				name: "Test Deal",
				value: 0,
				currency: "JPY",
				status: "OPEN",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should reject deal without stageId", () => {
			const result = dealSchema.safeParse({
				id: "deal-123",
				name: "Test Deal",
				currency: "JPY",
				status: "OPEN",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("createDealInputSchema", () => {
		test("should validate create input with all fields", () => {
			const result = createDealInputSchema.safeParse({
				customerId: "cust-123",
				leadId: "lead-123",
				stageId: "stage-1",
				name: "New Deal",
				value: 50000,
				currency: "USD",
				expectedCloseDate: "2024-12-31T00:00:00Z",
				status: "OPEN",
				notes: "Promising opportunity",
			});
			expect(result.success).toBe(true);
		});

		test("should validate create input with minimum fields", () => {
			const result = createDealInputSchema.safeParse({
				stageId: "stage-1",
				name: "New Deal",
			});
			expect(result.success).toBe(true);
		});

		test("should reject create input without stageId", () => {
			const result = createDealInputSchema.safeParse({
				name: "New Deal",
			});
			expect(result.success).toBe(false);
		});

		test("should reject create input without name", () => {
			const result = createDealInputSchema.safeParse({
				stageId: "stage-1",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("updateDealInputSchema", () => {
		test("should validate update input with partial fields", () => {
			const result = updateDealInputSchema.safeParse({
				status: "WON",
				actualCloseDate: "2024-05-15T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate update input with empty object", () => {
			const result = updateDealInputSchema.safeParse({});
			expect(result.success).toBe(true);
		});

		test("should validate update with lostReason for lost deal", () => {
			const result = updateDealInputSchema.safeParse({
				status: "LOST",
				lostReason: "Budget constraints",
			});
			expect(result.success).toBe(true);
		});
	});
});
