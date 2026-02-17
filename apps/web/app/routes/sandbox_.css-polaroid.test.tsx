import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import SandboxCSSPolaroid, { meta } from "./sandbox_.css-polaroid";

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

describe("sandbox_.css-polaroid route", () => {
    test("should render Sandbox_CSSPolaroid component", () => {
        render(
            <MemoryRouter initialEntries={["/sandbox/css-polaroid"]}>
                <SandboxCSSPolaroid />
            </MemoryRouter>,
        );

        expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    test("should render hero section", () => {
        render(
            <MemoryRouter initialEntries={["/sandbox/css-polaroid"]}>
                <SandboxCSSPolaroid />
            </MemoryRouter>,
        );

        expect(screen.getByText(/CSS Polaroid Camera/i)).toBeInTheDocument();
    });

    test("meta function should return correct metadata", () => {
        const result = meta({} as Parameters<typeof meta>[0]);

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Array);
        const titleItem = result?.find((item): item is { title: string } => "title" in item);
        expect(titleItem?.title).toBeDefined();
    });
});
