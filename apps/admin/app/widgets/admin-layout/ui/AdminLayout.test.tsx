import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { AdminLayout } from "./AdminLayout";

const createTestRouter = () => {
    const rootRoute = createRootRoute({
        component: () => (
            <div>
                <AdminLayout />
            </div>
        ),
    });

    const indexRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/",
        component: () => <div>Dashboard Content</div>,
    });

    const postsRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/posts",
        component: () => <div>Posts Content</div>,
    });

    const portfoliosRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/portfolios",
        component: () => <div>Portfolios Content</div>,
    });

    const routeTree = rootRoute.addChildren([indexRoute, postsRoute, portfoliosRoute]);
    return createRouter({ routeTree });
};

describe("AdminLayout", () => {
    test("should render admin layout", async () => {
        const router = createTestRouter();
        render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getAllByText("CMS").length).toBeGreaterThan(0);
            expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
        });
    });

    test("should render navigation items", async () => {
        const router = createTestRouter();
        render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getAllByText("Dashboard").length).toBeGreaterThan(0);
            expect(screen.getAllByText("Posts").length).toBeGreaterThan(0);
            expect(screen.getAllByText("Portfolios").length).toBeGreaterThan(0);
        });
    });

    test("should render mobile menu button", async () => {
        const router = createTestRouter();
        render(<RouterProvider router={router} />);

        await waitFor(() => {
            expect(screen.getAllByText("CMS").length).toBeGreaterThan(0);
        });

        const menuButtons = screen.getAllByRole("button");
        expect(menuButtons.length).toBeGreaterThan(0);
    });
});
