import { describe, expect, test, vi } from "vitest";
import type { FreeeSyncLog, FreeeSyncService } from "~/domain/freee";
import { SyncPartnersToFreeeUseCase } from "./syncPartnersToFreee";

describe("SyncPartnersToFreeeUseCase", () => {
    const mockSyncLog: FreeeSyncLog = {
        id: "log-1",
        integrationId: "integration-1",
        direction: "TO_FREEE",
        status: "SUCCESS",
        recordsProcessed: 10,
        recordsSucceeded: 10,
        recordsFailed: 0,
        errorMessage: null,
        startedAt: new Date(),
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
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
            test("取引先をfreeeに同期できる", async () => {
                // Given: 有効な連携IDが与えられる
                const integrationId = "integration-1";
                const mockService = createMockSyncService({
                    syncPartnersToFreee: vi.fn().mockResolvedValue(mockSyncLog),
                });

                // When: 取引先を同期する
                const useCase = new SyncPartnersToFreeeUseCase(mockService);
                const result = await useCase.execute(integrationId);

                // Then: 同期ログが返される
                expect(result).toEqual(mockSyncLog);
                expect(mockService.syncPartnersToFreee).toHaveBeenCalledWith(integrationId);
                expect(mockService.syncPartnersToFreee).toHaveBeenCalledTimes(1);
            });

            test("同期に成功した場合、SUCCESS状態のログが返される", async () => {
                // Given: 同期が成功する
                const integrationId = "integration-1";
                const successLog: FreeeSyncLog = {
                    ...mockSyncLog,
                    status: "SUCCESS",
                    recordsProcessed: 5,
                    recordsSucceeded: 5,
                    recordsFailed: 0,
                };
                const mockService = createMockSyncService({
                    syncPartnersToFreee: vi.fn().mockResolvedValue(successLog),
                });

                // When: 取引先を同期する
                const useCase = new SyncPartnersToFreeeUseCase(mockService);
                const result = await useCase.execute(integrationId);

                // Then: SUCCESS状態のログが返される
                expect(result.status).toBe("SUCCESS");
                expect(result.recordsProcessed).toBe(5);
                expect(result.recordsSucceeded).toBe(5);
                expect(result.recordsFailed).toBe(0);
            });
        });

        describe("異常系", () => {
            test("同期に失敗した場合、FAILED状態のログが返される", async () => {
                // Given: 同期が失敗する
                const integrationId = "integration-1";
                const failedLog: FreeeSyncLog = {
                    ...mockSyncLog,
                    status: "FAILED",
                    recordsProcessed: 10,
                    recordsSucceeded: 5,
                    recordsFailed: 5,
                    errorMessage: "Some partners failed to sync",
                };
                const mockService = createMockSyncService({
                    syncPartnersToFreee: vi.fn().mockResolvedValue(failedLog),
                });

                // When: 取引先を同期する
                const useCase = new SyncPartnersToFreeeUseCase(mockService);
                const result = await useCase.execute(integrationId);

                // Then: FAILED状態のログが返される
                expect(result.status).toBe("FAILED");
                expect(result.recordsFailed).toBe(5);
                expect(result.errorMessage).toBe("Some partners failed to sync");
            });

            test("サービスでエラーが発生した場合、エラーがスローされる", async () => {
                // Given: サービスがエラーをスローする
                const integrationId = "integration-1";
                const mockService = createMockSyncService({
                    syncPartnersToFreee: vi.fn().mockRejectedValue(new Error("Sync service error")),
                });

                // When & Then: エラーがスローされる
                const useCase = new SyncPartnersToFreeeUseCase(mockService);
                await expect(useCase.execute(integrationId)).rejects.toThrow("Sync service error");
            });
        });

        describe("境界値", () => {
            test("同期対象が0件の場合でも処理できる", async () => {
                // Given: 同期対象が0件
                const integrationId = "integration-1";
                const emptyLog: FreeeSyncLog = {
                    ...mockSyncLog,
                    recordsProcessed: 0,
                    recordsSucceeded: 0,
                    recordsFailed: 0,
                };
                const mockService = createMockSyncService({
                    syncPartnersToFreee: vi.fn().mockResolvedValue(emptyLog),
                });

                // When: 取引先を同期する
                const useCase = new SyncPartnersToFreeeUseCase(mockService);
                const result = await useCase.execute(integrationId);

                // Then: 0件のログが返される
                expect(result.recordsProcessed).toBe(0);
                expect(result.recordsSucceeded).toBe(0);
            });
        });
    });
});
