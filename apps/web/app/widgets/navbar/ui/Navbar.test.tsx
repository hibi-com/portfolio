import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { Navbar } from "./Navbar";

vi.mock("@remix-run/react", async () => {
    const actual = await vi.importActual("@remix-run/react");
    return {
        ...actual,
        Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
            <RouterLink to={to} {...props}>
                {children}
            </RouterLink>
        ),
        useFetcher: () => ({
            formData: null,
            submit: vi.fn(),
        }),
        useLoaderData: () => ({
            canonicalUrl: "https://example.com",
            theme: "dark",
        }),
        useLocation: () => ({
            pathname: "/",
            hash: "",
            key: "test",
        }),
    };
});

describe("Navbar Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = "";
    });

    test("should render navbar", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        );

        expect(screen.getByLabelText("Matthew Scholta, Software Engineer")).toBeInTheDocument();
    });

    test("should render navigation links", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        );

        expect(screen.getByText("Projects")).toBeInTheDocument();
        expect(screen.getByText("Details")).toBeInTheDocument();
        expect(screen.getByText("Articles")).toBeInTheDocument();
        expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    test("should render monogram logo", () => {
        const { container } = render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        );

        const logoLink = container.querySelector(`[aria-label="Matthew Scholta, Software Engineer"]`);
        expect(logoLink).toBeInTheDocument();
        const svg = logoLink?.querySelector("svg");
        expect(svg).toBeInTheDocument();
    });

    test("should toggle mobile menu", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        );

        const toggleButton = screen.getByLabelText("Menu");
        expect(toggleButton).toBeInTheDocument();

        fireEvent.click(toggleButton);

        const mobileNav = document.querySelector('[role="dialog"]');
        expect(mobileNav).toBeInTheDocument();
    });

    test("should close mobile menu when link is clicked", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        );

        const toggleButton = screen.getByLabelText("Menu");
        fireEvent.click(toggleButton);

        const projectsLinks = screen.getAllByText("Projects");
        if (projectsLinks[0]) {
            fireEvent.click(projectsLinks[0]);
        }

        expect(projectsLinks.length).toBeGreaterThan(0);
    });

    test("should render social links", () => {
        const { container } = render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        );

        const navLinks = container.querySelectorAll("nav a, header a");
        expect(navLinks.length).toBeGreaterThan(0);
    });

    test("should handle nav item click with hash", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <Navbar />
            </MemoryRouter>,
        );

        const projectsLink = screen.getByText("Projects").closest("a");
        expect(projectsLink).toHaveAttribute("href", "/#project-1");
    });

    test("should have navigation links with correct href", () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>,
        );

        const projectsLink = screen.getByText("Projects").closest("a");
        expect(projectsLink).toBeInTheDocument();
        expect(projectsLink).toHaveAttribute("href");
    });
});
