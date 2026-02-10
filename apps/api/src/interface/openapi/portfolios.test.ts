import { beforeEach, describe, expect, test, vi } from "vitest";
import { portfoliosRouter } from "./portfolios";

vi.mock("~/di/container", () => ({
    DIContainer: vi.fn().mockImplementation(() => ({
        getGetPortfoliosUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue([
                {
                    id: "123e4567-e89b-12d3-a456-426614174000",
                    slug: "test-portfolio",
                    title: "Test Portfolio",
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            ]),
        })),
        getGetPortfolioBySlugUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                slug: "test-portfolio",
                title: "Test Portfolio",
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

describe("portfoliosRouter", () => {
    const mockEnv = {
        DATABASE_URL: "test-db-url",
        CACHE_URL: "test-cache-url",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /portfolios", () => {
        describe("正常系", () => {
            test("ポートフォリオ一覧を200で返す", async () => {
                const req = new Request("http://localhost/portfolios", {
                    method: "GET",
                });

                const res = await portfoliosRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(Array.isArray(json)).toBe(true);
                expect(json).toHaveLength(1);
            });
        });

        describe("異常系", () => {
            test("ポートフォリオが存在しない場合は404を返す", async () => {
                const { DIContainer } = await import("~/di/container");
                vi.mocked(DIContainer).mockImplementationOnce(
                    () =>
                        ({
                            getGetPortfoliosUseCase: vi.fn(() => ({
                                execute: vi.fn().mockResolvedValue([]),
                            })),
                        }) as never,
                );

                const req = new Request("http://localhost/portfolios", {
                    method: "GET",
                });

                const res = await portfoliosRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(404);
            });
        });
    });

    describe("GET /portfolio/:slug", () => {
        describe("正常系", () => {
            test("指定されたslugのポートフォリオを200で返す", async () => {
                const req = new Request("http://localhost/portfolio/test-portfolio", {
                    method: "GET",
                });

                const res = await portfoliosRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("slug", "test-portfolio");
            });
        });

        describe("異常系", () => {
            test("ポートフォリオが見つからない場合は404を返す", async () => {
                const { DIContainer } = await import("~/di/container");
                vi.mocked(DIContainer).mockImplementationOnce(
                    () =>
                        ({
                            getGetPortfolioBySlugUseCase: vi.fn(() => ({
                                execute: vi.fn().mockResolvedValue(null),
                            })),
                        }) as never,
                );

                const req = new Request("http://localhost/portfolio/nonexistent", {
                    method: "GET",
                });

                const res = await portfoliosRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(404);
            });
        });
    });
});
