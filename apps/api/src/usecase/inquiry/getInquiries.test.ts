import type { Inquiry, InquiryRepository, InquiryResponse } from "~/domain/inquiry";
import { GetInquiriesUseCase } from "./getInquiries";

describe("GetInquiriesUseCase", () => {
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

    test("should return all inquiries", async () => {
        const inquiries: Inquiry[] = [mockInquiry, { ...mockInquiry, id: "inquiry-2", subject: "Inquiry 2" }];
        const mockRepository = createMockRepository({
            findAll: vi.fn().mockResolvedValue(inquiries),
        });

        const useCase = new GetInquiriesUseCase(mockRepository);
        const result = await useCase.execute();

        expect(result).toEqual(inquiries);
        expect(result).toHaveLength(2);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
});
