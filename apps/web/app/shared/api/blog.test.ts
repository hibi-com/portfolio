import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import type { Post } from "~/entities/blog";
import type { LoaderData } from "./blog";
import { loader } from "./blog";

vi.mock("~/shared/lib/api", () => ({
    createApiClient: vi.fn(),
}));

describe("blog api", () => {
    const mockApiClient = {
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

    test("should return posts and tags", async () => {
        const mockPosts: Post[] = [
            {
                id: "1",
                title: "Test Post",
                slug: "test-post",
                date: "2023-01-01",
                content: {
                    html: "Test content",
                },
                tags: ["Technical"],
                sticky: false,
                imageTemp: "",
                createdAt: "2023-01-01",
                updatedAt: "2023-01-01",
            },
        ];

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

        expect(result).toBeDefined();
        const jsonResult = await (result as Response).json();
        expect((jsonResult as LoaderData).posts).toBeInstanceOf(Array);
        expect((jsonResult as LoaderData).tags).toBeInstanceOf(Array);
        expect((jsonResult as LoaderData).tags).toEqual(["Technical"]);
    });

    test("should throw 404 if no posts found", async () => {
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

        try {
            await loader(args);
            expect.fail("Expected Response to be thrown");
        } catch (error) {
            expect(error).toBeInstanceOf(Response);
            const response = error as Response;
            expect(response.status).toBe(404);
            const text = await response.text();
            expect(text).toBe("Blog posts not found");
        }
    });

    test("should sort tags alphabetically", async () => {
        const mockPosts: Post[] = [
            {
                id: "1",
                title: "Test Post",
                slug: "test-post",
                date: "2023-01-01",
                content: {
                    html: "Test content",
                },
                tags: ["Technical", "DIY", "Blog"],
                sticky: false,
                imageTemp: "",
                createdAt: "2023-01-01",
                updatedAt: "2023-01-01",
            },
        ];

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
        const jsonResult = await (result as Response).json();

        expect((jsonResult as LoaderData).tags).toEqual(["Blog", "DIY", "Technical"]);
    });

    test("should handle API error", async () => {
        mockApiClient.posts.listPosts.mockRejectedValue(new Error("Network error"));

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
