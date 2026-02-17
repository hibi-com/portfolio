import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import { describe, expect, test, vi } from "vitest";
import { HeaderMobile } from "./HeaderMobile";

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
            <RouterLink to={to} {...props} onClick={onClick}>
                {children}
            </RouterLink>
        ),
    };
});

describe("HeaderMobile Component", () => {
    test("should render header with logo and toggle button", () => {
        render(
            <MemoryRouter>
                <HeaderMobile />
            </MemoryRouter>,
        );

        expect(screen.getByTitle("Toggle menu")).toBeInTheDocument();
        expect(screen.getByText("Home")).toBeInTheDocument();
    });

    test("should have closed state by default", () => {
        const { container } = render(
            <MemoryRouter>
                <HeaderMobile />
            </MemoryRouter>,
        );

        const header = container.querySelector(".header");
        expect(header).toHaveClass("closed");
    });

    test("should not show navigation when closed", () => {
        render(
            <MemoryRouter>
                <HeaderMobile />
            </MemoryRouter>,
        );

        expect(screen.queryByText("About")).not.toBeInTheDocument();
    });

    test("should show navigation when toggle button is clicked", () => {
        render(
            <MemoryRouter>
                <HeaderMobile />
            </MemoryRouter>,
        );

        const toggleButton = screen.getByTitle("Toggle menu");

        fireEvent.click(toggleButton);

        expect(screen.getByText("About")).toBeInTheDocument();
        expect(screen.getByText("Blog")).toBeInTheDocument();
        expect(screen.getByText("Portfolio")).toBeInTheDocument();
        expect(screen.getByText("Resume")).toBeInTheDocument();
        expect(screen.getByText("Uses")).toBeInTheDocument();
    });

    test("should hide navigation when toggle button is clicked again", () => {
        render(
            <MemoryRouter>
                <HeaderMobile />
            </MemoryRouter>,
        );

        const toggleButton = screen.getByTitle("Toggle menu");

        fireEvent.click(toggleButton);
        expect(screen.getByText("About")).toBeInTheDocument();

        fireEvent.click(toggleButton);
        expect(screen.queryByText("About")).not.toBeInTheDocument();
    });

    test("should close menu when navigation link is clicked", () => {
        render(
            <MemoryRouter>
                <HeaderMobile />
            </MemoryRouter>,
        );

        const toggleButton = screen.getByTitle("Toggle menu");
        fireEvent.click(toggleButton);

        const aboutLink = screen.getByText("About");
        fireEvent.click(aboutLink);

        expect(screen.queryByText("About")).not.toBeInTheDocument();
    });

    test("should render logo with link to home", () => {
        render(
            <MemoryRouter>
                <HeaderMobile />
            </MemoryRouter>,
        );

        const logoLink = screen.getByText("Home").closest("a");
        expect(logoLink).toHaveAttribute("href", "/");
    });

    test("should have correct navigation links", () => {
        render(
            <MemoryRouter>
                <HeaderMobile />
            </MemoryRouter>,
        );

        const toggleButton = screen.getByTitle("Toggle menu");
        fireEvent.click(toggleButton);

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
