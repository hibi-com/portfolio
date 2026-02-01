import { describe, expect, test, vi } from "vitest";
import type { Lead, LeadRepository } from "~/domain/lead";
import { GetLeadsUseCase } from "./getLeads";

describe("GetLeadsUseCase", () => {
    const mockLead: Lead = {
        id: "lead-1",
        name: "Test Lead",
        email: "lead@example.com",
        company: "Lead Company",
        source: "Website",
        status: "NEW",
        score: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
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

    test("should return all leads", async () => {
        const leads: Lead[] = [
            mockLead,
            { ...mockLead, id: "lead-2", name: "Lead 2", status: "CONTACTED" },
        ];
        const mockRepository = createMockRepository({
            findAll: vi.fn().mockResolvedValue(leads),
        });

        const useCase = new GetLeadsUseCase(mockRepository);
        const result = await useCase.execute();

        expect(result).toEqual(leads);
        expect(result).toHaveLength(2);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    test("should return empty array when no leads", async () => {
        const mockRepository = createMockRepository();

        const useCase = new GetLeadsUseCase(mockRepository);
        const result = await useCase.execute();

        expect(result).toEqual([]);
    });
});
