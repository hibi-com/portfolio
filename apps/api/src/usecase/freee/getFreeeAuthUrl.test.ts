import type { FreeeOAuthService } from "~/domain/freee";
import { GetFreeeAuthUrlUseCase } from "./getFreeeAuthUrl";

describe("GetFreeeAuthUrlUseCase", () => {
    const createMockOAuthService = (overrides: Partial<FreeeOAuthService> = {}): FreeeOAuthService => ({
        getAuthorizationUrl: vi.fn().mockReturnValue("https://accounts.secure.freee.co.jp/public_api/authorize"),
        exchangeCodeForTokens: vi.fn().mockResolvedValue({} as any),
        refreshTokens: vi.fn().mockResolvedValue({} as any),
        getCompanies: vi.fn().mockResolvedValue([]),
        ...overrides,
    });

    describe("execute", () => {
        describe("正常系", () => {
            test("認証URLを取得できる", () => {
                const state = "random-state-123";
                const redirectUri = "https://example.com/callback";
                const expectedUrl = `https://accounts.secure.freee.co.jp/public_api/authorize?state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`;

                const mockService = createMockOAuthService({
                    getAuthorizationUrl: vi.fn().mockReturnValue(expectedUrl),
                });

                const useCase = new GetFreeeAuthUrlUseCase(mockService);
                const result = useCase.execute(state, redirectUri);

                expect(result).toBe(expectedUrl);
                expect(mockService.getAuthorizationUrl).toHaveBeenCalledWith(state, redirectUri);
                expect(mockService.getAuthorizationUrl).toHaveBeenCalledTimes(1);
            });

            test("異なる状態値でも認証URLを取得できる", () => {
                const state = "different-state-456";
                const redirectUri = "https://example.com/oauth/callback";
                const expectedUrl = `https://accounts.secure.freee.co.jp/public_api/authorize?state=${state}`;

                const mockService = createMockOAuthService({
                    getAuthorizationUrl: vi.fn().mockReturnValue(expectedUrl),
                });

                const useCase = new GetFreeeAuthUrlUseCase(mockService);
                const result = useCase.execute(state, redirectUri);

                expect(result).toBe(expectedUrl);
                expect(mockService.getAuthorizationUrl).toHaveBeenCalledWith(state, redirectUri);
            });
        });

        describe("エッジケース", () => {
            test("空文字の状態値でも認証URLを取得できる", () => {
                const state = "";
                const redirectUri = "https://example.com/callback";
                const expectedUrl = "https://accounts.secure.freee.co.jp/public_api/authorize";

                const mockService = createMockOAuthService({
                    getAuthorizationUrl: vi.fn().mockReturnValue(expectedUrl),
                });

                const useCase = new GetFreeeAuthUrlUseCase(mockService);
                const result = useCase.execute(state, redirectUri);

                expect(result).toBe(expectedUrl);
            });

            test("特殊文字を含むリダイレクトURIでも認証URLを取得できる", () => {
                const state = "state-123";
                const redirectUri = "https://example.com/callback?param=value&other=123";
                const expectedUrl = `https://accounts.secure.freee.co.jp/public_api/authorize?state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`;

                const mockService = createMockOAuthService({
                    getAuthorizationUrl: vi.fn().mockReturnValue(expectedUrl),
                });

                const useCase = new GetFreeeAuthUrlUseCase(mockService);
                const result = useCase.execute(state, redirectUri);

                expect(result).toBe(expectedUrl);
            });
        });
    });
});
