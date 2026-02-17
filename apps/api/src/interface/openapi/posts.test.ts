import { postsRouter } from "./posts";

vi.mock("~/di/container", () => ({
    DIContainer: vi.fn().mockImplementation(() => ({
        getGetPostsUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue([
                {
                    id: "123e4567-e89b-12d3-a456-426614174000",
                    slug: "test-post",
                    title: "Test Post",
                    excerpt: "Test excerpt",
                    createdAt: "2024-01-01T00:00:00.000Z",
                    updatedAt: "2024-01-01T00:00:00.000Z",
                },
            ]),
        })),
        getGetPostBySlugUseCase: vi.fn(() => ({
            execute: vi.fn().mockResolvedValue({
                id: "123e4567-e89b-12d3-a456-426614174000",
                slug: "test-post",
                title: "Test Post",
                excerpt: "Test excerpt",
                content: { html: "<p>Test content</p>" },
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

describe("postsRouter", () => {
    const mockEnv = {
        DATABASE_URL: "test-db-url",
        CACHE_URL: "test-cache-url",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /posts", () => {
        describe("正常系", () => {
            test("投稿一覧を200で返す", async () => {
                const req = new Request("http://localhost/posts", {
                    method: "GET",
                });

                const res = await postsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(Array.isArray(json)).toBe(true);
                expect(json).toHaveLength(1);
            });
        });

        describe("異常系", () => {
            test("投稿が存在しない場合は404を返す", async () => {
                const { DIContainer } = await import("~/di/container");
                vi.mocked(DIContainer).mockImplementationOnce(
                    () =>
                        ({
                            getGetPostsUseCase: vi.fn(() => ({
                                execute: vi.fn().mockResolvedValue([]),
                            })),
                        }) as never,
                );

                const req = new Request("http://localhost/posts", {
                    method: "GET",
                });

                const res = await postsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(404);
            });
        });
    });

    describe("GET /post/:slug", () => {
        describe("正常系", () => {
            test("指定されたslugの投稿を200で返す", async () => {
                const req = new Request("http://localhost/post/test-post", {
                    method: "GET",
                });

                const res = await postsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(200);
                const json = await res.json();
                expect(json).toHaveProperty("slug", "test-post");
                expect(json).toHaveProperty("title", "Test Post");
            });
        });

        describe("異常系", () => {
            test("投稿が見つからない場合は404を返す", async () => {
                const { DIContainer } = await import("~/di/container");
                vi.mocked(DIContainer).mockImplementationOnce(
                    () =>
                        ({
                            getGetPostBySlugUseCase: vi.fn(() => ({
                                execute: vi.fn().mockResolvedValue(null),
                            })),
                        }) as never,
                );

                const req = new Request("http://localhost/post/nonexistent", {
                    method: "GET",
                });

                const res = await postsRouter.request(req, undefined, mockEnv);

                expect(res.status).toBe(404);
            });
        });
    });
});
