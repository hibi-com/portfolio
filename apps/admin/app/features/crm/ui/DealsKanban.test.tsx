import type { Deal, Pipeline } from "@portfolio/api";
import "@testing-library/jest-dom/vitest";
import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import * as useDealsModule from "../lib/useDeals";
import { DealsKanban } from "./DealsKanban";

vi.mock("../lib/useDeals");

const createTestRouter = () => {
    const rootRoute = createRootRoute();
    const dealsRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/crm/deals",
        component: DealsKanban,
    });

    const routeTree = rootRoute.addChildren([dealsRoute]);
    return createRouter({ routeTree });
};

describe("DealsKanban", () => {
    const mockPipeline: Pipeline = {
        id: "pipeline-1",
        name: "Sales Pipeline",
        isDefault: true,
        stages: [
            { id: "stage-1", pipelineId: "pipeline-1", name: "New", order: 1, color: "#3b82f6" },
            { id: "stage-2", pipelineId: "pipeline-1", name: "Qualified", order: 2, color: "#22c55e" },
        ],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render deals kanban header", async () => {
        vi.mocked(useDealsModule.useDeals).mockReturnValue({
            deals: [],
            pipelines: [mockPipeline],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createDeal: vi.fn(),
            updateDeal: vi.fn(),
            deleteDeal: vi.fn(),
            moveToStage: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/deals" as string });

        await waitFor(() => {
            expect(screen.getByText("Deals")).toBeInTheDocument();
            expect(screen.getByText(/Manage your sales pipeline/)).toBeInTheDocument();
        });
    });

    test("should render new deal button", async () => {
        vi.mocked(useDealsModule.useDeals).mockReturnValue({
            deals: [],
            pipelines: [mockPipeline],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createDeal: vi.fn(),
            updateDeal: vi.fn(),
            deleteDeal: vi.fn(),
            moveToStage: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/deals" as string });

        await waitFor(() => {
            expect(screen.getByText("New Deal")).toBeInTheDocument();
        });
    });

    test("should display loading state", async () => {
        vi.mocked(useDealsModule.useDeals).mockReturnValue({
            deals: [],
            pipelines: [],
            loading: true,
            error: null,
            refetch: vi.fn(),
            createDeal: vi.fn(),
            updateDeal: vi.fn(),
            deleteDeal: vi.fn(),
            moveToStage: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/deals" as string });

        await waitFor(() => {
            expect(screen.getByText("Loading deals...")).toBeInTheDocument();
        });
    });

    test("should display error state", async () => {
        const error = new Error("Failed to fetch");
        vi.mocked(useDealsModule.useDeals).mockReturnValue({
            deals: [],
            pipelines: [],
            loading: false,
            error,
            refetch: vi.fn(),
            createDeal: vi.fn(),
            updateDeal: vi.fn(),
            deleteDeal: vi.fn(),
            moveToStage: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/deals" as string });

        await waitFor(() => {
            expect(screen.getByText(/Failed to load deals/)).toBeInTheDocument();
        });
    });

    test("should display no pipeline state", async () => {
        vi.mocked(useDealsModule.useDeals).mockReturnValue({
            deals: [],
            pipelines: [],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createDeal: vi.fn(),
            updateDeal: vi.fn(),
            deleteDeal: vi.fn(),
            moveToStage: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/deals" as string });

        await waitFor(() => {
            expect(screen.getByText("No Pipeline Found")).toBeInTheDocument();
        });
    });

    test("should display pipeline stages", async () => {
        vi.mocked(useDealsModule.useDeals).mockReturnValue({
            deals: [],
            pipelines: [mockPipeline],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createDeal: vi.fn(),
            updateDeal: vi.fn(),
            deleteDeal: vi.fn(),
            moveToStage: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/deals" as string });

        await waitFor(() => {
            expect(screen.getByText("New")).toBeInTheDocument();
            expect(screen.getByText("Qualified")).toBeInTheDocument();
        });
    });

    test("should display deals in stages", async () => {
        const mockDeals: Deal[] = [
            {
                id: "deal-1",
                name: "Test Deal",
                pipelineId: "pipeline-1",
                stageId: "stage-1",
                status: "OPEN",
                value: 10000,
                currency: "USD",
                createdAt: "2024-01-01",
                updatedAt: "2024-01-01",
            },
        ];

        vi.mocked(useDealsModule.useDeals).mockReturnValue({
            deals: mockDeals,
            pipelines: [mockPipeline],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createDeal: vi.fn(),
            updateDeal: vi.fn(),
            deleteDeal: vi.fn(),
            moveToStage: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/deals" as string });

        await waitFor(() => {
            expect(screen.getByText("Test Deal")).toBeInTheDocument();
            expect(screen.getByText(/10,000/)).toBeInTheDocument();
        });
    });
});
