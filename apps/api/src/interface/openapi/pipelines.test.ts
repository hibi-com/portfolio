import { beforeEach, describe, expect, test, vi } from "vitest";
import { pipelinesRouter } from "./pipelines";

vi.mock("~/di/container", () => ({
    DIContainer: vi.fn().mockImplementation(() => ({
        getGetPipelinesUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue([
                {
                    id: "123e4567-e89b-12d3-a456-426614174000",
                    name: "Test Pipeline",
                    isDefault: false,
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            ]),
        })),
        getGetPipelineByIdUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "Test Pipeline",
                isDefault: false,
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getCreatePipelineUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "New Pipeline",
                isDefault: false,
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getUpdatePipelineUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                name: "Updated Pipeline",
                isDefault: false,
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            }),
        })),
        getDeletePipelineUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue(undefined),
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

describe("pipelinesRouter", () => {
    const mockEnv = {
        DATABASE_URL: "test-db-url",
        CACHE_URL: "test-cache-url",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /pipelines", () => {
        describe("正常系", () => {
            test("パイプライン一覧を200で返す", async () => {
                const req = new Request("http://localhost/pipelines", {
                    method: "GET",
                });

                const res = await pipelinesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(Array.isArray(json)).toBe(true);
            });
        });
    });

    describe("GET /pipelines/:id", () => {
        describe("正常系", () => {
            test("指定されたIDのパイプラインを200で返す", async () => {
                const req = new Request("http://localhost/pipelines/123e4567-e89b-12d3-a456-426614174000", {
                    method: "GET",
                });

                const res = await pipelinesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("id");
            });
        });

        describe("異常系", () => {
            test("無効なUUID形式の場合は400を返す", async () => {
                const req = new Request("http://localhost/pipelines/invalid-uuid", {
                    method: "GET",
                });

                const res = await pipelinesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(400);
            });
        });
    });

    describe("POST /pipelines", () => {
        describe("正常系", () => {
            test("新しいパイプラインを201で作成する", async () => {
                const req = new Request("http://localhost/pipelines", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "New Pipeline",
                    }),
                });

                const res = await pipelinesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(201);
            });
        });
    });

    describe("PUT /pipelines/:id", () => {
        describe("正常系", () => {
            test("パイプラインを200で更新する", async () => {
                const req = new Request("http://localhost/pipelines/123e4567-e89b-12d3-a456-426614174000", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: "Updated Pipeline",
                    }),
                });

                const res = await pipelinesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
            });
        });
    });

    describe("DELETE /pipelines/:id", () => {
        describe("正常系", () => {
            test("パイプラインを204で削除する", async () => {
                const req = new Request("http://localhost/pipelines/123e4567-e89b-12d3-a456-426614174000", {
                    method: "DELETE",
                });

                const res = await pipelinesRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(204);
            });
        });
    });
});
