import { beforeEach, describe, expect, test, vi } from "vitest";
import { freeeRouter } from "./freee";

vi.mock("~/di/container", () => ({
    DIContainer: vi.fn().mockImplementation(() => ({
        getGetFreeeAuthUrlUseCase: vi.fn(() => ({
            execute: vi.fn(
                (state: string, redirectUri: string) =>
                    `https://accounts.secure.freee.co.jp/public_api/authorize?client_id=test&redirect_uri=${redirectUri}&response_type=code&state=${state}`,
            ),
        })),
        getHandleFreeeCallbackUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                userId: "user-123",
                companyId: 12345,
                companyName: "Test Company",
                isActive: true,
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getGetFreeeIntegrationUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                userId: "user-123",
                companyId: 12345,
                companyName: "Test Company",
                isActive: true,
                lastSyncAt: "2024-01-01T00:00:00.000Z",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getDisconnectFreeeUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue(undefined),
        })),
        getSyncPartnersFromFreeeUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "sync-log-123",
                integrationId: "123e4567-e89b-12d3-a456-426614174000",
                direction: "IMPORT",
                entityType: "partners",
                status: "PENDING",
                createdAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getSyncPartnersToFreeeUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "sync-log-124",
                integrationId: "123e4567-e89b-12d3-a456-426614174000",
                direction: "EXPORT",
                entityType: "partners",
                status: "PENDING",
                createdAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getGetSyncLogsUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue([
                {
                    id: "sync-log-123",
                    integrationId: "123e4567-e89b-12d3-a456-426614174000",
                    direction: "IMPORT",
                    entityType: "partners",
                    status: "COMPLETED",
                    createdAt: "2024-01-01T00:00:00.000Z",
                },
            ]),
        })),
    })),
}));

vi.mock("~/lib/logger", () => ({
    getLogger: vi.fn(() => ({
        logError: vi.fn(),
    })),
    getMetrics: vi.fn(() => ({
        httpRequestDuration: {
            observe: vi.fn(),
        },
        httpRequestTotal: {
            inc: vi.fn(),
        },
    })),
}));

vi.mock("~/lib/validation", () => ({
    isValidUuid: vi.fn((str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)),
}));

describe("freeeRouter", () => {
    const mockEnv = {
        DATABASE_URL: "test-db-url",
        CACHE_URL: "test-cache-url",
        FREEE_CLIENT_ID: "test-client-id",
        FREEE_CLIENT_SECRET: "test-client-secret",
        FREEE_AUTH_BASE_URL: "https://accounts.secure.freee.co.jp",
        FREEE_API_BASE_URL: "https://api.freee.co.jp",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /auth", () => {
        describe("正常系", () => {
            test("OAuth認証URLを200で返す", async () => {
                const req = new Request("http://localhost/auth?redirect_uri=http://localhost:3000/callback", {
                    method: "GET",
                });

                const res = await freeeRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("authUrl");
                expect(json).toHaveProperty("state");
            });
        });

        describe("異常系", () => {
            test("redirect_uriがない場合は400を返す", async () => {
                const req = new Request("http://localhost/auth", {
                    method: "GET",
                });

                const res = await freeeRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(400);
            });
        });
    });

    describe("POST /callback", () => {
        describe("正常系", () => {
            test("OAuth認証を完了して200を返す", async () => {
                const req = new Request("http://localhost/callback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        code: "auth-code",
                        redirectUri: "http://localhost:3000/callback",
                        userId: "user-123",
                    }),
                });

                const res = await freeeRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("id");
                expect(json).toHaveProperty("companyId");
            });
        });
    });

    describe("GET /integration", () => {
        describe("正常系", () => {
            test("連携状態を200で返す", async () => {
                const req = new Request("http://localhost/integration?userId=user-123", {
                    method: "GET",
                });

                const res = await freeeRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("connected", true);
            });
        });

        describe("異常系", () => {
            test("連携がない場合はconnected: falseを返す", async () => {
                const { DIContainer } = await import("~/di/container");
                vi.mocked(DIContainer).mockImplementationOnce(
                    () =>
                        ({
                            getGetFreeeIntegrationUseCase: vi.fn(() => ({
                                execute: vi.fn().mockResolvedValue(null),
                            })),
                        }) as never,
                );

                const req = new Request("http://localhost/integration?userId=user-123", {
                    method: "GET",
                });

                const res = await freeeRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("connected", false);
            });
        });
    });

    describe("POST /:id/disconnect", () => {
        describe("正常系", () => {
            test("連携を解除して200を返す", async () => {
                const req = new Request("http://localhost/123e4567-e89b-12d3-a456-426614174000/disconnect", {
                    method: "POST",
                });

                const res = await freeeRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("success", true);
            });
        });
    });

    describe("POST /:id/sync/partners/import", () => {
        describe("正常系", () => {
            test("freeeから顧客をインポートして200を返す", async () => {
                const req = new Request("http://localhost/123e4567-e89b-12d3-a456-426614174000/sync/partners/import", {
                    method: "POST",
                });

                const res = await freeeRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("direction", "IMPORT");
            });
        });
    });

    describe("POST /:id/sync/partners/export", () => {
        describe("正常系", () => {
            test("顧客をfreeeへエクスポートして200を返す", async () => {
                const req = new Request("http://localhost/123e4567-e89b-12d3-a456-426614174000/sync/partners/export", {
                    method: "POST",
                });

                const res = await freeeRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("direction", "EXPORT");
            });
        });
    });

    describe("GET /:id/sync/logs", () => {
        describe("正常系", () => {
            test("同期ログ一覧を200で返す", async () => {
                const req = new Request("http://localhost/123e4567-e89b-12d3-a456-426614174000/sync/logs", {
                    method: "GET",
                });

                const res = await freeeRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(Array.isArray(json)).toBe(true);
            });
        });
    });
});
