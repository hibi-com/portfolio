import { describe, expect, test, vi } from "vitest";
import type { FreeeSyncLog, FreeeSyncService } from "~/domain/freee";
import { SyncPartnersFromFreeeUseCase } from "./syncPartnersFromFreee";

describe("SyncPartnersFromFreeeUseCase", () => {
    const mockSyncLog: FreeeSyncLog = {
        id: "log-1",
        integrationId: "integration-1",
        direction: "IMPORT",
        status: "COMPLETED",
        entityType: "partner",
        totalRecords: 10,
        successCount: 10,
        errorCount: 0,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const createMockSyncService = (overrides: Partial<FreeeSyncService> = {}): FreeeSyncService => ({
        syncPartnersFromFreee: vi.fn().mockResolvedValue(mockSyncLog),
        syncPartnersToFreee: vi.fn().mockResolvedValue(mockSyncLog),
        syncDealsFromFreee: vi.fn().mockResolvedValue(mockSyncLog),
        syncDealsToFreee: vi.fn().mockResolvedValue(mockSyncLog),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("freeeから取引先を同期できる", async () => {
                const integrationId = "integration-1";
                const mockService = createMockSyncService({
                    syncPartnersFromFreee: vi.fn().mockResolvedValue(mockSyncLog),
                });

                const useCase = new SyncPartnersFromFreeeUseCase(mockService);
                const result = await useCase.execute(integrationId);

                expect(result).toEqual(mockSyncLog);
                expect(mockService.syncPartnersFromFreee).toHaveBeenCalledWith(integrationId);
                expect(mockService.syncPartnersFromFreee).toHaveBeenCalledTimes(1);
            });

            test("同期に成功した場合、COMPLETED状態のログが返される", async () => {
                const integrationId = "integration-1";
                const successLog: FreeeSyncLog = {
                    ...mockSyncLog,
                    status: "COMPLETED",
                    totalRecords: 5,
                    successCount: 5,
                    errorCount: 0,
                };
                const mockService = createMockSyncService({
                    syncPartnersFromFreee: vi.fn().mockResolvedValue(successLog),
                });

                const useCase = new SyncPartnersFromFreeeUseCase(mockService);
                const result = await useCase.execute(integrationId);

                expect(result.status).toBe("COMPLETED");
                expect(result.totalRecords).toBe(5);
                expect(result.successCount).toBe(5);
                expect(result.errorCount).toBe(0);
            });
        });

        describe("異常系", () => {
            test("同期に失敗した場合、FAILED状態のログが返される", async () => {
                const integrationId = "integration-1";
                const failedLog: FreeeSyncLog = {
                    ...mockSyncLog,
                    status: "FAILED",
                    totalRecords: 10,
                    successCount: 5,
                    errorCount: 5,
                    errorDetails: [{ record: "partner:1", error: "Some partners failed to sync" }],
                };
                const mockService = createMockSyncService({
                    syncPartnersFromFreee: vi.fn().mockResolvedValue(failedLog),
                });

                const useCase = new SyncPartnersFromFreeeUseCase(mockService);
                const result = await useCase.execute(integrationId);

                expect(result.status).toBe("FAILED");
                expect(result.errorCount).toBe(5);
                expect(result.errorDetails).toBeDefined();
            });

            test("サービスでエラーが発生した場合、エラーがスローされる", async () => {
                const integrationId = "integration-1";
                const mockService = createMockSyncService({
                    syncPartnersFromFreee: vi.fn().mockRejectedValue(new Error("Sync service error")),
                });

                const useCase = new SyncPartnersFromFreeeUseCase(mockService);
                await expect(useCase.execute(integrationId)).rejects.toThrow("Sync service error");
            });
        });

        describe("境界値", () => {
            test("同期対象が0件の場合でも処理できる", async () => {
                const integrationId = "integration-1";
                const emptyLog: FreeeSyncLog = {
                    ...mockSyncLog,
                    totalRecords: 0,
                    successCount: 0,
                    errorCount: 0,
                };
                const mockService = createMockSyncService({
                    syncPartnersFromFreee: vi.fn().mockResolvedValue(emptyLog),
                });

                const useCase = new SyncPartnersFromFreeeUseCase(mockService);
                const result = await useCase.execute(integrationId);

                expect(result.totalRecords).toBe(0);
                expect(result.successCount).toBe(0);
            });
        });
    });
});
