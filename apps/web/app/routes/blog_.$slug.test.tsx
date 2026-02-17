import { createRouterWrapper } from "@portfolio/testing-vitest";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import BlogSlug, { links, meta } from "./blog_.$slug";

vi.mock("~/routes/api.blog.$slug", () => ({
    loader: vi.fn(),
}));

vi.mock("@remix-run/react", async () => {
    const actual = await vi.importActual("@remix-run/react");
    return {
        ...actual,
        useLoaderData: vi.fn(() => ({
            title: "Test Post",
            date: "2023-01-01",
            imageTemp: "/test.jpg",
            content: {
                raw: {
                    children: [],
                },
                html: "<p>Test content</p>",
            },
            images: {
                url: "/test.jpg",
            },
            intro: "Test intro",
        })),
    };
});

describe("blog_.$slug route", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render Blog_Slug component", () => {
        const wrapper = createRouterWrapper({ route: "/blog/test-post" });
        render(<BlogSlug />, { wrapper });

        expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    test("should render post title", () => {
        const wrapper = createRouterWrapper({ route: "/blog/test-post" });
        render(<BlogSlug />, { wrapper });

        const titles = screen.getAllByText("Test Post");
        expect(titles.length).toBeGreaterThan(0);
    });

    test("links function should return stylesheets", () => {
        const result = links();

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBeGreaterThan(0);
    });

    test("meta function should return correct metadata", () => {
        const result = meta({
            data: { title: "Test Post", intro: "Test intro" },
        } as Parameters<typeof meta>[0]);

        expect(result).toBeInstanceOf(Array);
        const titleItem = result.find((item): item is { title: string } => "title" in item);
        expect(titleItem?.title).toBe("Test Post");
    });

    test("meta function should handle missing data", () => {
        const result = meta({ data: undefined } as Parameters<typeof meta>[0]);

        expect(result).toBeInstanceOf(Array);
        const titleItem = result.find((item): item is { title: string } => "title" in item);
        expect(titleItem?.title).toBe("Blog | Post not found!");
    });
});
