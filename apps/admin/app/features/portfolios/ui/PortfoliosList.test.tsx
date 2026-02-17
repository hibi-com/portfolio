import type { Portfolio } from "@portfolio/api";
import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import * as usePortfoliosModule from "../lib/usePortfolios";
import { PortfoliosList } from "./PortfoliosList";

vi.mock("../lib/usePortfolios");

const createTestRouter = () => {
    const rootRoute = createRootRoute();
    const portfoliosRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/portfolios",
        component: PortfoliosList,
    });

    const routeTree = rootRoute.addChildren([portfoliosRoute]);
    return createRouter({ routeTree });
};

describe("PortfoliosList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render portfolios list header", async () => {
        vi.mocked(usePortfoliosModule.usePortfolios).mockReturnValue({
            portfolios: [],
            loading: false,
            error: null,
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/portfolios" });

        await waitFor(() => {
            expect(screen.getByText("Portfolios")).toBeInTheDocument();
            expect(screen.getByText("Manage your portfolio items")).toBeInTheDocument();
        });
    });

    test("should render new portfolio button", async () => {
        vi.mocked(usePortfoliosModule.usePortfolios).mockReturnValue({
            portfolios: [],
            loading: false,
            error: null,
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/portfolios" });

        await waitFor(() => {
            expect(screen.getByText("New Portfolio")).toBeInTheDocument();
        });
    });

    test("should display loading state", async () => {
        vi.mocked(usePortfoliosModule.usePortfolios).mockReturnValue({
            portfolios: [],
            loading: true,
            error: null,
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/portfolios" });

        await waitFor(() => {
            expect(screen.getByText("Loading portfolios...")).toBeInTheDocument();
        });
    });

    test("should display error state", async () => {
        const error = new Error("Failed to fetch");
        vi.mocked(usePortfoliosModule.usePortfolios).mockReturnValue({
            portfolios: [],
            loading: false,
            error,
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/portfolios" });

        await waitFor(() => {
            expect(screen.getByText(/Failed to load portfolios/)).toBeInTheDocument();
        });
    });

    test("should display empty state when no portfolios", async () => {
        vi.mocked(usePortfoliosModule.usePortfolios).mockReturnValue({
            portfolios: [],
            loading: false,
            error: null,
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/portfolios" });

        await waitFor(() => {
            expect(screen.getByText("No portfolios found")).toBeInTheDocument();
            expect(screen.getByText("Get started by creating your first portfolio item")).toBeInTheDocument();
        });
    });

    test("should display portfolios", async () => {
        const mockPortfolios: Portfolio[] = [
            {
                id: "1",
                title: "Test Portfolio",
                slug: "test-portfolio",
                company: "Test Company",
                date: "2024-01-01",
                current: false,
            },
        ];

        vi.mocked(usePortfoliosModule.usePortfolios).mockReturnValue({
            portfolios: mockPortfolios,
            loading: false,
            error: null,
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/portfolios" });

        await waitFor(() => {
            expect(screen.getByText("Test Portfolio")).toBeInTheDocument();
            expect(screen.getByText("Test Company")).toBeInTheDocument();
        });
    });
});
