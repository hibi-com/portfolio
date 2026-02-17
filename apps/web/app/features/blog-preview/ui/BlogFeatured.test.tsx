import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import type { Post } from "~/entities/blog";
import { BlogFeatured } from "./BlogFeatured";

vi.mock("@remix-run/react", async () => {
    const actual = await vi.importActual("@remix-run/react");
    return {
        ...actual,
        Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
            <RouterLink to={to} {...props}>
                {children}
            </RouterLink>
        ),
    };
});

describe("BlogFeatured Component", () => {
    let mockPost: Post;

    beforeEach(() => {
        mockPost = {
            id: "test-id",
            slug: "test-post",
            title: "Test Post Title",
            date: "2024-01-01",
            imageTemp: "https://example.com/image.jpg",
            content: {
                html: "<p>Test content</p>",
            },
            sticky: true,
            tags: ["test", "featured"],
        };
    });

    test("should render blog featured post", () => {
        render(
            <MemoryRouter>
                <BlogFeatured post={mockPost} />
            </MemoryRouter>,
        );

        expect(screen.getByText("Test Post Title")).toBeInTheDocument();
    });

    test("should pass correct props to BlogPreview", () => {
        render(
            <MemoryRouter>
                <BlogFeatured post={mockPost} />
            </MemoryRouter>,
        );

        const link = screen.getByText("Test Post Title").closest("a");
        expect(link).toHaveAttribute("href", "/blog/test-post");
    });

    test("should apply custom className", () => {
        const { container } = render(
            <MemoryRouter>
                <BlogFeatured className="custom-class" post={mockPost} />
            </MemoryRouter>,
        );

        const link = container.querySelector(".custom-class");
        expect(link).toBeInTheDocument();
    });

    test("should render with featured flag set to true", () => {
        render(
            <MemoryRouter>
                <BlogFeatured post={mockPost} />
            </MemoryRouter>,
        );

        expect(screen.getByText("Test Post Title")).toBeInTheDocument();
    });

    test("should render image", () => {
        render(
            <MemoryRouter>
                <BlogFeatured post={mockPost} />
            </MemoryRouter>,
        );

        const image = screen.getByAltText("Test Post Title");
        expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    });

    test("should render date", () => {
        render(
            <MemoryRouter>
                <BlogFeatured post={mockPost} />
            </MemoryRouter>,
        );

        expect(screen.getByText(/01\/01\/2024/)).toBeInTheDocument();
    });
});
