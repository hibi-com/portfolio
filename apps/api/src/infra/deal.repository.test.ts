import { Prisma } from "@portfolio/db";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { DealStatus } from "~/domain/deal";
import { DealRepositoryImpl } from "./deal.repository";

const mockPrismaClient = {
    deal: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
};

vi.mock("@portfolio/db", () => ({
    createPrismaClient: () => mockPrismaClient,
    Prisma: {
        Decimal: class Decimal {
            constructor(public value: string | number) {}
            toString() {
                return String(this.value);
            }
        },
    },
}));

describe("DealRepositoryImpl", () => {
    let repository: DealRepositoryImpl;

    beforeEach(() => {
        vi.clearAllMocks();
        repository = new DealRepositoryImpl();
    });

    const mockDealData = {
        id: "deal-uuid-1",
        customerId: "customer-uuid-1",
        leadId: "lead-uuid-1",
        stageId: "stage-uuid-1",
        name: "Test Deal",
        value: new Prisma.Decimal(100000),
        currency: "JPY",
        expectedCloseDate: new Date("2025-12-31T00:00:00Z"),
        actualCloseDate: null,
        status: "OPEN" as DealStatus,
        notes: "Test notes",
        lostReason: null,
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-01T00:00:00Z"),
    };

    describe("findAll", () => {
        describe("正常系", () => {
            test("全ディールを取得できる", async () => {
                mockPrismaClient.deal.findMany.mockResolvedValue([mockDealData]);

                const result = await repository.findAll();

                expect(result).toHaveLength(1);
                expect(result[0]?.id).toBe("deal-uuid-1");
                expect(result[0]?.value).toBe(100000);
            });
        });
    });

    describe("findById", () => {
        describe("正常系", () => {
            test("IDでディールを取得できる", async () => {
                mockPrismaClient.deal.findUnique.mockResolvedValue(mockDealData);

                const result = await repository.findById("deal-uuid-1");

                expect(result).not.toBeNull();
                expect(result?.id).toBe("deal-uuid-1");
            });
        });

        describe("異常系", () => {
            test("存在しないIDの場合はnullを返す", async () => {
                mockPrismaClient.deal.findUnique.mockResolvedValue(null);

                const result = await repository.findById("non-existent");

                expect(result).toBeNull();
            });
        });
    });

    describe("findByCustomerId", () => {
        describe("正常系", () => {
            test("顧客IDでディールを取得できる", async () => {
                mockPrismaClient.deal.findMany.mockResolvedValue([mockDealData]);

                const result = await repository.findByCustomerId("customer-uuid-1");

                expect(result).toHaveLength(1);
                expect(result[0]?.customerId).toBe("customer-uuid-1");
            });
        });
    });

    describe("findByStageId", () => {
        describe("正常系", () => {
            test("ステージIDでディールを取得できる", async () => {
                mockPrismaClient.deal.findMany.mockResolvedValue([mockDealData]);

                const result = await repository.findByStageId("stage-uuid-1");

                expect(result).toHaveLength(1);
                expect(result[0]?.stageId).toBe("stage-uuid-1");
            });
        });
    });

    describe("create", () => {
        describe("正常系", () => {
            test("新しいディールを作成できる", async () => {
                const createData = {
                    name: "New Deal",
                    stageId: "stage-uuid-1",
                    value: 200000,
                };
                mockPrismaClient.deal.create.mockResolvedValue({
                    ...mockDealData,
                    ...createData,
                    id: "new-deal-uuid",
                    value: new Prisma.Decimal(200000),
                });

                const result = await repository.create(createData);

                expect(result.id).toBe("new-deal-uuid");
                expect(result.name).toBe("New Deal");
                expect(result.value).toBe(200000);
            });
        });
    });

    describe("update", () => {
        describe("正常系", () => {
            test("ディールを更新できる", async () => {
                const updateData = { name: "Updated Deal", value: 150000 };
                mockPrismaClient.deal.update.mockResolvedValue({
                    ...mockDealData,
                    ...updateData,
                    value: new Prisma.Decimal(150000),
                });

                const result = await repository.update("deal-uuid-1", updateData);

                expect(result.name).toBe("Updated Deal");
                expect(result.value).toBe(150000);
            });
        });
    });

    describe("delete", () => {
        describe("正常系", () => {
            test("ディールを削除できる", async () => {
                mockPrismaClient.deal.delete.mockResolvedValue(mockDealData);

                await repository.delete("deal-uuid-1");

                expect(mockPrismaClient.deal.delete).toHaveBeenCalledWith({
                    where: { id: "deal-uuid-1" },
                });
            });
        });
    });

    describe("moveToStage", () => {
        describe("正常系", () => {
            test("ディールを別のステージに移動できる", async () => {
                mockPrismaClient.deal.update.mockResolvedValue({
                    ...mockDealData,
                    stageId: "stage-uuid-2",
                });

                const result = await repository.moveToStage("deal-uuid-1", "stage-uuid-2");

                expect(result.stageId).toBe("stage-uuid-2");
                expect(mockPrismaClient.deal.update).toHaveBeenCalledWith({
                    where: { id: "deal-uuid-1" },
                    data: { stageId: "stage-uuid-2" },
                });
            });
        });
    });

    describe("markAsWon", () => {
        describe("正常系", () => {
            test("ディールを成約済みにできる", async () => {
                mockPrismaClient.deal.update.mockResolvedValue({
                    ...mockDealData,
                    status: "WON",
                    actualCloseDate: new Date("2025-01-15T00:00:00Z"),
                });

                const result = await repository.markAsWon("deal-uuid-1");

                expect(result.status).toBe("WON");
                expect(result.actualCloseDate).toBeDefined();
                expect(mockPrismaClient.deal.update).toHaveBeenCalledWith({
                    where: { id: "deal-uuid-1" },
                    data: {
                        status: "WON",
                        actualCloseDate: expect.any(Date),
                    },
                });
            });
        });
    });

    describe("markAsLost", () => {
        describe("正常系", () => {
            test("ディールを失注にできる", async () => {
                mockPrismaClient.deal.update.mockResolvedValue({
                    ...mockDealData,
                    status: "LOST",
                    actualCloseDate: new Date("2025-01-15T00:00:00Z"),
                    lostReason: "Budget constraints",
                });

                const result = await repository.markAsLost("deal-uuid-1", "Budget constraints");

                expect(result.status).toBe("LOST");
                expect(result.lostReason).toBe("Budget constraints");
                expect(result.actualCloseDate).toBeDefined();
                expect(mockPrismaClient.deal.update).toHaveBeenCalledWith({
                    where: { id: "deal-uuid-1" },
                    data: {
                        status: "LOST",
                        actualCloseDate: expect.any(Date),
                        lostReason: "Budget constraints",
                    },
                });
            });
        });
    });
});
