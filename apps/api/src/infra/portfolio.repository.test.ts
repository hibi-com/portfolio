import type { PrismaClient } from "@portfolio/db";
import { createPrismaClient } from "@portfolio/db";
import type { Portfolio } from "~/domain/portfolio";
import { PortfolioRepositoryImpl } from "./portfolio.repository";

vi.mock("@portfolio/db", () => ({
    createPrismaClient: vi.fn(),
}));

describe("PortfolioRepositoryImpl", () => {
    const prismaOptions = { databaseUrl: "http://127.0.0.1:8081" };

    test("should create repository instance", () => {
        const repository = new PortfolioRepositoryImpl(prismaOptions);

        expect(repository).toBeDefined();
    });

    test("should implement findAll", async () => {
        const mockPortfolios: Portfolio[] = [];

        vi.mocked(createPrismaClient).mockReturnValue({
            portfolio: {
                findMany: vi.fn().mockResolvedValue([]),
            },
        } as unknown as PrismaClient);

        const repository = new PortfolioRepositoryImpl(prismaOptions);
        const result = await repository.findAll();

        expect(result).toEqual(mockPortfolios);
    });

    test("should implement findBySlug", async () => {
        vi.mocked(createPrismaClient).mockReturnValue({
            portfolio: {
                findUnique: vi.fn().mockResolvedValue(null),
            },
        } as unknown as PrismaClient);

        const repository = new PortfolioRepositoryImpl(prismaOptions);
        const result = await repository.findBySlug("test-slug");

        expect(result).toBeNull();
    });
});
