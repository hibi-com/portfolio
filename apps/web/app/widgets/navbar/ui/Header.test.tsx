import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import { describe, expect, test, vi } from "vitest";
import { Header } from "./Header";

vi.mock("@remix-run/react", async () => {
    const actual = await vi.importActual("@remix-run/react");
    return {
        ...actual,
        Link: ({ to, children, prefetch, ...props }: { to: string; children: ReactNode; prefetch?: string }) => (
            <RouterLink to={to} {...props} data-prefetch={prefetch}>
                {children}
            </RouterLink>
        ),
        NavLink: ({
            to,
            children,
            prefetch,
            onClick,
            ...props
        }: {
            to: string;
            children: ReactNode;
            prefetch?: string;
            onClick?: () => void;
        }) => (
            <RouterLink
                to={to}
                {...props}
                prefetch={prefetch as "intent" | "render" | "viewport" | undefined}
                onClick={onClick}
            >
                {children}
            </RouterLink>
        ),
    };
});

describe("Header Component", () => {
    test("should render header with logo and navigation links", () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>,
        );

        expect(screen.getByText("About")).toBeInTheDocument();
        expect(screen.getByText("Blog")).toBeInTheDocument();
        expect(screen.getByText("Portfolio")).toBeInTheDocument();
        expect(screen.getByText("Resume")).toBeInTheDocument();
        expect(screen.getByText("Uses")).toBeInTheDocument();
    });

    test("should have closed state by default", () => {
        const { container } = render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>,
        );

        const header = container.querySelector(".header");
        expect(header).toHaveClass("closed");
    });

    test("should toggle menu when toggle button is clicked", () => {
        const { container } = render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>,
        );

        const toggleButton = screen.getByTitle("Toggle menu");
        const header = container.querySelector(".header");

        expect(header).toHaveClass("closed");

        fireEvent.click(toggleButton);
        expect(header).not.toHaveClass("closed");

        fireEvent.click(toggleButton);
        expect(header).toHaveClass("closed");
    });

    test("should close menu when navigation link is clicked", () => {
        const { container } = render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>,
        );

        const toggleButton = screen.getByTitle("Toggle menu");
        const aboutLink = screen.getByText("About");
        const header = container.querySelector(".header");

        fireEvent.click(toggleButton);
        expect(header).not.toHaveClass("closed");

        fireEvent.click(aboutLink);
        expect(header).toHaveClass("closed");
    });

    test("should render logo with link to home", () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>,
        );

        const logoLink = screen.getByText("Home").closest("a");
        expect(logoLink).toHaveAttribute("href", "/");
    });

    test("should have correct navigation links with prefetch", () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>,
        );

        const aboutLink = screen.getByText("About").closest("a");
        const blogLink = screen.getByText("Blog").closest("a");
        const portfolioLink = screen.getByText("Portfolio").closest("a");
        const resumeLink = screen.getByText("Resume").closest("a");
        const usesLink = screen.getByText("Uses").closest("a");

        expect(aboutLink).toHaveAttribute("href", "/");
        expect(blogLink).toHaveAttribute("href", "/blog");
        expect(portfolioLink).toHaveAttribute("href", "/portfolio");
        expect(resumeLink).toHaveAttribute("href", "/resume");
        expect(usesLink).toHaveAttribute("href", "/uses");
    });
});
