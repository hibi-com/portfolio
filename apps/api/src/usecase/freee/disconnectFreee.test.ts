import { describe, expect, test, vi } from "vitest";
import type { FreeeIntegration, FreeeRepository } from "~/domain/freee";
import { DisconnectFreeeUseCase } from "./disconnectFreee";

describe("DisconnectFreeeUseCase", () => {
    const mockIntegration: FreeeIntegration = {
        id: "integration-1",
        userId: "user-1",
        companyId: 12345,
        companyName: "Test Company",
        accessToken: "access-token",
        refreshToken: "refresh-token",
        tokenExpiresAt: new Date(),
        scopes: ["read", "write"],
        isActive: false,
        lastSyncAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const createMockRepository = (overrides: Partial<FreeeRepository> = {}): FreeeRepository => ({
        findIntegrationById: vi.fn().mockResolvedValue(mockIntegration),
        findIntegrationByUserId: vi.fn().mockResolvedValue(mockIntegration),
        findIntegrationByCompanyId: vi.fn().mockResolvedValue(mockIntegration),
        findActiveIntegrations: vi.fn().mockResolvedValue([]),
        createIntegration: vi.fn().mockResolvedValue(mockIntegration),
        updateTokens: vi.fn().mockResolvedValue(mockIntegration),
        updateLastSyncAt: vi.fn().mockResolvedValue(mockIntegration),
        deactivateIntegration: vi.fn().mockResolvedValue(mockIntegration),
        deleteIntegration: vi.fn().mockResolvedValue(undefined),
        findSyncLogById: vi.fn().mockResolvedValue(null),
        findSyncLogsByIntegrationId: vi.fn().mockResolvedValue([]),
        createSyncLog: vi.fn().mockResolvedValue({} as any),
        updateSyncLog: vi.fn().mockResolvedValue({} as any),
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
            test("連携を無効化できる", async () => {
                // Given: 有効な連携IDが与えられる
                const integrationId = "integration-1";
                const mockRepository = createMockRepository({
                    deactivateIntegration: vi.fn().mockResolvedValue(mockIntegration),
                });

                // When: 連携を無効化する
                const useCase = new DisconnectFreeeUseCase(mockRepository);
                await useCase.execute(integrationId);

                // Then: リポジトリのdeactivateIntegrationが呼ばれる
                expect(mockRepository.deactivateIntegration).toHaveBeenCalledWith(integrationId);
                expect(mockRepository.deactivateIntegration).toHaveBeenCalledTimes(1);
            });
        });

        describe("異常系", () => {
            test("存在しない連携IDの場合、リポジトリからエラーがスローされる", async () => {
                // Given: 存在しない連携ID
                const integrationId = "non-existent";
                const mockRepository = createMockRepository({
                    deactivateIntegration: vi.fn().mockRejectedValue(new Error("Integration not found")),
                });

                // When & Then: エラーがスローされる
                const useCase = new DisconnectFreeeUseCase(mockRepository);
                await expect(useCase.execute(integrationId)).rejects.toThrow("Integration not found");
            });
        });
    });
});
