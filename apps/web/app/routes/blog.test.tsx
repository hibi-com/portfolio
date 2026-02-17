import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { filterBlogPosts } from "~/entities/blog/lib/filter-posts";
import Blog, { meta } from "./blog";

vi.mock("~/shared/api/portfolio", () => ({
    loader: vi.fn(),
}));

vi.mock("@remix-run/react", async () => {
    const actual = await vi.importActual("@remix-run/react");
    return {
        ...actual,
        Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
            <RouterLink to={to} {...props}>
                {children}
            </RouterLink>
        ),
        useLoaderData: vi.fn(() => ({
            posts: [
                {
                    id: "1",
                    title: "Featured Post",
                    slug: "featured-post",
                    date: "2023-01-01",
                    imageTemp: "/test.jpg",
                    tags: ["Technical"],
                    sticky: true,
                },
                {
                    id: "2",
                    title: "Test Post",
                    slug: "test-post",
                    date: "2023-01-02",
                    imageTemp: "/test2.jpg",
                    tags: ["Technical"],
                    sticky: false,
                },
            ],
            tags: ["Technical"],
        })),
    };
});

import type { Post } from "~/entities/blog/model/types";

vi.mock("~/entities/blog/lib/filter-posts", () => ({
    filterBlogPosts: vi.fn((posts: Post[]) => ({
        technical: {
            featured: posts.filter((p) => p.sticky && !p.tags.includes("DIY")),
            data: posts.filter((p) => !p.sticky && !p.tags.includes("DIY")),
        },
        diy: {
            featured: posts.filter((p) => p.sticky && p.tags.includes("DIY")),
            data: posts.filter((p) => !p.sticky && p.tags.includes("DIY")),
        },
    })),
}));

describe("blog route", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(filterBlogPosts).mockImplementation((posts: Post[]) => ({
            technical: {
                featured: posts.filter((p) => p.sticky && !p.tags.includes("DIY")),
                data: posts.filter((p) => !p.sticky && !p.tags.includes("DIY")),
            },
            diy: {
                featured: posts.filter((p) => p.sticky && p.tags.includes("DIY")),
                data: posts.filter((p) => !p.sticky && p.tags.includes("DIY")),
            },
        }));
    });

    test("should render Blog component", () => {
        render(
            <MemoryRouter initialEntries={["/blog"]}>
                <Blog />
            </MemoryRouter>,
        );

        expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    test("should render hero section", () => {
        render(
            <MemoryRouter initialEntries={["/blog"]}>
                <Blog />
            </MemoryRouter>,
        );

        expect(screen.getByText(/Yes, another blog/i)).toBeInTheDocument();
    });

    test("meta function should return correct metadata", () => {
        const result = meta({} as Parameters<typeof meta>[0]);

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        const titleItem = result?.find((item): item is { title: string } => "title" in item);
        expect(titleItem?.title).toBeDefined();
    });
});
