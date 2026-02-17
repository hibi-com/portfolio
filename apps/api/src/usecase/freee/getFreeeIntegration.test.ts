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
        tokenExpiresAt: new Date().toISOString(),
        scopes: ["read", "write"],
        isActive: true,
        lastSyncAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
                const userId = "user-1";
                const mockRepository = createMockRepository({
                    findIntegrationByUserId: vi.fn().mockResolvedValue(mockIntegration),
                });

                const useCase = new GetFreeeIntegrationUseCase(mockRepository);
                const result = await useCase.execute(userId);

                expect(result).toEqual(mockIntegration);
                expect(mockRepository.findIntegrationByUserId).toHaveBeenCalledWith(userId);
                expect(mockRepository.findIntegrationByUserId).toHaveBeenCalledTimes(1);
            });

            test("連携が存在しない場合nullを返す", async () => {
                const userId = "user-without-integration";
                const mockRepository = createMockRepository({
                    findIntegrationByUserId: vi.fn().mockResolvedValue(null),
                });

                const useCase = new GetFreeeIntegrationUseCase(mockRepository);
                const result = await useCase.execute(userId);

                expect(result).toBeNull();
                expect(mockRepository.findIntegrationByUserId).toHaveBeenCalledWith(userId);
            });
        });

        describe("異常系", () => {
            test("リポジトリでエラーが発生した場合、エラーがスローされる", async () => {
                const userId = "user-1";
                const mockRepository = createMockRepository({
                    findIntegrationByUserId: vi.fn().mockRejectedValue(new Error("Database error")),
                });

                const useCase = new GetFreeeIntegrationUseCase(mockRepository);
                await expect(useCase.execute(userId)).rejects.toThrow("Database error");
            });
        });

        describe("エッジケース", () => {
            test("空文字のユーザーIDでも処理できる", async () => {
                const userId = "";
                const mockRepository = createMockRepository({
                    findIntegrationByUserId: vi.fn().mockResolvedValue(null),
                });

                const useCase = new GetFreeeIntegrationUseCase(mockRepository);
                const result = await useCase.execute(userId);

                expect(result).toBeNull();
                expect(mockRepository.findIntegrationByUserId).toHaveBeenCalledWith(userId);
            });
        });
    });
});
