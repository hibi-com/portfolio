import { describe, expect, test, vi } from "vitest";
import type { Lead, LeadRepository } from "~/domain/lead";
import { ConvertLeadToDealUseCase } from "./convertLeadToDeal";

describe("ConvertLeadToDealUseCase", () => {
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

    test("should convert lead to deal", async () => {
        const convertedLead: Lead = {
            ...mockLead,
            status: "CONVERTED",
            convertedAt: new Date(),
        };

        const mockRepository = createMockRepository({
            convertToDeal: vi.fn().mockResolvedValue(convertedLead),
        });

        const useCase = new ConvertLeadToDealUseCase(mockRepository);
        const result = await useCase.execute("lead-1");

        expect(result.status).toBe("CONVERTED");
        expect(result.convertedAt).toBeDefined();
        expect(mockRepository.convertToDeal).toHaveBeenCalledWith("lead-1");
    });
});
