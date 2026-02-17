import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { SidebarContent } from "./SidebarContent";

const createTestRouter = (pathname: string, onNavigate?: () => void) => {
    const rootRoute = createRootRoute({
        component: () => <SidebarContent location={{ pathname }} onNavigate={onNavigate} />,
    });

    const indexRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/",
        component: () => <div>Index</div>,
    });

    const postsRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/posts",
        component: () => <div>Posts</div>,
    });

    const portfoliosRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/portfolios",
        component: () => <div>Portfolios</div>,
    });

    const routeTree = rootRoute.addChildren([indexRoute, postsRoute, portfoliosRoute]);
    return createRouter({ routeTree });
};

describe("SidebarContent", () => {
    test("should render CMS title", async () => {
        const router = createTestRouter("/");
        render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getByText("CMS")).toBeInTheDocument();
        });
    });

    test("should render navigation items", async () => {
        const router = createTestRouter("/");
        render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
            expect(screen.getByText("Posts")).toBeInTheDocument();
            expect(screen.getByText("Portfolios")).toBeInTheDocument();
        });
    });

    test("should call onNavigate when link is clicked", async () => {
        const onNavigate = vi.fn();
        const router = createTestRouter("/", onNavigate);
        render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });

        const dashboardLink = screen.getByText("Dashboard").closest("a");
        dashboardLink?.click();

        expect(onNavigate).toHaveBeenCalled();
    });

    test("should highlight active navigation item", async () => {
        const router = createTestRouter("/posts");
        render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getByText("Posts")).toBeInTheDocument();
        });

        const postsLink = screen.getByText("Posts").closest("a");
        expect(postsLink).toHaveClass("bg-primary");
    });
});
