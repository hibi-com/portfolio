import type { CreateInquiryResponseInput, Inquiry, InquiryRepository, InquiryResponse } from "~/domain/inquiry";
import { AddInquiryResponseUseCase } from "./addInquiryResponse";

describe("AddInquiryResponseUseCase", () => {
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

    test("should add response to inquiry", async () => {
        const input: CreateInquiryResponseInput = {
            inquiryId: "inquiry-1",
            content: "Thank you for your inquiry",
        };

        const mockRepository = createMockRepository({
            addResponse: vi.fn().mockResolvedValue(mockResponse),
        });

        const useCase = new AddInquiryResponseUseCase(mockRepository);
        const result = await useCase.execute(input);

        expect(result).toEqual(mockResponse);
        expect(mockRepository.addResponse).toHaveBeenCalledWith(input);
    });

    test("should add internal response", async () => {
        const input: CreateInquiryResponseInput = {
            inquiryId: "inquiry-1",
            userId: "user-1",
            content: "Internal note: needs follow-up",
            isInternal: true,
        };

        const internalResponse: InquiryResponse = {
            ...mockResponse,
            userId: "user-1",
            content: "Internal note: needs follow-up",
            isInternal: true,
        };

        const mockRepository = createMockRepository({
            addResponse: vi.fn().mockResolvedValue(internalResponse),
        });

        const useCase = new AddInquiryResponseUseCase(mockRepository);
        const result = await useCase.execute(input);

        expect(result.isInternal).toBe(true);
        expect(result.userId).toBe("user-1");
    });
});
