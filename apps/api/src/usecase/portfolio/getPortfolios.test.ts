import { describe, expect, test, vi } from "vitest";
import type { Portfolio, PortfolioRepository } from "~/domain/portfolio";
import { GetPortfoliosUseCase } from "./getPortfolios";

describe("GetPortfoliosUseCase", () => {
    test("should return all portfolios", async () => {
        const mockPortfolios: Portfolio[] = [
            {
                id: "1",
                title: "Test Portfolio",
                slug: "test-portfolio",
                company: "Test Company",
                date: new Date(),
                current: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        const mockRepository: PortfolioRepository = {
            findAll: vi.fn().mockResolvedValue(mockPortfolios),
            findBySlug: vi.fn(),
            findById: vi.fn(),
            addImage: vi.fn(),
        };

        const useCase = new GetPortfoliosUseCase(mockRepository);
        const result = await useCase.execute();

        expect(result).toEqual(mockPortfolios);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
});
