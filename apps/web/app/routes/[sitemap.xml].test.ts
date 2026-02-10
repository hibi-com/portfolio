import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Post } from "~/entities/blog";
import type { Portfolio } from "~/entities/portfolio";
import { loader } from "./[sitemap.xml]";

vi.mock("~/shared/lib/api", () => ({
    createApiClient: vi.fn(),
}));

describe("[sitemap.xml] loader", () => {
    const mockApiClient = {
        portfolios: {
            listPortfolios: vi.fn(),
        },
        posts: {
            listPosts: vi.fn(),
        },
    };

    beforeEach(async () => {
        vi.clearAllMocks();
        const { createApiClient } = await import("~/shared/lib/api");
        vi.mocked(createApiClient).mockReturnValue(
            mockApiClient as unknown as ReturnType<typeof import("~/shared/lib/api").createApiClient>,
        );
    });

    test("should generate sitemap.xml with routes", async () => {
        const mockPortfolios: Portfolio[] = [
            {
                id: "1",
                slug: "test-portfolio",
                date: "2023-01-01",
                title: "Test Portfolio",
                company: "Test Company",
                current: false,
            },
        ];
        const mockPosts: Post[] = [
            {
                id: "1",
                slug: "test-post",
                date: "2023-01-01",
                title: "Test Post",
                content: {
                    html: "Test content",
                },
                imageTemp: "",
                sticky: false,
                tags: [],
                createdAt: "2023-01-01",
                updatedAt: "2023-01-01",
            },
        ];

        mockApiClient.portfolios.listPortfolios.mockResolvedValue({ data: mockPortfolios } as never);
        mockApiClient.posts.listPosts.mockResolvedValue({ data: mockPosts } as never);

        const args = {
            request: new Request("https://example.com"),
            params: {},
            context: {
                cloudflare: {
                    env: {},
                },
            },
        } as unknown as LoaderFunctionArgs;

        const result = await loader(args);

        expect(result).toBeInstanceOf(Response);
        const text = await (result as Response).text();
        expect(text).toContain("<urlset");
        expect(text).toContain("</urlset>");
        expect(text).toContain("/blog");
        expect(text).toContain("/portfolio");
    });

    test("should include portfolio URLs", async () => {
        const mockPortfolios: Portfolio[] = [
            {
                id: "1",
                slug: "test-portfolio",
                date: "2023-01-01",
                title: "Test Portfolio",
                company: "Test Company",
                current: false,
            },
        ];

        mockApiClient.portfolios.listPortfolios.mockResolvedValue({ data: mockPortfolios } as never);
        mockApiClient.posts.listPosts.mockResolvedValue({ data: [] } as never);

        const args = {
            request: new Request("https://example.com"),
            params: {},
            context: {
                cloudflare: {
                    env: {},
                },
            },
        } as unknown as LoaderFunctionArgs;

        const result = await loader(args);
        const text = await (result as Response).text();

        expect(text).toContain("/portfolio/test-portfolio");
    });

    test("should include post URLs", async () => {
        const mockPosts: Post[] = [
            {
                id: "1",
                slug: "test-post",
                date: "2023-01-01",
                title: "Test Post",
                content: {
                    html: "Test content",
                },
                imageTemp: "",
                sticky: false,
                tags: [],
            },
        ];

        mockApiClient.portfolios.listPortfolios.mockResolvedValue({ data: [] } as never);
        mockApiClient.posts.listPosts.mockResolvedValue({ data: mockPosts } as never);

        const args = {
            request: new Request("https://example.com"),
            params: {},
            context: {
                cloudflare: {
                    env: {},
                },
            },
        } as unknown as LoaderFunctionArgs;

        const result = await loader(args);
        expect(result).toBeInstanceOf(Response);
        const text = await (result as Response).text();

        expect(text).toContain("/blog/test-post");
    });

    test("should set correct Content-Type header", async () => {
        mockApiClient.portfolios.listPortfolios.mockResolvedValue({ data: [] } as never);
        mockApiClient.posts.listPosts.mockResolvedValue({ data: [] } as never);

        const args = {
            request: new Request("https://example.com"),
            params: {},
            context: {
                cloudflare: {
                    env: {},
                },
            },
        } as unknown as LoaderFunctionArgs;

        const result = await loader(args);
        expect(result).toBeInstanceOf(Response);

        expect((result as Response).headers.get("Content-Type")).toBe("application/xml");
    });

    test("should handle empty portfolios and posts", async () => {
        mockApiClient.portfolios.listPortfolios.mockResolvedValue({ data: [] } as never);
        mockApiClient.posts.listPosts.mockResolvedValue({ data: [] } as never);

        const args = {
            request: new Request("https://example.com"),
            params: {},
            context: {
                cloudflare: {
                    env: {},
                },
            },
        } as unknown as LoaderFunctionArgs;

        const result = await loader(args);
        expect(result).toBeInstanceOf(Response);
        const text = await (result as Response).text();

        expect(text).toContain("<urlset");
        expect(text).toContain("</urlset>");
    });

    test("should handle API error", async () => {
        mockApiClient.portfolios.listPortfolios.mockRejectedValue(new Error("Network error"));

        const args = {
            request: new Request("https://example.com"),
            params: {},
            context: {
                cloudflare: {
                    env: {},
                },
            },
        } as unknown as LoaderFunctionArgs;

        await expect(loader(args)).rejects.toThrow();
    });
});
