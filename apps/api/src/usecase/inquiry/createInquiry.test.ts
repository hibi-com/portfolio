import { describe, expect, test, vi } from "vitest";
import type { CreateInquiryInput, Inquiry, InquiryRepository, InquiryResponse } from "~/domain/inquiry";
import { CreateInquiryUseCase } from "./createInquiry";

describe("CreateInquiryUseCase", () => {
    const mockInquiry: Inquiry = {
        id: "inquiry-1",
        subject: "Test Inquiry",
        content: "Test content",
        status: "OPEN",
        priority: "MEDIUM",
        category: "GENERAL",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
    };

    const mockResponse: InquiryResponse = {
        id: "response-1",
        inquiryId: "inquiry-1",
        content: "Test response",
        isInternal: false,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
    };

    const createMockRepository = (overrides: Partial<InquiryRepository> = {}): InquiryRepository => ({
        findAll: vi.fn().mockResolvedValue([]),
        findById: vi.fn().mockResolvedValue(null),
        findByCustomerId: vi.fn().mockResolvedValue([]),
        findByAssigneeId: vi.fn().mockResolvedValue([]),
        findByStatus: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue(mockInquiry),
        update: vi.fn().mockResolvedValue(mockInquiry),
        delete: vi.fn().mockResolvedValue(undefined),
        resolve: vi.fn().mockResolvedValue(mockInquiry),
        close: vi.fn().mockResolvedValue(mockInquiry),
        addResponse: vi.fn().mockResolvedValue(mockResponse),
        getResponses: vi.fn().mockResolvedValue([]),
        ...overrides,
    });

    test("should create a new inquiry", async () => {
        const input: CreateInquiryInput = {
            subject: "Test Inquiry",
            content: "Test content",
        };

        const mockRepository = createMockRepository({
            create: vi.fn().mockResolvedValue(mockInquiry),
        });

        const useCase = new CreateInquiryUseCase(mockRepository);
        const result = await useCase.execute(input);

        expect(result).toEqual(mockInquiry);
        expect(mockRepository.create).toHaveBeenCalledWith(input);
    });

    test("should create inquiry with customer and assignee", async () => {
        const input: CreateInquiryInput = {
            subject: "Customer Inquiry",
            content: "Need help with product",
            customerId: "customer-1",
            assigneeId: "user-1",
            priority: "HIGH",
            category: "TECHNICAL",
        };

        const linkedInquiry: Inquiry = {
            ...mockInquiry,
            customerId: "customer-1",
            assigneeId: "user-1",
            priority: "HIGH",
            category: "TECHNICAL",
        };

        const mockRepository = createMockRepository({
            create: vi.fn().mockResolvedValue(linkedInquiry),
        });

        const useCase = new CreateInquiryUseCase(mockRepository);
        const result = await useCase.execute(input);

        expect(result.customerId).toBe("customer-1");
        expect(result.assigneeId).toBe("user-1");
        expect(result.priority).toBe("HIGH");
        expect(result.category).toBe("TECHNICAL");
    });
});
