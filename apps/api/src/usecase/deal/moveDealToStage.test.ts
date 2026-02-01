import { describe, expect, test, vi } from "vitest";
import type { Deal, DealRepository } from "~/domain/deal";
import { MoveDealToStageUseCase } from "./moveDealToStage";

describe("MoveDealToStageUseCase", () => {
    const mockDeal: Deal = {
        id: "deal-1",
        name: "Test Deal",
        stageId: "stage-1",
        value: 10000,
        currency: "USD",
        status: "OPEN",
        createdAt: new Date(),
        updatedAt: new Date(),
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

    test("should move deal to new stage", async () => {
        const movedDeal: Deal = {
            ...mockDeal,
            stageId: "stage-2",
        };

        const mockRepository = createMockRepository({
            moveToStage: vi.fn().mockResolvedValue(movedDeal),
        });

        const useCase = new MoveDealToStageUseCase(mockRepository);
        const result = await useCase.execute("deal-1", "stage-2");

        expect(result.stageId).toBe("stage-2");
        expect(mockRepository.moveToStage).toHaveBeenCalledWith("deal-1", "stage-2");
    });
});
