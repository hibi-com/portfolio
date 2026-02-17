import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { Footer } from "./Footer";

const mockUseLocation = vi.fn();

vi.mock("@remix-run/react", async () => {
    const actual = await vi.importActual("@remix-run/react");
    return {
        ...actual,
        Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => (
            <RouterLink to={to} {...props}>
                {children}
            </RouterLink>
        ),
        useLocation: () => mockUseLocation(),
    };
});

describe("Footer Component", () => {
    beforeEach(() => {
        mockUseLocation.mockReturnValue({
            pathname: "/",
            hash: "",
            key: "test",
            search: "",
            state: null,
        });
    });

    test("should render footer with social links", () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>,
        );

        expect(screen.getByAltText("Follow me on LinkedIn")).toBeInTheDocument();
        expect(screen.getByAltText("Follow me on GitHub")).toBeInTheDocument();
        expect(screen.getByAltText("Follow me on Twitter")).toBeInTheDocument();
    });

    test("should render footer text", () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>,
        );

        expect(screen.getByText(/Built with/)).toBeInTheDocument();
        expect(screen.getByText(/San Diego/)).toBeInTheDocument();
    });

    test("should not render footer on resume page", () => {
        mockUseLocation.mockReturnValue({
            pathname: "/resume",
            hash: "",
            key: "test",
            search: "",
            state: null,
        });

        render(
            <MemoryRouter initialEntries={["/resume"]}>
                <Footer />
            </MemoryRouter>,
        );

        expect(screen.queryByAltText("Follow me on LinkedIn")).not.toBeInTheDocument();
        expect(screen.queryByText(/Built with/)).not.toBeInTheDocument();
    });

    test("should render footer on non-resume pages", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <Footer />
            </MemoryRouter>,
        );

        expect(screen.getByAltText("Follow me on LinkedIn")).toBeInTheDocument();
    });

    test("should have correct social link attributes", () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>,
        );

        const linkedinLink = screen.getByAltText("Follow me on LinkedIn").closest("a");
        const githubLink = screen.getByAltText("Follow me on GitHub").closest("a");
        const twitterLink = screen.getByAltText("Follow me on Twitter").closest("a");

        expect(linkedinLink).toHaveAttribute("target", "_blank");
        expect(linkedinLink).toHaveAttribute("rel", "noreferrer");
        expect(githubLink).toHaveAttribute("target", "_blank");
        expect(githubLink).toHaveAttribute("rel", "noreferrer");
        expect(twitterLink).toHaveAttribute("target", "_blank");
        expect(twitterLink).toHaveAttribute("rel", "noreferrer");
    });

    test("should not render footer on resume sub-pages", () => {
        mockUseLocation.mockReturnValue({
            pathname: "/resume/something",
            hash: "",
            key: "test",
            search: "",
            state: null,
        });

        render(
            <MemoryRouter initialEntries={["/resume/something"]}>
                <Footer />
            </MemoryRouter>,
        );

        expect(screen.queryByAltText("Follow me on LinkedIn")).not.toBeInTheDocument();
    });
});
