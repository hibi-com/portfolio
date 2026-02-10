import { describe, expect, test } from "vitest";
import { createLeadInputSchema, leadSchema, leadStatusSchema, updateLeadInputSchema } from "./lead";

describe("Lead Zod Schemas", () => {
    describe("leadStatusSchema", () => {
        test("should validate valid status values", () => {
            expect(leadStatusSchema.safeParse("NEW").success).toBe(true);
            expect(leadStatusSchema.safeParse("CONTACTED").success).toBe(true);
            expect(leadStatusSchema.safeParse("QUALIFIED").success).toBe(true);
            expect(leadStatusSchema.safeParse("UNQUALIFIED").success).toBe(true);
            expect(leadStatusSchema.safeParse("CONVERTED").success).toBe(true);
        });

        test("should reject invalid status", () => {
            expect(leadStatusSchema.safeParse("UNKNOWN").success).toBe(false);
            expect(leadStatusSchema.safeParse("").success).toBe(false);
        });
    });

    describe("leadSchema", () => {
        test("should validate complete lead", () => {
            const result = leadSchema.safeParse({
                id: "lead-123",
                customerId: "cust-123",
                name: "Test Lead",
                email: "lead@example.com",
                phone: "090-1234-5678",
                company: "Lead Corp",
                source: "website",
                status: "NEW",
                score: 75,
                notes: "Interested in product",
                convertedAt: "2024-06-01T00:00:00Z",
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(true);
        });

        test("should validate lead with minimum required fields", () => {
            const result = leadSchema.safeParse({
                id: "lead-123",
                name: "Test Lead",
                status: "NEW",
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(true);
        });

        test("should reject lead with score above 100", () => {
            const result = leadSchema.safeParse({
                id: "lead-123",
                name: "Test Lead",
                status: "NEW",
                score: 150,
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(false);
        });

        test("should reject lead with negative score", () => {
            const result = leadSchema.safeParse({
                id: "lead-123",
                name: "Test Lead",
                status: "NEW",
                score: -10,
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(false);
        });

        test("should accept lead with score 0", () => {
            const result = leadSchema.safeParse({
                id: "lead-123",
                name: "Test Lead",
                status: "NEW",
                score: 0,
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(true);
        });

        test("should accept lead with score 100", () => {
            const result = leadSchema.safeParse({
                id: "lead-123",
                name: "Test Lead",
                status: "NEW",
                score: 100,
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(true);
        });
    });

    describe("createLeadInputSchema", () => {
        test("should validate create input with all fields", () => {
            const result = createLeadInputSchema.safeParse({
                customerId: "cust-123",
                name: "New Lead",
                email: "new@example.com",
                phone: "090-1234-5678",
                company: "New Corp",
                source: "referral",
                status: "NEW",
                score: 50,
                notes: "From conference",
            });
            expect(result.success).toBe(true);
        });

        test("should validate create input with minimum fields", () => {
            const result = createLeadInputSchema.safeParse({
                name: "New Lead",
            });
            expect(result.success).toBe(true);
        });

        test("should reject create input without name", () => {
            const result = createLeadInputSchema.safeParse({
                email: "test@example.com",
            });
            expect(result.success).toBe(false);
        });
    });

    describe("updateLeadInputSchema", () => {
        test("should validate update input with partial fields", () => {
            const result = updateLeadInputSchema.safeParse({
                status: "QUALIFIED",
                score: 80,
            });
            expect(result.success).toBe(true);
        });

        test("should validate update input with empty object", () => {
            const result = updateLeadInputSchema.safeParse({});
            expect(result.success).toBe(true);
        });
    });
});
