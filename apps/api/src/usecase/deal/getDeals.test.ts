import { describe, expect, test, vi } from "vitest";
import type { Deal, DealRepository } from "~/domain/deal";
import { GetDealsUseCase } from "./getDeals";

describe("GetDealsUseCase", () => {
    const mockDeal: Deal = {
        id: "deal-1",
        name: "Test Deal",
        stageId: "stage-1",
        value: 10000,
        currency: "USD",
        status: "OPEN",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
    };

    const createMockRepository = (overrides: Partial<DealRepository> = {}): DealRepository => ({
        findAll: vi.fn().mockResolvedValue([]),
        findById: vi.fn().mockResolvedValue(null),
        findByCustomerId: vi.fn().mockResolvedValue([]),
        findByStageId: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue(mockDeal),
        update: vi.fn().mockResolvedValue(mockDeal),
        delete: vi.fn().mockResolvedValue(undefined),
        moveToStage: vi.fn().mockResolvedValue(mockDeal),
        markAsWon: vi.fn().mockResolvedValue(mockDeal),
        markAsLost: vi.fn().mockResolvedValue(mockDeal),
        ...overrides,
    });

    test("should return all deals", async () => {
        const deals: Deal[] = [mockDeal, { ...mockDeal, id: "deal-2", name: "Deal 2", value: 20000 }];
        const mockRepository = createMockRepository({
            findAll: vi.fn().mockResolvedValue(deals),
        });

        const useCase = new GetDealsUseCase(mockRepository);
        const result = await useCase.execute();

        expect(result).toEqual(deals);
        expect(result).toHaveLength(2);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
});
