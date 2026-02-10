import { describe, expect, test, vi } from "vitest";
import type { FreeeCompany, FreeeIntegration, FreeeOAuthService, FreeeOAuthTokens, FreeeRepository } from "~/domain/freee";
import { HandleFreeeCallbackUseCase } from "./handleFreeeCallback";

describe("HandleFreeeCallbackUseCase", () => {
    const mockTokens: FreeeOAuthTokens = {
        accessToken: "access-token-123",
        refreshToken: "refresh-token-123",
        expiresIn: 3600,
        scope: "read write",
    };

    const mockCompanies: FreeeCompany[] = [
        {
            id: 12345,
            displayName: "Test Company",
            role: "admin",
        },
    ];

    const mockIntegration: FreeeIntegration = {
        id: "integration-1",
        userId: "user-1",
        companyId: 12345,
        companyName: "Test Company",
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        tokenExpiresAt: new Date(Date.now() + mockTokens.expiresIn * 1000),
        scopes: ["read", "write"],
        isActive: true,
        lastSyncAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const createMockRepository = (overrides: Partial<FreeeRepository> = {}): FreeeRepository => ({
        findIntegrationById: vi.fn().mockResolvedValue(null),
        findIntegrationByUserId: vi.fn().mockResolvedValue(null),
        findIntegrationByCompanyId: vi.fn().mockResolvedValue(null),
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

    const createMockOAuthService = (overrides: Partial<FreeeOAuthService> = {}): FreeeOAuthService => ({
        getAuthorizationUrl: vi.fn().mockReturnValue(""),
        exchangeCodeForTokens: vi.fn().mockResolvedValue(mockTokens),
        refreshTokens: vi.fn().mockResolvedValue(mockTokens),
        getCompanies: vi.fn().mockResolvedValue(mockCompanies),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("新規連携を作成できる", async () => {
                // Given: 認証コード、リダイレクトURI、ユーザーIDが与えられる
                const code = "auth-code-123";
                const redirectUri = "https://example.com/callback";
                const userId = "user-1";

                const mockRepository = createMockRepository({
                    findIntegrationByCompanyId: vi.fn().mockResolvedValue(null),
                    createIntegration: vi.fn().mockResolvedValue(mockIntegration),
                });
                const mockOAuthService = createMockOAuthService();

                // When: コールバックを処理する
                const useCase = new HandleFreeeCallbackUseCase(mockRepository, mockOAuthService);
                const result = await useCase.execute(code, redirectUri, userId);

                // Then: 新規連携が作成される
                expect(result).toEqual(mockIntegration);
                expect(mockOAuthService.exchangeCodeForTokens).toHaveBeenCalledWith(code, redirectUri);
                expect(mockOAuthService.getCompanies).toHaveBeenCalledWith(mockTokens.accessToken);
                expect(mockRepository.createIntegration).toHaveBeenCalledWith({
                    userId,
                    companyId: mockCompanies[0].id,
                    companyName: mockCompanies[0].displayName,
                    accessToken: mockTokens.accessToken,
                    refreshToken: mockTokens.refreshToken,
                    tokenExpiresAt: expect.any(Date),
                    scopes: ["read", "write"],
                });
            });

            test("既存連携のトークンを更新できる", async () => {
                // Given: 既存の連携が存在する
                const code = "auth-code-123";
                const redirectUri = "https://example.com/callback";
                const userId = "user-1";
                const existingIntegration: FreeeIntegration = {
                    ...mockIntegration,
                    id: "existing-integration",
                };

                const mockRepository = createMockRepository({
                    findIntegrationByCompanyId: vi.fn().mockResolvedValue(existingIntegration),
                    updateTokens: vi.fn().mockResolvedValue(mockIntegration),
                });
                const mockOAuthService = createMockOAuthService();

                // When: コールバックを処理する
                const useCase = new HandleFreeeCallbackUseCase(mockRepository, mockOAuthService);
                const result = await useCase.execute(code, redirectUri, userId);

                // Then: トークンが更新される
                expect(result).toEqual(mockIntegration);
                expect(mockRepository.updateTokens).toHaveBeenCalledWith(existingIntegration.id, {
                    accessToken: mockTokens.accessToken,
                    refreshToken: mockTokens.refreshToken,
                    tokenExpiresAt: expect.any(Date),
                });
                expect(mockRepository.createIntegration).not.toHaveBeenCalled();
            });
        });

        describe("異常系", () => {
            test("会社情報が取得できない場合、エラーがスローされる", async () => {
                // Given: 会社情報が空の配列
                const code = "auth-code-123";
                const redirectUri = "https://example.com/callback";
                const userId = "user-1";

                const mockRepository = createMockRepository();
                const mockOAuthService = createMockOAuthService({
                    getCompanies: vi.fn().mockResolvedValue([]),
                });

                // When & Then: エラーがスローされる
                const useCase = new HandleFreeeCallbackUseCase(mockRepository, mockOAuthService);
                await expect(useCase.execute(code, redirectUri, userId)).rejects.toThrow(
                    "No companies found for this freee account",
                );
            });

            test("トークン交換に失敗した場合、エラーがスローされる", async () => {
                // Given: トークン交換がエラーをスローする
                const code = "invalid-code";
                const redirectUri = "https://example.com/callback";
                const userId = "user-1";

                const mockRepository = createMockRepository();
                const mockOAuthService = createMockOAuthService({
                    exchangeCodeForTokens: vi.fn().mockRejectedValue(new Error("Invalid authorization code")),
                });

                // When & Then: エラーがスローされる
                const useCase = new HandleFreeeCallbackUseCase(mockRepository, mockOAuthService);
                await expect(useCase.execute(code, redirectUri, userId)).rejects.toThrow("Invalid authorization code");
            });
        });

        describe("エッジケース", () => {
            test("複数の会社が存在する場合、最初の会社を使用する", async () => {
                // Given: 複数の会社情報
                const code = "auth-code-123";
                const redirectUri = "https://example.com/callback";
                const userId = "user-1";
                const multipleCompanies: FreeeCompany[] = [
                    { id: 11111, displayName: "First Company", role: "admin" },
                    { id: 22222, displayName: "Second Company", role: "member" },
                ];

                const mockRepository = createMockRepository({
                    findIntegrationByCompanyId: vi.fn().mockResolvedValue(null),
                    createIntegration: vi.fn().mockResolvedValue(mockIntegration),
                });
                const mockOAuthService = createMockOAuthService({
                    getCompanies: vi.fn().mockResolvedValue(multipleCompanies),
                });

                // When: コールバックを処理する
                const useCase = new HandleFreeeCallbackUseCase(mockRepository, mockOAuthService);
                await useCase.execute(code, redirectUri, userId);

                // Then: 最初の会社で連携が作成される
                expect(mockRepository.createIntegration).toHaveBeenCalledWith(
                    expect.objectContaining({
                        companyId: multipleCompanies[0].id,
                        companyName: multipleCompanies[0].displayName,
                    }),
                );
            });
        });
    });
});
