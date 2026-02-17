import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import type { Portfolio } from "~/entities/portfolio";
import { loader } from "./portfolio";

vi.mock("~/shared/lib/api", () => ({
    createApiClient: vi.fn(),
}));

describe("portfolio api", () => {
    const mockApiClient = {
        portfolios: {
            listPortfolios: vi.fn(),
        },
    };

    beforeEach(async () => {
        vi.clearAllMocks();
        const { createApiClient } = await import("~/shared/lib/api");
        vi.mocked(createApiClient).mockReturnValue(
            mockApiClient as unknown as ReturnType<typeof import("~/shared/lib/api").createApiClient>,
        );
    });

    test("should return portfolio items", async () => {
        const mockPortfolios: Portfolio[] = [
            {
                id: "1",
                title: "Test Portfolio",
                slug: "test-portfolio",
                company: "Test Company",
                current: false,
                date: "2023-01-01",
                description: "Test Description",
                images: [{ url: "https://example.com/image.jpg" }],
            },
        ];

        mockApiClient.portfolios.listPortfolios.mockResolvedValue({ data: mockPortfolios } as never);

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

        expect(result).toBeDefined();
        const jsonResult = await (result as Response).json();
        expect(jsonResult).toBeInstanceOf(Array);
        expect((jsonResult as Portfolio[]).length).toBe(1);
    });

    test("should throw 404 if no portfolios found", async () => {
        mockApiClient.portfolios.listPortfolios.mockResolvedValue({ data: [] } as never);

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
            expect(response.status).toBe(404);
            const text = await response.text();
            expect(text).toBe("Portfolio items not found");
        }
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
