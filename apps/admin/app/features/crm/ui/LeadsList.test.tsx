import type { Lead } from "@portfolio/api";
import "@testing-library/jest-dom/vitest";
import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import * as useLeadsModule from "../lib/useLeads";
import { LeadsList } from "./LeadsList";

vi.mock("../lib/useLeads");

const createTestRouter = () => {
    const rootRoute = createRootRoute();
    const leadsRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/crm/leads",
        component: LeadsList,
    });

    const routeTree = rootRoute.addChildren([leadsRoute]);
    return createRouter({ routeTree });
};

describe("LeadsList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render leads list header", async () => {
        vi.mocked(useLeadsModule.useLeads).mockReturnValue({
            leads: [],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createLead: vi.fn(),
            updateLead: vi.fn(),
            deleteLead: vi.fn(),
            convertLead: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/leads" as string });

        await waitFor(() => {
            expect(screen.getByText("Leads")).toBeInTheDocument();
            expect(screen.getByText("Track and manage potential customers")).toBeInTheDocument();
        });
    });

    test("should render new lead button", async () => {
        vi.mocked(useLeadsModule.useLeads).mockReturnValue({
            leads: [],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createLead: vi.fn(),
            updateLead: vi.fn(),
            deleteLead: vi.fn(),
            convertLead: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/leads" as string });

        await waitFor(() => {
            expect(screen.getByText("New Lead")).toBeInTheDocument();
        });
    });

    test("should display loading state", async () => {
        vi.mocked(useLeadsModule.useLeads).mockReturnValue({
            leads: [],
            loading: true,
            error: null,
            refetch: vi.fn(),
            createLead: vi.fn(),
            updateLead: vi.fn(),
            deleteLead: vi.fn(),
            convertLead: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/leads" as string });

        await waitFor(() => {
            expect(screen.getByText("Loading leads...")).toBeInTheDocument();
        });
    });

    test("should display error state", async () => {
        const error = new Error("Failed to fetch");
        vi.mocked(useLeadsModule.useLeads).mockReturnValue({
            leads: [],
            loading: false,
            error,
            refetch: vi.fn(),
            createLead: vi.fn(),
            updateLead: vi.fn(),
            deleteLead: vi.fn(),
            convertLead: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/leads" as string });

        await waitFor(() => {
            expect(screen.getByText(/Failed to load leads/)).toBeInTheDocument();
        });
    });

    test("should display empty state when no leads", async () => {
        vi.mocked(useLeadsModule.useLeads).mockReturnValue({
            leads: [],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createLead: vi.fn(),
            updateLead: vi.fn(),
            deleteLead: vi.fn(),
            convertLead: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/leads" as string });

        await waitFor(() => {
            expect(screen.getByText("No leads found")).toBeInTheDocument();
            expect(screen.getByText("Start by adding your first lead")).toBeInTheDocument();
        });
    });

    test("should display leads", async () => {
        const mockLeads: Lead[] = [
            {
                id: "1",
                name: "Test Lead",
                email: "lead@example.com",
                company: "Test Company",
                source: "Website",
                status: "NEW",
                score: 75,
                createdAt: "2024-01-01",
                updatedAt: "2024-01-01",
            },
        ];

        vi.mocked(useLeadsModule.useLeads).mockReturnValue({
            leads: mockLeads,
            loading: false,
            error: null,
            refetch: vi.fn(),
            createLead: vi.fn(),
            updateLead: vi.fn(),
            deleteLead: vi.fn(),
            convertLead: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/leads" as string });

        await waitFor(() => {
            expect(screen.getByText("Test Lead")).toBeInTheDocument();
            expect(screen.getByText("lead@example.com")).toBeInTheDocument();
            expect(screen.getByText("Test Company")).toBeInTheDocument();
            expect(screen.getByText("NEW")).toBeInTheDocument();
            expect(screen.getByText("75")).toBeInTheDocument();
        });
    });
});
