import type { CreateLeadInput, Lead, LeadRepository } from "~/domain/lead";
import { CreateLeadUseCase } from "./createLead";

describe("CreateLeadUseCase", () => {
    const mockLead: Lead = {
        id: "lead-1",
        name: "Test Lead",
        email: "lead@example.com",
        company: "Lead Company",
        source: "Website",
        status: "NEW",
        score: 50,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
    };

    const createMockRepository = (overrides: Partial<LeadRepository> = {}): LeadRepository => ({
        findAll: vi.fn().mockResolvedValue([]),
        findById: vi.fn().mockResolvedValue(null),
        findByCustomerId: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue(mockLead),
        update: vi.fn().mockResolvedValue(mockLead),
        delete: vi.fn().mockResolvedValue(undefined),
        convertToDeal: vi.fn().mockResolvedValue(mockLead),
        ...overrides,
    });

    test("should create a new lead", async () => {
        const input: CreateLeadInput = {
            name: "Test Lead",
            email: "lead@example.com",
            company: "Lead Company",
            source: "Website",
        };

        const mockRepository = createMockRepository({
            create: vi.fn().mockResolvedValue(mockLead),
        });

        const useCase = new CreateLeadUseCase(mockRepository);
        const result = await useCase.execute(input);

        expect(result).toEqual(mockLead);
        expect(mockRepository.create).toHaveBeenCalledWith(input);
    });

    test("should create lead with score", async () => {
        const input: CreateLeadInput = {
            name: "Scored Lead",
            score: 80,
        };

        const scoredLead: Lead = {
            ...mockLead,
            name: "Scored Lead",
            score: 80,
        };

        const mockRepository = createMockRepository({
            create: vi.fn().mockResolvedValue(scoredLead),
        });

        const useCase = new CreateLeadUseCase(mockRepository);
        const result = await useCase.execute(input);

        expect(result.score).toBe(80);
    });
});
