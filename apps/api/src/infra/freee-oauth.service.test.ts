import { FreeeOAuthServiceImpl } from "./freee-oauth.service";

globalThis.fetch = vi.fn();

describe("FreeeOAuthServiceImpl", () => {
    let service: FreeeOAuthServiceImpl;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new FreeeOAuthServiceImpl("test-client-id", "test-client-secret");
    });

    describe("getAuthorizationUrl", () => {
        describe("正常系", () => {
            test("認証URLを生成できる", () => {
                const state = "test-state";
                const redirectUri = "https://example.com/callback";

                const result = service.getAuthorizationUrl(state, redirectUri);

                expect(result).toContain("https://accounts.secure.freee.co.jp/public_api/authorize");
                expect(result).toContain("client_id=test-client-id");
                expect(result).toContain("redirect_uri=https%3A%2F%2Fexample.com%2Fcallback");
                expect(result).toContain("response_type=code");
                expect(result).toContain("state=test-state");
            });

            test("カスタムAuthBaseを使用できる", () => {
                const customService = new FreeeOAuthServiceImpl(
                    "test-client-id",
                    "test-client-secret",
                    "https://custom.auth.com/",
                );

                const result = customService.getAuthorizationUrl("state", "https://example.com/callback");

                expect(result).toContain("https://custom.auth.com/public_api/authorize");
            });
        });
    });

    describe("exchangeCodeForTokens", () => {
        describe("正常系", () => {
            test("認証コードをトークンに交換できる", async () => {
                vi.mocked(fetch).mockResolvedValue({
                    ok: true,
                    json: async () => ({
                        access_token: "access-token-1",
                        refresh_token: "refresh-token-1",
                        expires_in: 3600,
                        token_type: "Bearer",
                        scope: "read write",
                        created_at: 1704067200,
                    }),
                } as Response);

                const result = await service.exchangeCodeForTokens("auth-code", "https://example.com/callback");

                expect(result.accessToken).toBe("access-token-1");
                expect(result.refreshToken).toBe("refresh-token-1");
                expect(result.expiresIn).toBe(3600);
                expect(result.tokenType).toBe("Bearer");
                expect(result.scope).toBe("read write");
                expect(result.createdAt).toBe(1704067200);
                expect(fetch).toHaveBeenCalledWith(
                    "https://accounts.secure.freee.co.jp/public_api/token",
                    expect.objectContaining({
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }),
                );
            });
        });

        describe("異常系", () => {
            test("APIエラーの場合はエラーをスローする", async () => {
                vi.mocked(fetch).mockResolvedValue({
                    ok: false,
                    status: 400,
                    text: async () => "Bad Request",
                } as Response);

                await expect(
                    service.exchangeCodeForTokens("invalid-code", "https://example.com/callback"),
                ).rejects.toThrow("Failed to exchange code for tokens: 400 Bad Request");
            });
        });
    });

    describe("refreshTokens", () => {
        describe("正常系", () => {
            test("リフレッシュトークンで新しいトークンを取得できる", async () => {
                vi.mocked(fetch).mockResolvedValue({
                    ok: true,
                    json: async () => ({
                        access_token: "new-access-token",
                        refresh_token: "new-refresh-token",
                        expires_in: 3600,
                        token_type: "Bearer",
                        scope: "read write",
                        created_at: 1704070800,
                    }),
                } as Response);

                const result = await service.refreshTokens("refresh-token-1");

                expect(result.accessToken).toBe("new-access-token");
                expect(result.refreshToken).toBe("new-refresh-token");
                expect(result.expiresIn).toBe(3600);
                expect(fetch).toHaveBeenCalledWith(
                    "https://accounts.secure.freee.co.jp/public_api/token",
                    expect.objectContaining({
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    }),
                );
            });
        });

        describe("異常系", () => {
            test("リフレッシュトークンが無効な場合はエラーをスローする", async () => {
                vi.mocked(fetch).mockResolvedValue({
                    ok: false,
                    status: 401,
                    text: async () => "Unauthorized",
                } as Response);

                await expect(service.refreshTokens("invalid-refresh-token")).rejects.toThrow(
                    "Failed to refresh tokens: 401 Unauthorized",
                );
            });
        });
    });

    describe("getCompanies", () => {
        describe("正常系", () => {
            test("アクセストークンで会社一覧を取得できる", async () => {
                vi.mocked(fetch).mockResolvedValue({
                    ok: true,
                    json: async () => ({
                        companies: [
                            {
                                id: 1,
                                display_name: "Company A",
                                role: "admin",
                            },
                            {
                                id: 2,
                                display_name: "Company B",
                                role: "member",
                            },
                        ],
                    }),
                } as Response);

                const result = await service.getCompanies("access-token-1");

                expect(result).toHaveLength(2);
                expect(result[0]).toEqual({
                    id: 1,
                    displayName: "Company A",
                    role: "admin",
                });
                expect(result[1]).toEqual({
                    id: 2,
                    displayName: "Company B",
                    role: "member",
                });
                expect(fetch).toHaveBeenCalledWith(
                    "https://api.freee.co.jp/api/1/companies",
                    expect.objectContaining({
                        headers: {
                            Authorization: "Bearer access-token-1", // NOSONAR test mock value
                            "Content-Type": "application/json",
                        },
                    }),
                );
            });
        });

        describe("異常系", () => {
            test("アクセストークンが無効な場合はエラーをスローする", async () => {
                vi.mocked(fetch).mockResolvedValue({
                    ok: false,
                    status: 401,
                    text: async () => "Unauthorized",
                } as Response);

                await expect(service.getCompanies("invalid-token")).rejects.toThrow(
                    "Failed to get companies: 401 Unauthorized",
                );
            });
        });

        describe("エッジケース", () => {
            test("会社が存在しない場合は空配列を返す", async () => {
                vi.mocked(fetch).mockResolvedValue({
                    ok: true,
                    json: async () => ({
                        companies: [],
                    }),
                } as Response);

                const result = await service.getCompanies("access-token-1");

                expect(result).toHaveLength(0);
            });
        });
    });
});
