import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { BlogPreviewProps } from "../model/types";
import { BlogPreview } from "./BlogPreview";

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

describe("BlogPreview Component", () => {
    let props: BlogPreviewProps;

    beforeEach(() => {
        props = {
            date: "2020-01-01",
            image: "https://example.com/image.jpg",
            slug: "hello-world",
            title: "Hello World",
        };
    });

    test("should render blog preview", () => {
        render(
            <MemoryRouter>
                <BlogPreview {...props} />
            </MemoryRouter>,
        );

        expect(screen.getByText("Hello World")).toBeInTheDocument();
        expect(screen.getByText("01/01/2020")).toBeInTheDocument();
    });

    test("should render link with correct href", () => {
        render(
            <MemoryRouter>
                <BlogPreview {...props} />
            </MemoryRouter>,
        );

        const link = screen.getByText("Hello World").closest("a");
        expect(link).toHaveAttribute("href", "/blog/hello-world");
    });

    test("should render image with correct src", () => {
        render(
            <MemoryRouter>
                <BlogPreview {...props} />
            </MemoryRouter>,
        );

        const image = screen.getByAltText("Hello World");
        expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    });

    test("should apply custom className", () => {
        const { container } = render(
            <MemoryRouter>
                <BlogPreview {...props} className="custom-class" />
            </MemoryRouter>,
        );

        const link = container.querySelector(".custom-class");
        expect(link).toBeInTheDocument();
    });

    test("should render with custom heading", () => {
        render(
            <MemoryRouter>
                <BlogPreview {...props} heading="h2" />
            </MemoryRouter>,
        );

        const heading = screen.getByRole("heading", { level: 2 });
        expect(heading).toHaveTextContent("Hello World");
    });

    test("should render with default heading h3", () => {
        render(
            <MemoryRouter>
                <BlogPreview {...props} />
            </MemoryRouter>,
        );

        const heading = screen.getByRole("heading", { level: 3 });
        expect(heading).toHaveTextContent("Hello World");
    });

    test("should format date correctly", () => {
        render(
            <MemoryRouter>
                <BlogPreview {...props} date="2024-12-25" />
            </MemoryRouter>,
        );

        expect(screen.getByText(/12\/25\/2024/)).toBeInTheDocument();
    });

    test("should have prefetch intent", () => {
        render(
            <MemoryRouter>
                <BlogPreview {...props} />
            </MemoryRouter>,
        );

        const link = screen.getByText("Hello World").closest("a");
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href");
    });
});
