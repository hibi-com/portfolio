import { describe, expect, test, vi } from "vitest";
import type { FreeeIntegration, FreeeRepository } from "~/domain/freee";
import { GetFreeeIntegrationUseCase } from "./getFreeeIntegration";

describe("GetFreeeIntegrationUseCase", () => {
    const mockIntegration: FreeeIntegration = {
        id: "integration-1",
        userId: "user-1",
        companyId: 12345,
        companyName: "Test Company",
        accessToken: "access-token",
        refreshToken: "refresh-token",
        tokenExpiresAt: new Date(),
        scopes: ["read", "write"],
        isActive: true,
        lastSyncAt: new Date(),
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
            test("ユーザーIDから連携情報を取得できる", async () => {
                // Given: 有効なユーザーIDが与えられる
                const userId = "user-1";
                const mockRepository = createMockRepository({
                    findIntegrationByUserId: vi.fn().mockResolvedValue(mockIntegration),
                });

                // When: 連携情報を取得する
                const useCase = new GetFreeeIntegrationUseCase(mockRepository);
                const result = await useCase.execute(userId);

                // Then: 連携情報が返される
                expect(result).toEqual(mockIntegration);
                expect(mockRepository.findIntegrationByUserId).toHaveBeenCalledWith(userId);
                expect(mockRepository.findIntegrationByUserId).toHaveBeenCalledTimes(1);
            });

            test("連携が存在しない場合nullを返す", async () => {
                // Given: 連携が存在しないユーザーID
                const userId = "user-without-integration";
                const mockRepository = createMockRepository({
                    findIntegrationByUserId: vi.fn().mockResolvedValue(null),
                });

                // When: 連携情報を取得する
                const useCase = new GetFreeeIntegrationUseCase(mockRepository);
                const result = await useCase.execute(userId);

                // Then: nullが返される
                expect(result).toBeNull();
                expect(mockRepository.findIntegrationByUserId).toHaveBeenCalledWith(userId);
            });
        });

        describe("異常系", () => {
            test("リポジトリでエラーが発生した場合、エラーがスローされる", async () => {
                // Given: リポジトリがエラーをスローする
                const userId = "user-1";
                const mockRepository = createMockRepository({
                    findIntegrationByUserId: vi.fn().mockRejectedValue(new Error("Database error")),
                });

                // When & Then: エラーがスローされる
                const useCase = new GetFreeeIntegrationUseCase(mockRepository);
                await expect(useCase.execute(userId)).rejects.toThrow("Database error");
            });
        });

        describe("エッジケース", () => {
            test("空文字のユーザーIDでも処理できる", async () => {
                // Given: 空文字のユーザーID
                const userId = "";
                const mockRepository = createMockRepository({
                    findIntegrationByUserId: vi.fn().mockResolvedValue(null),
                });

                // When: 連携情報を取得する
                const useCase = new GetFreeeIntegrationUseCase(mockRepository);
                const result = await useCase.execute(userId);

                // Then: nullが返される
                expect(result).toBeNull();
                expect(mockRepository.findIntegrationByUserId).toHaveBeenCalledWith(userId);
            });
        });
    });
});
