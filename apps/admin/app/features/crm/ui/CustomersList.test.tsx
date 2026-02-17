import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Customer } from "~/entities/customer";
import * as useCustomersModule from "../lib/useCustomers";
import { CustomersList } from "./CustomersList";

vi.mock("../lib/useCustomers");

const createTestRouter = () => {
    const rootRoute = createRootRoute();
    const customersRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/crm/customers",
        component: CustomersList,
    });

    const routeTree = rootRoute.addChildren([customersRoute]);
    return createRouter({ routeTree });
};

describe("CustomersList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render customers list header", async () => {
        vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
            customers: [],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createCustomer: vi.fn(),
            updateCustomer: vi.fn(),
            deleteCustomer: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/customers" as string });

        await waitFor(() => {
            expect(screen.getByText("Customers")).toBeInTheDocument();
            expect(screen.getByText("Manage your customer relationships")).toBeInTheDocument();
        });
    });

    test("should render new customer button", async () => {
        vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
            customers: [],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createCustomer: vi.fn(),
            updateCustomer: vi.fn(),
            deleteCustomer: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/customers" as string });

        await waitFor(() => {
            expect(screen.getByText("New Customer")).toBeInTheDocument();
        });
    });

    test("should display loading state", async () => {
        vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
            customers: [],
            loading: true,
            error: null,
            refetch: vi.fn(),
            createCustomer: vi.fn(),
            updateCustomer: vi.fn(),
            deleteCustomer: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/customers" as string });

        await waitFor(() => {
            expect(screen.getByText("Loading customers...")).toBeInTheDocument();
        });
    });

    test("should display error state", async () => {
        const error = new Error("Failed to fetch");
        vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
            customers: [],
            loading: false,
            error,
            refetch: vi.fn(),
            createCustomer: vi.fn(),
            updateCustomer: vi.fn(),
            deleteCustomer: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/customers" as string });

        await waitFor(() => {
            expect(screen.getByText(/Failed to load customers/)).toBeInTheDocument();
        });
    });

    test("should display empty state when no customers", async () => {
        vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
            customers: [],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createCustomer: vi.fn(),
            updateCustomer: vi.fn(),
            deleteCustomer: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/customers" as string });

        await waitFor(() => {
            expect(screen.getByText("No customers found")).toBeInTheDocument();
            expect(screen.getByText("Get started by adding your first customer")).toBeInTheDocument();
        });
    });

    test("should display customers", async () => {
        const mockCustomers: Customer[] = [
            {
                id: "1",
                name: "Test Customer",
                email: "test@example.com",
                company: "Test Company",
                status: "ACTIVE",
                createdAt: "2024-01-01",
                updatedAt: "2024-01-01",
            },
        ];

        vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
            customers: mockCustomers,
            loading: false,
            error: null,
            refetch: vi.fn(),
            createCustomer: vi.fn(),
            updateCustomer: vi.fn(),
            deleteCustomer: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/crm/customers" as string });

        await waitFor(() => {
            expect(screen.getByText("Test Customer")).toBeInTheDocument();
            expect(screen.getByText("test@example.com")).toBeInTheDocument();
            expect(screen.getByText("Test Company")).toBeInTheDocument();
            expect(screen.getByText("ACTIVE")).toBeInTheDocument();
        });
    });
});
