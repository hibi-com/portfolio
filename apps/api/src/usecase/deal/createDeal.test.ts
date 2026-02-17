import type { CreateDealInput, Deal, DealRepository } from "~/domain/deal";
import { CreateDealUseCase } from "./createDeal";

describe("CreateDealUseCase", () => {
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

    test("should create a new deal", async () => {
        const input: CreateDealInput = {
            name: "Test Deal",
            stageId: "stage-1",
            value: 10000,
            currency: "USD",
        };

        const mockRepository = createMockRepository({
            create: vi.fn().mockResolvedValue(mockDeal),
        });

        const useCase = new CreateDealUseCase(mockRepository);
        const result = await useCase.execute(input);

        expect(result).toEqual(mockDeal);
        expect(mockRepository.create).toHaveBeenCalledWith(input);
    });

    test("should create deal with customer and lead references", async () => {
        const input: CreateDealInput = {
            name: "Converted Deal",
            stageId: "stage-1",
            customerId: "customer-1",
            leadId: "lead-1",
            value: 50000,
        };

        const linkedDeal: Deal = {
            ...mockDeal,
            customerId: "customer-1",
            leadId: "lead-1",
            value: 50000,
        };

        const mockRepository = createMockRepository({
            create: vi.fn().mockResolvedValue(linkedDeal),
        });

        const useCase = new CreateDealUseCase(mockRepository);
        const result = await useCase.execute(input);

        expect(result.customerId).toBe("customer-1");
        expect(result.leadId).toBe("lead-1");
    });
});
