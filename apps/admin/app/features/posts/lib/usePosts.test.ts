import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { posts as postsApi } from "@portfolio/api";
import { usePosts } from "./usePosts";

vi.mock("@portfolio/api", () => ({
    posts: {
        list: vi.fn(),
    },
}));

describe("usePosts", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should initialize with empty posts and loading true", () => {
        vi.mocked(postsApi.list).mockResolvedValue({ data: [] } as never);

        const { result } = renderHook(() => usePosts());

        expect(result.current.posts).toEqual([]);
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();
    });

    test("should fetch and update posts", async () => {
        const mockPosts = [
            {
                id: "1",
                title: "Test Post",
                slug: "test-post",
                date: "2024-01-01",
                content: { html: "<p>Test</p>" },
                imageTemp: "/test.jpg",
                tags: [],
                sticky: false,
            },
        ];

        vi.mocked(postsApi.list).mockResolvedValue({ data: mockPosts } as never);

        const { result } = renderHook(() => usePosts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.posts).toEqual(mockPosts);
        expect(postsApi.list).toHaveBeenCalled();
    });

    test("should handle empty data", async () => {
        vi.mocked(postsApi.list).mockResolvedValue({ data: null } as never);

        const { result } = renderHook(() => usePosts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.posts).toEqual([]);
    });

    test("should handle errors", async () => {
        const error = new Error("Failed to fetch");
        vi.mocked(postsApi.list).mockRejectedValue(error);

        const { result } = renderHook(() => usePosts());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toContain("Failed to fetch");
        expect(result.current.posts).toEqual([]);
    });
});
