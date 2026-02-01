import { describe, expect, test, vi } from "vitest";
import type { Portfolio, PortfolioRepository } from "~/domain/portfolio";
import { GetPortfolioBySlugUseCase } from "./getPortfolioBySlug";

describe("GetPortfolioBySlugUseCase", () => {
    test("should return portfolio by slug", async () => {
        const mockPortfolio: Portfolio = {
            id: "1",
            title: "Test Portfolio",
            slug: "test-portfolio",
            company: "Test Company",
            date: new Date(),
            current: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockRepository: PortfolioRepository = {
            findAll: vi.fn(),
            findBySlug: vi.fn().mockResolvedValue(mockPortfolio),
            findById: vi.fn(),
            addImage: vi.fn(),
        };

        const useCase = new GetPortfolioBySlugUseCase(mockRepository);
        const result = await useCase.execute("test-portfolio");

        expect(result).toEqual(mockPortfolio);
        expect(mockRepository.findBySlug).toHaveBeenCalledWith("test-portfolio");
    });

    test("should return null when portfolio not found", async () => {
        const mockRepository: PortfolioRepository = {
            findAll: vi.fn(),
            findBySlug: vi.fn().mockResolvedValue(null),
            findById: vi.fn(),
            addImage: vi.fn(),
        };

        const useCase = new GetPortfolioBySlugUseCase(mockRepository);
        const result = await useCase.execute("non-existent");

        expect(result).toBeNull();
    });
});
