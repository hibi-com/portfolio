import type { Post } from "@portfolio/api";
import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import * as usePostsModule from "../lib/usePosts";
import { PostsList } from "./PostsList";

vi.mock("../lib/usePosts");

const createTestRouter = () => {
    const rootRoute = createRootRoute();
    const postsRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/posts",
        component: PostsList,
    });

    const routeTree = rootRoute.addChildren([postsRoute]);
    return createRouter({ routeTree });
};

describe("PostsList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render posts list header", async () => {
        vi.mocked(usePostsModule.usePosts).mockReturnValue({
            posts: [],
            loading: false,
            error: null,
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/posts" });

        await waitFor(() => {
            expect(screen.getByText("Posts")).toBeInTheDocument();
            expect(screen.getByText("Manage your blog posts")).toBeInTheDocument();
        });
    });

    test("should render new post button", async () => {
        vi.mocked(usePostsModule.usePosts).mockReturnValue({
            posts: [],
            loading: false,
            error: null,
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/posts" });

        await waitFor(() => {
            expect(screen.getByText("New Post")).toBeInTheDocument();
        });
    });

    test("should display loading state", async () => {
        vi.mocked(usePostsModule.usePosts).mockReturnValue({
            posts: [],
            loading: true,
            error: null,
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/posts" });

        await waitFor(() => {
            expect(screen.getByText("Loading posts...")).toBeInTheDocument();
        });
    });

    test("should display error state", async () => {
        const error = new Error("Failed to fetch");
        vi.mocked(usePostsModule.usePosts).mockReturnValue({
            posts: [],
            loading: false,
            error,
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/posts" });

        await waitFor(() => {
            expect(screen.getByText(/Failed to load posts/)).toBeInTheDocument();
        });
    });

    test("should display empty state when no posts", async () => {
        vi.mocked(usePostsModule.usePosts).mockReturnValue({
            posts: [],
            loading: false,
            error: null,
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/posts" });

        await waitFor(() => {
            expect(screen.getByText("No posts found")).toBeInTheDocument();
            expect(screen.getByText("Get started by creating your first post")).toBeInTheDocument();
        });
    });

    test("should display posts", async () => {
        const mockPosts: Post[] = [
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

        vi.mocked(usePostsModule.usePosts).mockReturnValue({
            posts: mockPosts,
            loading: false,
            error: null,
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/posts" });

        await waitFor(() => {
            expect(screen.getByText("Test Post")).toBeInTheDocument();
        });
    });
});
