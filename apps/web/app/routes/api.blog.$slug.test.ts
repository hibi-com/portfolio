import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import type { Post } from "./api.blog.$slug";
import { loader } from "./api.blog.$slug";

vi.mock("~/shared/lib/api", () => ({
    createApiClient: vi.fn(),
}));

describe("api.blog.$slug", () => {
    const mockApiClient = {
        posts: {
            getPostBySlug: vi.fn(),
        },
    };

    beforeEach(async () => {
        vi.clearAllMocks();
        const { createApiClient } = await import("~/shared/lib/api");
        vi.mocked(createApiClient).mockReturnValue(
            mockApiClient as unknown as ReturnType<typeof import("~/shared/lib/api").createApiClient>,
        );
    });

    test("should return post data for valid slug", async () => {
        const mockPost: Post = {
            content: {
                raw: {},
                html: "<p>Test content</p>",
            },
            createdAt: "2023-01-01T00:00:00Z",
            date: "2023-01-01",
            images: [{ url: "https://example.com/image.jpg" }],
            imageTemp: "",
            intro: "Test intro",
            tags: ["Technical"],
            title: "Test Post",
            updatedAt: "2023-01-01T00:00:00Z",
            id: "1",
            slug: "test-post",
            sticky: false,
        };

        mockApiClient.posts.getPostBySlug.mockResolvedValue({ data: mockPost } as never);

        const args = {
            request: new Request("https://example.com"),
            params: { slug: "test-post" },
            context: {
                cloudflare: {
                    env: {},
                },
            },
        } as unknown as LoaderFunctionArgs;

        const result = await loader(args);
        const jsonResult = await (result as Response).json();

        expect(jsonResult).toEqual(mockPost);
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

    test("should throw 404 when post is not found", async () => {
        mockApiClient.posts.getPostBySlug.mockResolvedValue({ data: null } as never);

        const args = {
            request: new Request("https://example.com"),
            params: { slug: "non-existent-post" },
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
        mockApiClient.posts.getPostBySlug.mockRejectedValue(new Error("Network error"));

        const args = {
            request: new Request("https://example.com"),
            params: { slug: "test-post" },
            context: {
                cloudflare: {
                    env: {},
                },
            },
        } as unknown as LoaderFunctionArgs;

        await expect(loader(args)).rejects.toThrow();
    });
});
