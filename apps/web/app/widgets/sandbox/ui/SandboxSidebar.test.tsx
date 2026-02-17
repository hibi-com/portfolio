import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import { describe, expect, test, vi } from "vitest";
import { SandboxSidebar } from "./SandboxSidebar";

vi.mock("@remix-run/react", async () => {
    const actual = await vi.importActual("@remix-run/react");
    return {
        ...actual,
        Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
            <RouterLink to={to} {...props}>
                {children}
            </RouterLink>
        ),
        NavLink: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
            <RouterLink to={to} {...props}>
                {children}
            </RouterLink>
        ),
    };
});

describe("SandboxSidebar Component", () => {
    test("should render sandbox sidebar", () => {
        render(
            <MemoryRouter>
                <SandboxSidebar />
            </MemoryRouter>,
        );

        expect(screen.getByText("Sandboxes")).toBeInTheDocument();
    });

    test("should render with default className", () => {
        const { container } = render(
            <MemoryRouter>
                <SandboxSidebar />
            </MemoryRouter>,
        );

        const sidebar = container.querySelector(".sandbox-sidebar");
        expect(sidebar).toBeInTheDocument();
    });

    test("should apply custom className", () => {
        const { container } = render(
            <MemoryRouter>
                <SandboxSidebar className="custom-class" />
            </MemoryRouter>,
        );

        const sidebar = container.querySelector(".sandbox-sidebar");
        expect(sidebar).toHaveClass("custom-class");
    });

    test("should render heading", () => {
        render(
            <MemoryRouter>
                <SandboxSidebar />
            </MemoryRouter>,
        );

        const heading = screen.getByRole("heading", { level: 3 });
        expect(heading).toHaveTextContent("Sandboxes");
    });
});
