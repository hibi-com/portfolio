import type { Inquiry } from "@portfolio/api";
import "@testing-library/jest-dom/vitest";
import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import * as useInquiriesModule from "../lib/useInquiries";
import { InquiriesList } from "./InquiriesList";

vi.mock("../lib/useInquiries");

const createTestRouter = () => {
    const rootRoute = createRootRoute();
    const inquiriesRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/support/inquiries",
        component: InquiriesList,
    });

    const routeTree = rootRoute.addChildren([inquiriesRoute]);
    return createRouter({ routeTree });
};

describe("InquiriesList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should render inquiries list header", async () => {
        vi.mocked(useInquiriesModule.useInquiries).mockReturnValue({
            inquiries: [],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createInquiry: vi.fn(),
            updateInquiry: vi.fn(),
            closeInquiry: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/support/inquiries" as string });

        await waitFor(() => {
            expect(screen.getByText("Support Inquiries")).toBeInTheDocument();
            expect(screen.getByText("Manage customer support tickets")).toBeInTheDocument();
        });
    });

    test("should render new inquiry button", async () => {
        vi.mocked(useInquiriesModule.useInquiries).mockReturnValue({
            inquiries: [],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createInquiry: vi.fn(),
            updateInquiry: vi.fn(),
            closeInquiry: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/support/inquiries" as string });

        await waitFor(() => {
            expect(screen.getByText("New Inquiry")).toBeInTheDocument();
        });
    });

    test("should display loading state", async () => {
        vi.mocked(useInquiriesModule.useInquiries).mockReturnValue({
            inquiries: [],
            loading: true,
            error: null,
            refetch: vi.fn(),
            createInquiry: vi.fn(),
            updateInquiry: vi.fn(),
            closeInquiry: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/support/inquiries" as string });

        await waitFor(() => {
            expect(screen.getByText("Loading inquiries...")).toBeInTheDocument();
        });
    });

    test("should display error state", async () => {
        const error = new Error("Failed to fetch");
        vi.mocked(useInquiriesModule.useInquiries).mockReturnValue({
            inquiries: [],
            loading: false,
            error,
            refetch: vi.fn(),
            createInquiry: vi.fn(),
            updateInquiry: vi.fn(),
            closeInquiry: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/support/inquiries" as string });

        await waitFor(() => {
            expect(screen.getByText(/Failed to load inquiries/)).toBeInTheDocument();
        });
    });

    test("should display empty state when no inquiries", async () => {
        vi.mocked(useInquiriesModule.useInquiries).mockReturnValue({
            inquiries: [],
            loading: false,
            error: null,
            refetch: vi.fn(),
            createInquiry: vi.fn(),
            updateInquiry: vi.fn(),
            closeInquiry: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/support/inquiries" as string });

        await waitFor(() => {
            expect(screen.getByText("No inquiries found")).toBeInTheDocument();
            expect(screen.getByText("No support tickets have been submitted yet")).toBeInTheDocument();
        });
    });

    test("should display inquiries", async () => {
        const mockInquiries: Inquiry[] = [
            {
                id: "1",
                subject: "Test Inquiry",
                content: "Test content",
                category: "SUPPORT",
                status: "OPEN",
                priority: "HIGH",
                createdAt: "2024-01-01",
                updatedAt: "2024-01-01",
            },
        ];

        vi.mocked(useInquiriesModule.useInquiries).mockReturnValue({
            inquiries: mockInquiries,
            loading: false,
            error: null,
            refetch: vi.fn(),
            createInquiry: vi.fn(),
            updateInquiry: vi.fn(),
            closeInquiry: vi.fn(),
        });

        const router = createTestRouter();
        render(<RouterProvider router={router} />);
        await router.navigate({ to: "/support/inquiries" as string });

        await waitFor(() => {
            expect(screen.getByText("Test Inquiry")).toBeInTheDocument();
            expect(screen.getByText("HIGH")).toBeInTheDocument();
            expect(screen.getByText("OPEN")).toBeInTheDocument();
        });
    });
});
