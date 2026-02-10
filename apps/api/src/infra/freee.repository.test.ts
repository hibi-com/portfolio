import { beforeEach, describe, expect, test, vi } from "vitest";
import type { SyncDirection, SyncStatus } from "~/domain/freee";
import { FreeeRepositoryImpl } from "./freee.repository";

const mockPrismaClient = {
    freeeIntegration: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    freeeSyncLog: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
    },
    customerFreeeMapping: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
    dealFreeeMapping: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
};

vi.mock("@portfolio/db", () => ({
    createPrismaClient: () => mockPrismaClient,
}));

describe("FreeeRepositoryImpl", () => {
    let repository: FreeeRepositoryImpl;

    beforeEach(() => {
        vi.clearAllMocks();
        repository = new FreeeRepositoryImpl();
    });

    const mockIntegrationData = {
        id: "integration-uuid-1",
        userId: "user-uuid-1",
        companyId: 123456,
        companyName: "Test Company",
        accessToken: "access-token-1",
        refreshToken: "refresh-token-1",
        tokenExpiresAt: new Date("2025-12-31T00:00:00Z"),
        scopes: '["read", "write"]',
        isActive: true,
        lastSyncAt: new Date("2025-01-01T00:00:00Z"),
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-01T00:00:00Z"),
    };

    const mockSyncLogData = {
        id: "log-uuid-1",
        integrationId: "integration-uuid-1",
        direction: "IMPORT" as SyncDirection,
        status: "COMPLETED" as SyncStatus,
        entityType: "partner",
        totalRecords: 10,
        successCount: 9,
        errorCount: 1,
        errorDetails: '[{"record": "partner:123", "error": "Duplicate email"}]',
        startedAt: new Date("2025-01-01T10:00:00Z"),
        completedAt: new Date("2025-01-01T10:05:00Z"),
        createdAt: new Date("2025-01-01T10:00:00Z"),
        updatedAt: new Date("2025-01-01T10:05:00Z"),
    };

    const mockCustomerMappingData = {
        id: "mapping-uuid-1",
        customerId: "customer-uuid-1",
        freeePartnerId: 12345,
        freeeCompanyId: 123456,
        lastSyncAt: new Date("2025-01-01T00:00:00Z"),
        syncHash: "hash123",
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-01T00:00:00Z"),
    };

    describe("findIntegrationById", () => {
        describe("正常系", () => {
            test("IDで連携情報を取得できる", async () => {
                mockPrismaClient.freeeIntegration.findUnique.mockResolvedValue(mockIntegrationData);

                const result = await repository.findIntegrationById("integration-uuid-1");

                expect(result).not.toBeNull();
                expect(result?.id).toBe("integration-uuid-1");
                expect(result?.scopes).toEqual(["read", "write"]);
            });
        });

        describe("異常系", () => {
            test("存在しないIDの場合はnullを返す", async () => {
                mockPrismaClient.freeeIntegration.findUnique.mockResolvedValue(null);

                const result = await repository.findIntegrationById("non-existent");

                expect(result).toBeNull();
            });
        });
    });

    describe("findIntegrationByUserId", () => {
        describe("正常系", () => {
            test("ユーザーIDでアクティブな連携情報を取得できる", async () => {
                mockPrismaClient.freeeIntegration.findFirst.mockResolvedValue(mockIntegrationData);

                const result = await repository.findIntegrationByUserId("user-uuid-1");

                expect(result).not.toBeNull();
                expect(result?.userId).toBe("user-uuid-1");
            });
        });
    });

    describe("createIntegration", () => {
        describe("正常系", () => {
            test("新しい連携情報を作成できる", async () => {
                const createData = {
                    userId: "user-uuid-1",
                    companyId: 123456,
                    companyName: "Test Company",
                    accessToken: "access-token-1",
                    refreshToken: "refresh-token-1",
                    tokenExpiresAt: "2025-12-31T00:00:00.000Z",
                };
                mockPrismaClient.freeeIntegration.create.mockResolvedValue({
                    ...mockIntegrationData,
                    ...createData,
                    tokenExpiresAt: new Date(createData.tokenExpiresAt),
                    id: "new-integration-uuid",
                });

                const result = await repository.createIntegration(createData);

                expect(result.id).toBe("new-integration-uuid");
                expect(result.companyId).toBe(123456);
            });
        });
    });

    describe("updateTokens", () => {
        describe("正常系", () => {
            test("トークンを更新できる", async () => {
                const updateData = {
                    accessToken: "new-access-token",
                    refreshToken: "new-refresh-token",
                    tokenExpiresAt: "2026-01-01T00:00:00.000Z",
                };
                mockPrismaClient.freeeIntegration.update.mockResolvedValue({
                    ...mockIntegrationData,
                    ...updateData,
                    tokenExpiresAt: new Date(updateData.tokenExpiresAt),
                });

                const result = await repository.updateTokens("integration-uuid-1", updateData);

                expect(result.accessToken).toBe("new-access-token");
                expect(result.refreshToken).toBe("new-refresh-token");
            });
        });
    });

    describe("updateLastSyncAt", () => {
        describe("正常系", () => {
            test("最終同期日時を更新できる", async () => {
                mockPrismaClient.freeeIntegration.update.mockResolvedValue({
                    ...mockIntegrationData,
                    lastSyncAt: new Date("2025-01-02T00:00:00Z"),
                });

                const result = await repository.updateLastSyncAt("integration-uuid-1");

                expect(result.lastSyncAt).toBeDefined();
            });
        });
    });

    describe("deactivateIntegration", () => {
        describe("正常系", () => {
            test("連携情報を無効化できる", async () => {
                mockPrismaClient.freeeIntegration.update.mockResolvedValue({
                    ...mockIntegrationData,
                    isActive: false,
                });

                const result = await repository.deactivateIntegration("integration-uuid-1");

                expect(result.isActive).toBe(false);
            });
        });
    });

    describe("createSyncLog", () => {
        describe("正常系", () => {
            test("同期ログを作成できる", async () => {
                const createData = {
                    integrationId: "integration-uuid-1",
                    direction: "IMPORT" as SyncDirection,
                    entityType: "partner",
                };
                mockPrismaClient.freeeSyncLog.create.mockResolvedValue({
                    ...mockSyncLogData,
                    ...createData,
                    id: "new-log-uuid",
                });

                const result = await repository.createSyncLog(createData);

                expect(result.id).toBe("new-log-uuid");
                expect(result.direction).toBe("IMPORT");
            });
        });
    });

    describe("updateSyncLog", () => {
        describe("正常系", () => {
            test("同期ログを更新できる", async () => {
                const updateData = {
                    status: "COMPLETED" as SyncStatus,
                    totalRecords: 10,
                    successCount: 9,
                    errorCount: 1,
                };
                mockPrismaClient.freeeSyncLog.update.mockResolvedValue({
                    ...mockSyncLogData,
                    ...updateData,
                });

                const result = await repository.updateSyncLog("log-uuid-1", updateData);

                expect(result.status).toBe("COMPLETED");
                expect(result.successCount).toBe(9);
                expect(result.errorCount).toBe(1);
            });
        });
    });

    describe("findCustomerMappingByCustomerId", () => {
        describe("正常系", () => {
            test("顧客IDでマッピングを取得できる", async () => {
                mockPrismaClient.customerFreeeMapping.findUnique.mockResolvedValue(mockCustomerMappingData);

                const result = await repository.findCustomerMappingByCustomerId("customer-uuid-1", 123456);

                expect(result).not.toBeNull();
                expect(result?.customerId).toBe("customer-uuid-1");
                expect(result?.freeePartnerId).toBe(12345);
            });
        });
    });

    describe("createCustomerMapping", () => {
        describe("正常系", () => {
            test("顧客マッピングを作成できる", async () => {
                const createData = {
                    customerId: "customer-uuid-1",
                    freeePartnerId: 12345,
                    freeeCompanyId: 123456,
                    syncHash: "hash123",
                };
                mockPrismaClient.customerFreeeMapping.create.mockResolvedValue({
                    ...mockCustomerMappingData,
                    ...createData,
                    id: "new-mapping-uuid",
                });

                const result = await repository.createCustomerMapping(createData);

                expect(result.id).toBe("new-mapping-uuid");
                expect(result.syncHash).toBe("hash123");
            });
        });
    });

    describe("updateCustomerMappingSyncHash", () => {
        describe("正常系", () => {
            test("マッピングのハッシュを更新できる", async () => {
                mockPrismaClient.customerFreeeMapping.update.mockResolvedValue({
                    ...mockCustomerMappingData,
                    syncHash: "new-hash456",
                });

                const result = await repository.updateCustomerMappingSyncHash("mapping-uuid-1", "new-hash456");

                expect(result.syncHash).toBe("new-hash456");
            });
        });
    });

    describe("deleteCustomerMapping", () => {
        describe("正常系", () => {
            test("顧客マッピングを削除できる", async () => {
                mockPrismaClient.customerFreeeMapping.delete.mockResolvedValue(mockCustomerMappingData);

                await repository.deleteCustomerMapping("mapping-uuid-1");

                expect(mockPrismaClient.customerFreeeMapping.delete).toHaveBeenCalledWith({
                    where: { id: "mapping-uuid-1" },
                });
            });
        });
    });
});
