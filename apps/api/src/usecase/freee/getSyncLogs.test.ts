import { describe, expect, test, vi } from "vitest";
import type { FreeeRepository, FreeeSyncLog } from "~/domain/freee";
import { GetSyncLogsUseCase } from "./getSyncLogs";

describe("GetSyncLogsUseCase", () => {
    const mockSyncLog: FreeeSyncLog = {
        id: "log-1",
        integrationId: "integration-1",
        direction: "IMPORT",
        status: "COMPLETED",
        totalRecords: 10,
        successCount: 10,
        errorCount: 0,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const createMockRepository = (overrides: Partial<FreeeRepository> = {}): FreeeRepository => ({
        findIntegrationById: vi.fn().mockResolvedValue(null),
        findIntegrationByUserId: vi.fn().mockResolvedValue(null),
        findIntegrationByCompanyId: vi.fn().mockResolvedValue(null),
        findActiveIntegrations: vi.fn().mockResolvedValue([]),
        createIntegration: vi.fn().mockResolvedValue({} as any),
        updateTokens: vi.fn().mockResolvedValue({} as any),
        updateLastSyncAt: vi.fn().mockResolvedValue({} as any),
        deactivateIntegration: vi.fn().mockResolvedValue({} as any),
        deleteIntegration: vi.fn().mockResolvedValue(undefined),
        findSyncLogById: vi.fn().mockResolvedValue(mockSyncLog),
        findSyncLogsByIntegrationId: vi.fn().mockResolvedValue([mockSyncLog]),
        createSyncLog: vi.fn().mockResolvedValue(mockSyncLog),
        updateSyncLog: vi.fn().mockResolvedValue(mockSyncLog),
        findCustomerMappingByCustomerId: vi.fn().mockResolvedValue(null),
        findCustomerMappingByFreeeId: vi.fn().mockResolvedValue(null),
        createCustomerMapping: vi.fn().mockResolvedValue({} as any),
        updateCustomerMappingSyncHash: vi.fn().mockResolvedValue({} as any),
        deleteCustomerMapping: vi.fn().mockResolvedValue(undefined),
        findDealMappingByDealId: vi.fn().mockResolvedValue(null),
        findDealMappingByFreeeId: vi.fn().mockResolvedValue(null),
        createDealMapping: vi.fn().mockResolvedValue({} as any),
        updateDealMappingSyncHash: vi.fn().mockResolvedValue({} as any),
        deleteDealMapping: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("連携IDから同期ログを取得できる", async () => {
                // Given: 有効な連携IDが与えられる
                const integrationId = "integration-1";
                const mockLogs = [mockSyncLog];
                const mockRepository = createMockRepository({
                    findSyncLogsByIntegrationId: vi.fn().mockResolvedValue(mockLogs),
                });

                // When: 同期ログを取得する
                const useCase = new GetSyncLogsUseCase(mockRepository);
                const result = await useCase.execute(integrationId);

                // Then: 同期ログが返される
                expect(result).toEqual(mockLogs);
                expect(mockRepository.findSyncLogsByIntegrationId).toHaveBeenCalledWith(integrationId, undefined);
                expect(mockRepository.findSyncLogsByIntegrationId).toHaveBeenCalledTimes(1);
            });

            test("制限数を指定して同期ログを取得できる", async () => {
                // Given: 連携IDと制限数が与えられる
                const integrationId = "integration-1";
                const limit = 5;
                const mockLogs = [mockSyncLog];
                const mockRepository = createMockRepository({
                    findSyncLogsByIntegrationId: vi.fn().mockResolvedValue(mockLogs),
                });

                // When: 制限数を指定して同期ログを取得する
                const useCase = new GetSyncLogsUseCase(mockRepository);
                const result = await useCase.execute(integrationId, limit);

                // Then: 同期ログが返される
                expect(result).toEqual(mockLogs);
                expect(mockRepository.findSyncLogsByIntegrationId).toHaveBeenCalledWith(integrationId, limit);
            });

            test("同期ログが存在しない場合空配列を返す", async () => {
                // Given: 同期ログが存在しない連携ID
                const integrationId = "integration-without-logs";
                const mockRepository = createMockRepository({
                    findSyncLogsByIntegrationId: vi.fn().mockResolvedValue([]),
                });

                // When: 同期ログを取得する
                const useCase = new GetSyncLogsUseCase(mockRepository);
                const result = await useCase.execute(integrationId);

                // Then: 空配列が返される
                expect(result).toEqual([]);
            });
        });

        describe("境界値", () => {
            test("制限数0で同期ログを取得できる", async () => {
                // Given: 制限数0
                const integrationId = "integration-1";
                const limit = 0;
                const mockRepository = createMockRepository({
                    findSyncLogsByIntegrationId: vi.fn().mockResolvedValue([]),
                });

                // When: 同期ログを取得する
                const useCase = new GetSyncLogsUseCase(mockRepository);
                const result = await useCase.execute(integrationId, limit);

                // Then: 空配列が返される
                expect(result).toEqual([]);
                expect(mockRepository.findSyncLogsByIntegrationId).toHaveBeenCalledWith(integrationId, limit);
            });

            test("制限数1で同期ログを取得できる", async () => {
                // Given: 制限数1
                const integrationId = "integration-1";
                const limit = 1;
                const mockLogs = [mockSyncLog];
                const mockRepository = createMockRepository({
                    findSyncLogsByIntegrationId: vi.fn().mockResolvedValue(mockLogs),
                });

                // When: 同期ログを取得する
                const useCase = new GetSyncLogsUseCase(mockRepository);
                const result = await useCase.execute(integrationId, limit);

                // Then: 1件の同期ログが返される
                expect(result).toHaveLength(1);
            });
        });

        describe("異常系", () => {
            test("リポジトリでエラーが発生した場合、エラーがスローされる", async () => {
                // Given: リポジトリがエラーをスローする
                const integrationId = "integration-1";
                const mockRepository = createMockRepository({
                    findSyncLogsByIntegrationId: vi.fn().mockRejectedValue(new Error("Database error")),
                });

                // When & Then: エラーがスローされる
                const useCase = new GetSyncLogsUseCase(mockRepository);
                await expect(useCase.execute(integrationId)).rejects.toThrow("Database error");
            });
        });
    });
});
