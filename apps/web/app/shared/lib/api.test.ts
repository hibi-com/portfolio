const mockPostsClient = {
    postsListPosts: vi.fn(),
    postsGetPostBySlug: vi.fn(),
};

const mockPortfoliosClient = {
    portfoliosListPortfolios: vi.fn(),
    portfoliosGetPortfolioBySlug: vi.fn(),
};

vi.mock("@portfolio/api/generated/posts/posts", () => ({
    getPosts: vi.fn(() => mockPostsClient),
}));

vi.mock("@portfolio/api/generated/portfolios/portfolios", () => ({
    getPortfolios: vi.fn(() => mockPortfoliosClient),
}));

describe("api", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("createApiClient", () => {
        describe("正常系", () => {
            test("APIクライアントを作成できる", async () => {
                const { createApiClient } = await import("./api");

                const client = createApiClient("https://api.example.com");

                expect(client).toBeDefined();
                expect(client.posts).toBeDefined();
                expect(client.portfolios).toBeDefined();
            });
        });

        describe("posts", () => {
            test("listPostsがデータを返す", async () => {
                const { createApiClient } = await import("./api");
                const mockPosts = [{ id: "1", title: "Test Post" }];
                mockPostsClient.postsListPosts.mockResolvedValue(mockPosts);
                const client = createApiClient("https://api.example.com");

                const result = await client.posts.listPosts();

                expect(result.data).toEqual(mockPosts);
                expect(mockPostsClient.postsListPosts).toHaveBeenCalledWith(undefined, {
                    baseURL: "https://api.example.com",
                });
            });

            test("listPostsにパラメータを渡せる", async () => {
                const { createApiClient } = await import("./api");
                mockPostsClient.postsListPosts.mockResolvedValue([]);
                const client = createApiClient("https://api.example.com");
                const params = { page: 1, perPage: 10, tag: "tech" };

                await client.posts.listPosts(params);

                expect(mockPostsClient.postsListPosts).toHaveBeenCalledWith(params, {
                    baseURL: "https://api.example.com",
                });
            });

            test("getPostBySlugがデータを返す", async () => {
                const { createApiClient } = await import("./api");
                const mockPost = { id: "1", title: "Test Post", slug: "test-post" };
                mockPostsClient.postsGetPostBySlug.mockResolvedValue(mockPost);
                const client = createApiClient("https://api.example.com");

                const result = await client.posts.getPostBySlug("test-post");

                expect(result.data).toEqual(mockPost);
                expect(mockPostsClient.postsGetPostBySlug).toHaveBeenCalledWith("test-post", {
                    baseURL: "https://api.example.com",
                });
            });
        });

        describe("portfolios", () => {
            test("listPortfoliosがデータを返す", async () => {
                const { createApiClient } = await import("./api");
                const mockPortfolios = [{ id: "1", title: "Test Portfolio" }];
                mockPortfoliosClient.portfoliosListPortfolios.mockResolvedValue(mockPortfolios);
                const client = createApiClient("https://api.example.com");

                const result = await client.portfolios.listPortfolios();

                expect(result.data).toEqual(mockPortfolios);
                expect(mockPortfoliosClient.portfoliosListPortfolios).toHaveBeenCalledWith(undefined, {
                    baseURL: "https://api.example.com",
                });
            });

            test("listPortfoliosにパラメータを渡せる", async () => {
                const { createApiClient } = await import("./api");
                mockPortfoliosClient.portfoliosListPortfolios.mockResolvedValue([]);
                const client = createApiClient("https://api.example.com");
                const params = { page: 2, perPage: 5 };

                await client.portfolios.listPortfolios(params);

                expect(mockPortfoliosClient.portfoliosListPortfolios).toHaveBeenCalledWith(params, {
                    baseURL: "https://api.example.com",
                });
            });

            test("getPortfolioBySlugがデータを返す", async () => {
                const { createApiClient } = await import("./api");
                const mockPortfolio = { id: "1", title: "Test Portfolio", slug: "test-portfolio" };
                mockPortfoliosClient.portfoliosGetPortfolioBySlug.mockResolvedValue(mockPortfolio);
                const client = createApiClient("https://api.example.com");

                const result = await client.portfolios.getPortfolioBySlug("test-portfolio");

                expect(result.data).toEqual(mockPortfolio);
                expect(mockPortfoliosClient.portfoliosGetPortfolioBySlug).toHaveBeenCalledWith("test-portfolio", {
                    baseURL: "https://api.example.com",
                });
            });
        });

        describe("getBaseUrl", () => {
            test("apiUrlが指定されている場合、その値を使用する", async () => {
                const { createApiClient } = await import("./api");
                mockPostsClient.postsListPosts.mockResolvedValue([]);
                const client = createApiClient("https://custom-api.example.com");

                await client.posts.listPosts();

                expect(mockPostsClient.postsListPosts).toHaveBeenCalledWith(undefined, {
                    baseURL: "https://custom-api.example.com",
                });
            });

            test("apiUrlが未指定の場合、デフォルト値を使用する", async () => {
                const { createApiClient } = await import("./api");
                mockPostsClient.postsListPosts.mockResolvedValue([]);
                const client = createApiClient();

                await client.posts.listPosts();

                expect(mockPostsClient.postsListPosts).toHaveBeenCalledWith(undefined, {
                    baseURL: expect.any(String),
                });
            });
        });

        describe("異常系", () => {
            test("APIエラーが発生した場合、エラーがスローされる", async () => {
                const { createApiClient } = await import("./api");
                const error = new Error("Network error");
                mockPostsClient.postsListPosts.mockRejectedValue(error);
                const client = createApiClient("https://api.example.com");

                await expect(client.posts.listPosts()).rejects.toThrow("Network error");
            });

            test("getPostBySlugでエラーが発生した場合、エラーがスローされる", async () => {
                const { createApiClient } = await import("./api");
                const error = new Error("Post not found");
                mockPostsClient.postsGetPostBySlug.mockRejectedValue(error);
                const client = createApiClient("https://api.example.com");

                await expect(client.posts.getPostBySlug("non-existent")).rejects.toThrow("Post not found");
            });
        });
    });

    describe("api (default export)", () => {
        test("デフォルトのAPIクライアントがエクスポートされている", async () => {
            const { api } = await import("./api");

            expect(api).toBeDefined();
            expect(api.posts).toBeDefined();
            expect(api.portfolios).toBeDefined();
        });
    });
});
