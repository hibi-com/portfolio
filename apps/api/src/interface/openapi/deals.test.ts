import { beforeEach, describe, expect, test, vi } from "vitest";
import { dealsRouter } from "./deals";

vi.mock("~/di/container", () => ({
    DIContainer: vi.fn().mockImplementation(() => ({
        getGetDealsUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue([
                {
                    id: "123e4567-e89b-12d3-a456-426614174000",
                    name: "Test Deal",
                    stageId: "stage-123",
                    status: "OPEN",
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            ]),
        })),
        getGetDealByIdUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "Test Deal",
                stageId: "stage-123",
                status: "OPEN",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getCreateDealUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "New Deal",
                stageId: "stage-123",
                status: "OPEN",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getUpdateDealUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "Updated Deal",
                stageId: "stage-123",
                status: "WON",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getDeleteDealUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue(undefined),
        })),
        getMoveDealToStageUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "Test Deal",
                stageId: "stage-456",
                status: "OPEN",
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
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

describe("dealsRouter", () => {
    const mockEnv = {
        DATABASE_URL: "test-db-url",
        CACHE_URL: "test-cache-url",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /deals", () => {
        describe("正常系", () => {
            test("ディール一覧を200で返す", async () => {
                const req = new Request("http://localhost/deals", {
                    method: "GET",
                });

                const res = await dealsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(Array.isArray(json)).toBe(true);
            });
        });
    });

    describe("GET /deals/:id", () => {
        describe("正常系", () => {
            test("指定されたIDのディールを200で返す", async () => {
                const req = new Request("http://localhost/deals/123e4567-e89b-12d3-a456-426614174000", {
                    method: "GET",
                });

                const res = await dealsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("id");
            });
        });

        describe("異常系", () => {
            test("無効なUUID形式の場合は400を返す", async () => {
                const req = new Request("http://localhost/deals/invalid-uuid", {
                    method: "GET",
                });

                const res = await dealsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(400);
            });
        });
    });

    describe("POST /deals", () => {
        describe("正常系", () => {
            test("新しいディールを201で作成する", async () => {
                const req = new Request("http://localhost/deals", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "New Deal",
                        stageId: "stage-123",
                    }),
                });

                const res = await dealsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(201);
            });
        });
    });

    describe("PUT /deals/:id/stage", () => {
        describe("正常系", () => {
            test("ディールのステージを200で移動する", async () => {
                const req = new Request("http://localhost/deals/123e4567-e89b-12d3-a456-426614174000/stage", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        stageId: "stage-456",
                    }),
                });

                const res = await dealsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("stageId", "stage-456");
            });
        });
    });

    describe("DELETE /deals/:id", () => {
        describe("正常系", () => {
            test("ディールを204で削除する", async () => {
                const req = new Request("http://localhost/deals/123e4567-e89b-12d3-a456-426614174000", {
                    method: "DELETE",
                });

                const res = await dealsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(204);
            });
        });
    });
});
