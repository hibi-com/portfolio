import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Link as RouterLink } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { ErrorPage } from "./Error";

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

describe("Error Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render 404 error", () => {
        const error = { status: 404, statusText: "Not Found" };
        render(
            <MemoryRouter>
                <ErrorPage error={error} />
            </MemoryRouter>,
        );

        expect(screen.getByText("404")).toBeInTheDocument();
        expect(screen.getByText(/This page could not be found/)).toBeInTheDocument();
        expect(screen.getByText("Back to homepage")).toBeInTheDocument();
    });

    test("should render 405 error", () => {
        const error = { status: 405, data: "Method not allowed" };
        render(
            <MemoryRouter>
                <ErrorPage error={error} />
            </MemoryRouter>,
        );

        expect(screen.getByText("405")).toBeInTheDocument();
        expect(screen.getByText("Method not allowed")).toBeInTheDocument();
        expect(screen.getByText("Error: method denied")).toBeInTheDocument();
    });

    test("should render default error", () => {
        const error = { status: 500, statusText: "Internal Server Error" };
        render(
            <MemoryRouter>
                <ErrorPage error={error} />
            </MemoryRouter>,
        );

        expect(screen.getByText("500")).toBeInTheDocument();
        expect(screen.getByText("Internal Server Error")).toBeInTheDocument();
        expect(screen.getByText("Error: anomaly")).toBeInTheDocument();
    });

    test("should render flatlined error when status is missing", () => {
        const error = {};
        render(
            <MemoryRouter>
                <ErrorPage error={error} />
            </MemoryRouter>,
        );

        expect(screen.getByText("Flatlined")).toBeInTheDocument();
        expect(screen.getByText("Emotional support")).toBeInTheDocument();
    });

    test("should render error with data property", () => {
        const error = { status: 500, data: "Custom error message" };
        render(
            <MemoryRouter>
                <ErrorPage error={error} />
            </MemoryRouter>,
        );

        expect(screen.getByText("Custom error message")).toBeInTheDocument();
    });

    test("should render error with toString fallback", () => {
        const error = { status: 500, toString: () => "String error" };
        render(
            <MemoryRouter>
                <ErrorPage error={error} />
            </MemoryRouter>,
        );

        expect(screen.getByText("String error")).toBeInTheDocument();
    });

    test("should have correct link attributes for 404", () => {
        const error = { status: 404 };
        render(
            <MemoryRouter>
                <ErrorPage error={error} />
            </MemoryRouter>,
        );

        const link = screen.getByText("Back to homepage").closest("a");
        expect(link).toHaveAttribute("href", "/");
    });

    test("should have correct link attributes for flatlined", () => {
        const error = {};
        render(
            <MemoryRouter>
                <ErrorPage error={error} />
            </MemoryRouter>,
        );

        const link = screen.getByText("Emotional support").closest("a");
        expect(link).toHaveAttribute("href", "https://www.youtube.com/watch?v=EuQzHGcsjlA");
    });

    test("should render video container", () => {
        const error = { status: 404 };
        const { container } = render(
            <MemoryRouter>
                <ErrorPage error={error} />
            </MemoryRouter>,
        );

        const errorContainer = container.querySelector("section");
        expect(errorContainer).toBeInTheDocument();
    });
});
