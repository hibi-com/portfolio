import type { InquiryCategory, InquiryPriority, InquiryStatus } from "~/domain/inquiry";
import { InquiryRepositoryImpl } from "./inquiry.repository";

const mockPrismaClient = {
    inquiry: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    inquiryResponse: {
        findMany: vi.fn(),
        create: vi.fn(),
    },
};

vi.mock("@portfolio/db", () => ({
    createPrismaClient: () => mockPrismaClient,
}));

describe("InquiryRepositoryImpl", () => {
    let repository: InquiryRepositoryImpl;

    beforeEach(() => {
        vi.clearAllMocks();
        repository = new InquiryRepositoryImpl();
    });

    const mockInquiryData = {
        id: "inquiry-uuid-1",
        customerId: "customer-uuid-1",
        assigneeId: "user-uuid-1",
        subject: "Test Inquiry",
        content: "Test Content",
        status: "OPEN" as InquiryStatus,
        priority: "HIGH" as InquiryPriority,
        category: "TECHNICAL" as InquiryCategory,
        tags: '["bug", "urgent"]',
        source: "email",
        metadata: '{"key": "value"}',
        resolvedAt: null,
        closedAt: null,
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-01T00:00:00Z"),
    };

    const mockResponseData = {
        id: "response-uuid-1",
        inquiryId: "inquiry-uuid-1",
        userId: "user-uuid-1",
        content: "Response Content",
        isInternal: false,
        attachments: '["file1.pdf"]',
        createdAt: new Date("2025-01-01T01:00:00Z"),
        updatedAt: new Date("2025-01-01T01:00:00Z"),
    };

    describe("findAll", () => {
        describe("正常系", () => {
            test("全問い合わせを取得できる", async () => {
                mockPrismaClient.inquiry.findMany.mockResolvedValue([mockInquiryData]);

                const result = await repository.findAll();

                expect(result).toHaveLength(1);
                expect(result[0]?.id).toBe("inquiry-uuid-1");
                expect(result[0]?.tags).toEqual(["bug", "urgent"]);
                expect(mockPrismaClient.inquiry.findMany).toHaveBeenCalledWith({
                    orderBy: { createdAt: "desc" },
                });
            });
        });

        describe("エッジケース", () => {
            test("問い合わせが存在しない場合は空配列を返す", async () => {
                mockPrismaClient.inquiry.findMany.mockResolvedValue([]);

                const result = await repository.findAll();

                expect(result).toHaveLength(0);
            });
        });
    });

    describe("findById", () => {
        describe("正常系", () => {
            test("IDで問い合わせを取得できる", async () => {
                mockPrismaClient.inquiry.findUnique.mockResolvedValue(mockInquiryData);

                const result = await repository.findById("inquiry-uuid-1");

                expect(result).not.toBeNull();
                expect(result?.id).toBe("inquiry-uuid-1");
                expect(mockPrismaClient.inquiry.findUnique).toHaveBeenCalledWith({
                    where: { id: "inquiry-uuid-1" },
                });
            });
        });

        describe("異常系", () => {
            test("存在しないIDの場合はnullを返す", async () => {
                mockPrismaClient.inquiry.findUnique.mockResolvedValue(null);

                const result = await repository.findById("non-existent");

                expect(result).toBeNull();
            });
        });
    });

    describe("findByCustomerId", () => {
        describe("正常系", () => {
            test("顧客IDで問い合わせを取得できる", async () => {
                mockPrismaClient.inquiry.findMany.mockResolvedValue([mockInquiryData]);

                const result = await repository.findByCustomerId("customer-uuid-1");

                expect(result).toHaveLength(1);
                expect(result[0]?.customerId).toBe("customer-uuid-1");
                expect(mockPrismaClient.inquiry.findMany).toHaveBeenCalledWith({
                    where: { customerId: "customer-uuid-1" },
                    orderBy: { createdAt: "desc" },
                });
            });
        });
    });

    describe("findByAssigneeId", () => {
        describe("正常系", () => {
            test("担当者IDで問い合わせを取得できる", async () => {
                mockPrismaClient.inquiry.findMany.mockResolvedValue([mockInquiryData]);

                const result = await repository.findByAssigneeId("user-uuid-1");

                expect(result).toHaveLength(1);
                expect(result[0]?.assigneeId).toBe("user-uuid-1");
                expect(mockPrismaClient.inquiry.findMany).toHaveBeenCalledWith({
                    where: { assigneeId: "user-uuid-1" },
                    orderBy: { createdAt: "desc" },
                });
            });
        });
    });

    describe("findByStatus", () => {
        describe("正常系", () => {
            test("ステータスで問い合わせを取得できる", async () => {
                mockPrismaClient.inquiry.findMany.mockResolvedValue([mockInquiryData]);

                const result = await repository.findByStatus("OPEN");

                expect(result).toHaveLength(1);
                expect(result[0]?.status).toBe("OPEN");
                expect(mockPrismaClient.inquiry.findMany).toHaveBeenCalledWith({
                    where: { status: "OPEN" },
                    orderBy: { createdAt: "desc" },
                });
            });
        });
    });

    describe("create", () => {
        describe("正常系", () => {
            test("新しい問い合わせを作成できる", async () => {
                const createData = {
                    subject: "New Inquiry",
                    content: "New Content",
                };
                mockPrismaClient.inquiry.create.mockResolvedValue({
                    ...mockInquiryData,
                    ...createData,
                    id: "new-inquiry-uuid",
                });

                const result = await repository.create(createData);

                expect(result.id).toBe("new-inquiry-uuid");
                expect(result.subject).toBe("New Inquiry");
                expect(mockPrismaClient.inquiry.create).toHaveBeenCalledWith({
                    data: expect.objectContaining({
                        subject: "New Inquiry",
                        content: "New Content",
                        status: "OPEN",
                        priority: "MEDIUM",
                        category: "GENERAL",
                    }),
                });
            });
        });
    });

    describe("update", () => {
        describe("正常系", () => {
            test("問い合わせを更新できる", async () => {
                const updateData = { status: "IN_PROGRESS" as InquiryStatus };
                mockPrismaClient.inquiry.update.mockResolvedValue({
                    ...mockInquiryData,
                    ...updateData,
                });

                const result = await repository.update("inquiry-uuid-1", updateData);

                expect(result.status).toBe("IN_PROGRESS");
                expect(mockPrismaClient.inquiry.update).toHaveBeenCalledWith({
                    where: { id: "inquiry-uuid-1" },
                    data: expect.objectContaining({
                        status: "IN_PROGRESS",
                    }),
                });
            });
        });
    });

    describe("delete", () => {
        describe("正常系", () => {
            test("問い合わせを削除できる", async () => {
                mockPrismaClient.inquiry.delete.mockResolvedValue(mockInquiryData);

                await repository.delete("inquiry-uuid-1");

                expect(mockPrismaClient.inquiry.delete).toHaveBeenCalledWith({
                    where: { id: "inquiry-uuid-1" },
                });
            });
        });
    });

    describe("resolve", () => {
        describe("正常系", () => {
            test("問い合わせを解決済みにできる", async () => {
                mockPrismaClient.inquiry.update.mockResolvedValue({
                    ...mockInquiryData,
                    status: "RESOLVED",
                    resolvedAt: new Date("2025-01-02T00:00:00Z"),
                });

                const result = await repository.resolve("inquiry-uuid-1");

                expect(result.status).toBe("RESOLVED");
                expect(result.resolvedAt).toBeDefined();
                expect(mockPrismaClient.inquiry.update).toHaveBeenCalledWith({
                    where: { id: "inquiry-uuid-1" },
                    data: {
                        status: "RESOLVED",
                        resolvedAt: expect.any(Date),
                    },
                });
            });
        });
    });

    describe("close", () => {
        describe("正常系", () => {
            test("問い合わせをクローズできる", async () => {
                mockPrismaClient.inquiry.update.mockResolvedValue({
                    ...mockInquiryData,
                    status: "CLOSED",
                    closedAt: new Date("2025-01-02T00:00:00Z"),
                });

                const result = await repository.close("inquiry-uuid-1");

                expect(result.status).toBe("CLOSED");
                expect(result.closedAt).toBeDefined();
                expect(mockPrismaClient.inquiry.update).toHaveBeenCalledWith({
                    where: { id: "inquiry-uuid-1" },
                    data: {
                        status: "CLOSED",
                        closedAt: expect.any(Date),
                    },
                });
            });
        });
    });

    describe("addResponse", () => {
        describe("正常系", () => {
            test("問い合わせへの返信を追加できる", async () => {
                const responseData = {
                    inquiryId: "inquiry-uuid-1",
                    content: "Thank you for your inquiry",
                };
                mockPrismaClient.inquiryResponse.create.mockResolvedValue(mockResponseData);

                const result = await repository.addResponse(responseData);

                expect(result.id).toBe("response-uuid-1");
                expect(result.content).toBe("Response Content");
                expect(mockPrismaClient.inquiryResponse.create).toHaveBeenCalledWith({
                    data: expect.objectContaining({
                        inquiryId: "inquiry-uuid-1",
                        content: "Thank you for your inquiry",
                        isInternal: false,
                    }),
                });
            });
        });
    });

    describe("getResponses", () => {
        describe("正常系", () => {
            test("問い合わせへの返信一覧を取得できる", async () => {
                mockPrismaClient.inquiryResponse.findMany.mockResolvedValue([mockResponseData]);

                const result = await repository.getResponses("inquiry-uuid-1");

                expect(result).toHaveLength(1);
                expect(result[0]?.id).toBe("response-uuid-1");
                expect(result[0]?.attachments).toEqual(["file1.pdf"]);
                expect(mockPrismaClient.inquiryResponse.findMany).toHaveBeenCalledWith({
                    where: { inquiryId: "inquiry-uuid-1" },
                    orderBy: { createdAt: "asc" },
                });
            });
        });
    });
});
