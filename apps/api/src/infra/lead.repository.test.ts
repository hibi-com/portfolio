import { beforeEach, describe, expect, test, vi } from "vitest";
import type { LeadStatus } from "~/domain/lead";
import { LeadRepositoryImpl } from "./lead.repository";

const mockPrismaClient = {
    lead: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
};

vi.mock("@portfolio/db", () => ({
    createPrismaClient: () => mockPrismaClient,
}));

describe("LeadRepositoryImpl", () => {
    let repository: LeadRepositoryImpl;

    beforeEach(() => {
        vi.clearAllMocks();
        repository = new LeadRepositoryImpl();
    });

    const mockLeadData = {
        id: "lead-uuid-1",
        customerId: "customer-uuid-1",
        name: "Test Lead",
        email: "lead@example.com",
        phone: "03-1234-5678",
        company: "Test Company",
        source: "website",
        status: "NEW" as LeadStatus,
        score: 80,
        notes: "Test notes",
        convertedAt: null,
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-01T00:00:00Z"),
    };

    describe("findAll", () => {
        describe("正常系", () => {
            test("全リードを取得できる", async () => {
                mockPrismaClient.lead.findMany.mockResolvedValue([mockLeadData]);

                const result = await repository.findAll();

                expect(result).toHaveLength(1);
                expect(result[0]?.id).toBe("lead-uuid-1");
                expect(result[0]?.name).toBe("Test Lead");
                expect(mockPrismaClient.lead.findMany).toHaveBeenCalledWith({
                    orderBy: { createdAt: "desc" },
                });
            });
        });

        describe("エッジケース", () => {
            test("リードが存在しない場合は空配列を返す", async () => {
                mockPrismaClient.lead.findMany.mockResolvedValue([]);

                const result = await repository.findAll();

                expect(result).toHaveLength(0);
            });
        });
    });

    describe("findById", () => {
        describe("正常系", () => {
            test("IDでリードを取得できる", async () => {
                mockPrismaClient.lead.findUnique.mockResolvedValue(mockLeadData);

                const result = await repository.findById("lead-uuid-1");

                expect(result).not.toBeNull();
                expect(result?.id).toBe("lead-uuid-1");
                expect(mockPrismaClient.lead.findUnique).toHaveBeenCalledWith({
                    where: { id: "lead-uuid-1" },
                });
            });
        });

        describe("異常系", () => {
            test("存在しないIDの場合はnullを返す", async () => {
                mockPrismaClient.lead.findUnique.mockResolvedValue(null);

                const result = await repository.findById("non-existent");

                expect(result).toBeNull();
            });
        });
    });

    describe("findByCustomerId", () => {
        describe("正常系", () => {
            test("顧客IDでリードを取得できる", async () => {
                mockPrismaClient.lead.findMany.mockResolvedValue([mockLeadData]);

                const result = await repository.findByCustomerId("customer-uuid-1");

                expect(result).toHaveLength(1);
                expect(result[0]?.customerId).toBe("customer-uuid-1");
                expect(mockPrismaClient.lead.findMany).toHaveBeenCalledWith({
                    where: { customerId: "customer-uuid-1" },
                    orderBy: { createdAt: "desc" },
                });
            });
        });
    });

    describe("create", () => {
        describe("正常系", () => {
            test("新しいリードを作成できる", async () => {
                const createData = {
                    name: "New Lead",
                    email: "new@example.com",
                    company: "New Company",
                };
                mockPrismaClient.lead.create.mockResolvedValue({
                    ...mockLeadData,
                    ...createData,
                    id: "new-lead-uuid",
                    phone: null,
                    customerId: null,
                    source: null,
                    score: null,
                    notes: null,
                });

                const result = await repository.create(createData);

                expect(result.id).toBe("new-lead-uuid");
                expect(result.name).toBe("New Lead");
                expect(mockPrismaClient.lead.create).toHaveBeenCalledWith({
                    data: expect.objectContaining({
                        name: "New Lead",
                        email: "new@example.com",
                        company: "New Company",
                        status: "NEW",
                    }),
                });
            });

            test("スコアとステータスを指定して作成できる", async () => {
                const createData = {
                    name: "Qualified Lead",
                    email: "qualified@example.com",
                    status: "QUALIFIED" as LeadStatus,
                    score: 90,
                };
                mockPrismaClient.lead.create.mockResolvedValue({
                    ...mockLeadData,
                    ...createData,
                    id: "qualified-lead-uuid",
                });

                const result = await repository.create(createData);

                expect(result.status).toBe("QUALIFIED");
                expect(result.score).toBe(90);
            });
        });
    });

    describe("update", () => {
        describe("正常系", () => {
            test("リードを更新できる", async () => {
                const updateData = { status: "QUALIFIED" as LeadStatus, score: 90 };
                mockPrismaClient.lead.update.mockResolvedValue({
                    ...mockLeadData,
                    ...updateData,
                });

                const result = await repository.update("lead-uuid-1", updateData);

                expect(result.status).toBe("QUALIFIED");
                expect(result.score).toBe(90);
                expect(mockPrismaClient.lead.update).toHaveBeenCalledWith({
                    where: { id: "lead-uuid-1" },
                    data: expect.objectContaining({
                        status: "QUALIFIED",
                        score: 90,
                    }),
                });
            });
        });
    });

    describe("delete", () => {
        describe("正常系", () => {
            test("リードを削除できる", async () => {
                mockPrismaClient.lead.delete.mockResolvedValue(mockLeadData);

                await repository.delete("lead-uuid-1");

                expect(mockPrismaClient.lead.delete).toHaveBeenCalledWith({
                    where: { id: "lead-uuid-1" },
                });
            });
        });
    });

    describe("convertToDeal", () => {
        describe("正常系", () => {
            test("リードをディールに変換できる", async () => {
                mockPrismaClient.lead.update.mockResolvedValue({
                    ...mockLeadData,
                    status: "CONVERTED",
                    convertedAt: new Date("2025-01-02T00:00:00Z"),
                });

                const result = await repository.convertToDeal("lead-uuid-1");

                expect(result.status).toBe("CONVERTED");
                expect(result.convertedAt).toBeDefined();
                expect(mockPrismaClient.lead.update).toHaveBeenCalledWith({
                    where: { id: "lead-uuid-1" },
                    data: {
                        status: "CONVERTED",
                        convertedAt: expect.any(Date),
                    },
                });
            });
        });
    });
});
