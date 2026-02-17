import { describe, expect, test } from "vitest";
import { portfolioContentSchema, portfolioSchema } from "./portfolio";

describe("Portfolio Zod Schemas", () => {
    describe("portfolioContentSchema", () => {
        test("should validate portfolio content with html", () => {
            const result = portfolioContentSchema.safeParse({ html: "<p>Test</p>" });
            expect(result.success).toBe(true);
        });

        test("should reject portfolio content without html", () => {
            const result = portfolioContentSchema.safeParse({});
            expect(result.success).toBe(false);
        });
    });

    describe("portfolioSchema", () => {
        test("should validate complete portfolio", () => {
            const result = portfolioSchema.safeParse({
                id: "portfolio-1",
                title: "Test Portfolio",
                slug: "test-portfolio",
                company: "Test Company",
                date: "2024-01-01",
                current: true,
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            });
            expect(result.success).toBe(true);
        });

        test("should reject portfolio without required fields", () => {
            const result = portfolioSchema.safeParse({
                title: "Test Portfolio",
            });
            expect(result.success).toBe(false);
        });
    });
});
