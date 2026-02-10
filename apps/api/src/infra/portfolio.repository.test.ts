import type { PrismaClient } from "@portfolio/db";
import { createPrismaClient } from "@portfolio/db";
import { describe, expect, test, vi } from "vitest";
import type { Portfolio } from "~/domain/portfolio";
import { PortfolioRepositoryImpl } from "./portfolio.repository";

vi.mock("@portfolio/db", () => ({
    createPrismaClient: vi.fn(),
}));

describe("PortfolioRepositoryImpl", () => {
    const testDatabaseUrl = "mysql://user:password@localhost:3306/portfolio";

    test("should create repository instance", () => {
        const repository = new PortfolioRepositoryImpl(testDatabaseUrl);

        expect(repository).toBeDefined();
    });

    test("should implement findAll", async () => {
        const mockPortfolios: Portfolio[] = [];

        vi.mocked(createPrismaClient).mockReturnValue({
            portfolio: {
                findMany: vi.fn().mockResolvedValue([]),
            },
        } as unknown as PrismaClient);

        const repository = new PortfolioRepositoryImpl(testDatabaseUrl);
        const result = await repository.findAll();

        expect(result).toEqual(mockPortfolios);
    });

    test("should implement findBySlug", async () => {
        vi.mocked(createPrismaClient).mockReturnValue({
            portfolio: {
                findUnique: vi.fn().mockResolvedValue(null),
            },
        } as unknown as PrismaClient);

        const repository = new PortfolioRepositoryImpl(testDatabaseUrl);
        const result = await repository.findBySlug("test-slug");

        expect(result).toBeNull();
    });
});
