import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import type { Portfolio } from "./api.portfolio.$slug";
import { loader } from "./api.portfolio.$slug";

vi.mock("~/shared/lib/api", () => ({
    createApiClient: vi.fn(),
}));

describe("api.portfolio.$slug", () => {
    const mockApiClient = {
        portfolios: {
            getPortfolioBySlug: vi.fn(),
        },
    };

    beforeEach(async () => {
        vi.clearAllMocks();
        const { createApiClient } = await import("~/shared/lib/api");
        vi.mocked(createApiClient).mockReturnValue(
            mockApiClient as unknown as ReturnType<typeof import("~/shared/lib/api").createApiClient>,
        );
    });

    test("should return portfolio data for valid slug", async () => {
        const mockPortfolio: Portfolio = {
            company: "Test Company",
            content: {
                html: "<p>Test content</p>",
            },
            id: "1",
            images: [{ url: "https://example.com/image.jpg" }],
            intro: "Test intro",
            slug: "test-portfolio",
            title: "Test Portfolio",
            date: "2023-01-01",
            current: false,
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
        };

        mockApiClient.portfolios.getPortfolioBySlug.mockResolvedValue({ data: mockPortfolio } as never);

        const args = {
            request: new Request("https://example.com"),
            params: { slug: "test-portfolio" },
            context: {
                cloudflare: {
                    env: {},
                },
            },
        } as unknown as LoaderFunctionArgs;

        const result = await loader(args);
        const jsonResult = await (result as Response).json();

        expect(jsonResult).toEqual(mockPortfolio);
    });

    test("should throw 400 for invalid slug", async () => {
        const args = {
            request: new Request("https://example.com"),
            params: { slug: "invalid_slug" },
            context: {
                cloudflare: {
                    env: {},
                },
            },
        } as unknown as LoaderFunctionArgs;

        try {
            await loader(args);
            expect.fail("Expected Response to be thrown");
        } catch (error) {
            expect(error).toBeInstanceOf(Response);
            const response = error as Response;
            expect(response.status).toBe(400);
            const text = await response.text();
            expect(text).toBe("Invalid slug parameter");
        }
    });

    test("should throw 404 when portfolio is not found", async () => {
        mockApiClient.portfolios.getPortfolioBySlug.mockResolvedValue({ data: null } as never);

        const args = {
            request: new Request("https://example.com"),
            params: { slug: "non-existent-portfolio" },
            context: {
                cloudflare: {
                    env: {},
                },
            },
        } as unknown as LoaderFunctionArgs;

        await expect(loader(args)).rejects.toThrow();
    });

    test("should throw 400 when slug is missing", async () => {
        const args = {
            request: new Request("https://example.com"),
            params: {},
            context: {
                cloudflare: {
                    env: {},
                },
            },
        } as unknown as LoaderFunctionArgs;

        try {
            await loader(args);
            expect.fail("Expected Response to be thrown");
        } catch (error) {
            expect(error).toBeInstanceOf(Response);
            const response = error as Response;
            expect(response.status).toBe(400);
            const text = await response.text();
            expect(text).toBe("Invalid slug parameter");
        }
    });

    test("should handle API error", async () => {
        mockApiClient.portfolios.getPortfolioBySlug.mockRejectedValue(new Error("Network error"));

        const args = {
            request: new Request("https://example.com"),
            params: { slug: "test-portfolio" },
            context: {
                cloudflare: {
                    env: {},
                },
            },
        } as unknown as LoaderFunctionArgs;

        await expect(loader(args)).rejects.toThrow();
    });
});
