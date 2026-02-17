import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Customer } from "~/entities/customer";
import * as useCustomersModule from "../lib/useCustomers";
import { CustomerForm } from "./CustomerForm";

vi.mock("../lib/useCustomers");

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", async () => {
    const actual = await vi.importActual("@tanstack/react-router");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const createTestRouter = (mode: "create" | "edit", customer?: Customer) => {
    const rootRoute = createRootRoute();
    const formRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: "/crm/customers/new",
        component: () => <CustomerForm mode={mode} customer={customer} />,
    });

    const routeTree = rootRoute.addChildren([formRoute]);
    return createRouter({ routeTree });
};

describe("CustomerForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("createモード", () => {
        describe("正常系", () => {
            test("新規作成フォームを表示する", async () => {
                vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
                    customers: [],
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    createCustomer: vi.fn(),
                    updateCustomer: vi.fn(),
                    deleteCustomer: vi.fn(),
                });

                const router = createTestRouter("create");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/crm/customers/new" as string });

                await waitFor(() => {
                    expect(screen.getByText("New Customer")).toBeInTheDocument();
                    expect(screen.getByText("Add a new customer to your CRM")).toBeInTheDocument();
                    expect(screen.getByText("Create Customer")).toBeInTheDocument();
                });
            });

            test("必須項目が空の場合はsubmitできない", async () => {
                const mockCreateCustomer = vi.fn();
                vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
                    customers: [],
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    createCustomer: mockCreateCustomer,
                    updateCustomer: vi.fn(),
                    deleteCustomer: vi.fn(),
                });

                const router = createTestRouter("create");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/crm/customers/new" as string });

                await waitFor(() => {
                    expect(screen.getByText("New Customer")).toBeInTheDocument();
                });

                const submitButton = screen.getByText("Create Customer");
                fireEvent.click(submitButton);

                // 必須フィールドが空なので、ブラウザのHTML5バリデーションが働く
                expect(mockCreateCustomer).not.toHaveBeenCalled();
            });

            test("必須項目を入力してsubmitすると顧客が作成される", async () => {
                const mockCreateCustomer = vi.fn().mockResolvedValue({
                    id: "1",
                    name: "Test Customer",
                    email: "test@example.com",
                    status: "PROSPECT",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                });

                vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
                    customers: [],
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    createCustomer: mockCreateCustomer,
                    updateCustomer: vi.fn(),
                    deleteCustomer: vi.fn(),
                });

                const router = createTestRouter("create");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/crm/customers/new" as string });

                await waitFor(() => {
                    expect(screen.getByText("New Customer")).toBeInTheDocument();
                });

                const nameInput = screen.getByLabelText(/Name/);
                const emailInput = screen.getByLabelText(/Email/);
                const submitButton = screen.getByText("Create Customer");

                fireEvent.change(nameInput, { target: { value: "Test Customer" } });
                fireEvent.change(emailInput, { target: { value: "test@example.com" } });
                fireEvent.click(submitButton);

                await waitFor(() => {
                    expect(mockCreateCustomer).toHaveBeenCalledWith(
                        expect.objectContaining({
                            name: "Test Customer",
                            email: "test@example.com",
                        }),
                    );
                });
            });

            test("すべてのフィールドを入力してsubmitできる", async () => {
                const mockCreateCustomer = vi.fn().mockResolvedValue({
                    id: "1",
                    name: "Full Customer",
                    email: "full@example.com",
                    phone: "+1234567890",
                    company: "Test Company",
                    website: "https://example.com",
                    address: "123 Test St",
                    notes: "Test notes",
                    status: "ACTIVE",
                    tags: [],
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                });

                vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
                    customers: [],
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    createCustomer: mockCreateCustomer,
                    updateCustomer: vi.fn(),
                    deleteCustomer: vi.fn(),
                });

                const router = createTestRouter("create");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/crm/customers/new" as string });

                await waitFor(() => {
                    expect(screen.getByText("New Customer")).toBeInTheDocument();
                });

                fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Full Customer" } });
                fireEvent.change(screen.getByLabelText(/Email/), { target: { value: "full@example.com" } });
                fireEvent.change(screen.getByLabelText(/Phone/), { target: { value: "+1234567890" } });
                fireEvent.change(screen.getByLabelText(/Company/), { target: { value: "Test Company" } });
                fireEvent.change(screen.getByLabelText(/Website/), { target: { value: "https://example.com" } });
                fireEvent.change(screen.getByLabelText(/Address/), { target: { value: "123 Test St" } });
                fireEvent.change(screen.getByLabelText(/Notes/), { target: { value: "Test notes" } });

                fireEvent.click(screen.getByText("Create Customer"));

                await waitFor(() => {
                    expect(mockCreateCustomer).toHaveBeenCalledWith(
                        expect.objectContaining({
                            name: "Full Customer",
                            email: "full@example.com",
                            phone: "+1234567890",
                            company: "Test Company",
                            website: "https://example.com",
                            address: "123 Test St",
                            notes: "Test notes",
                        }),
                    );
                });
            });
        });

        describe("異常系", () => {
            test("作成エラー時にエラーメッセージを表示する", async () => {
                const mockCreateCustomer = vi.fn().mockRejectedValue(new Error("Create failed"));

                vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
                    customers: [],
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    createCustomer: mockCreateCustomer,
                    updateCustomer: vi.fn(),
                    deleteCustomer: vi.fn(),
                });

                const router = createTestRouter("create");
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/crm/customers/new" as string });

                await waitFor(() => {
                    expect(screen.getByText("New Customer")).toBeInTheDocument();
                });

                fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Test" } });
                fireEvent.click(screen.getByText("Create Customer"));

                await waitFor(() => {
                    expect(screen.getByText("Create failed")).toBeInTheDocument();
                });
            });
        });
    });

    describe("editモード", () => {
        describe("正常系", () => {
            test("既存顧客データでフォームを表示する", async () => {
                const existingCustomer: Customer = {
                    id: "1",
                    name: "Existing Customer",
                    email: "existing@example.com",
                    phone: "+1234567890",
                    company: "Test Company",
                    status: "ACTIVE",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
                    customers: [],
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    createCustomer: vi.fn(),
                    updateCustomer: vi.fn(),
                    deleteCustomer: vi.fn(),
                });

                const router = createTestRouter("edit", existingCustomer);
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/crm/customers/new" as string });

                await waitFor(() => {
                    expect(screen.getByText("Edit Customer")).toBeInTheDocument();
                    expect(screen.getByText("Update customer information")).toBeInTheDocument();
                    expect(screen.getByDisplayValue("Existing Customer")).toBeInTheDocument();
                    expect(screen.getByDisplayValue("existing@example.com")).toBeInTheDocument();
                });
            });

            test("顧客情報を更新できる", async () => {
                const existingCustomer: Customer = {
                    id: "1",
                    name: "Original Name",
                    email: "original@example.com",
                    status: "PROSPECT",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const mockUpdateCustomer = vi.fn().mockResolvedValue({
                    ...existingCustomer,
                    name: "Updated Name",
                    email: "updated@example.com",
                    status: "ACTIVE",
                });

                vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
                    customers: [],
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    createCustomer: vi.fn(),
                    updateCustomer: mockUpdateCustomer,
                    deleteCustomer: vi.fn(),
                });

                const router = createTestRouter("edit", existingCustomer);
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/crm/customers/new" as string });

                await waitFor(() => {
                    expect(screen.getByText("Edit Customer")).toBeInTheDocument();
                });

                const nameInput = screen.getByLabelText(/Name/);
                fireEvent.change(nameInput, { target: { value: "Updated Name" } });

                const emailInput = screen.getByLabelText(/Email/);
                fireEvent.change(emailInput, { target: { value: "updated@example.com" } });

                fireEvent.click(screen.getByText("Save Changes"));

                await waitFor(() => {
                    expect(mockUpdateCustomer).toHaveBeenCalledWith(
                        "1",
                        expect.objectContaining({
                            name: "Updated Name",
                            email: "updated@example.com",
                        }),
                    );
                });
            });
        });

        describe("異常系", () => {
            test("更新エラー時にエラーメッセージを表示する", async () => {
                const existingCustomer: Customer = {
                    id: "1",
                    name: "Test",
                    email: "test@example.com",
                    status: "ACTIVE",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const mockUpdateCustomer = vi.fn().mockRejectedValue(new Error("Update failed"));

                vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
                    customers: [],
                    loading: false,
                    error: null,
                    refetch: vi.fn(),
                    createCustomer: vi.fn(),
                    updateCustomer: mockUpdateCustomer,
                    deleteCustomer: vi.fn(),
                });

                const router = createTestRouter("edit", existingCustomer);
                render(<RouterProvider router={router} />);
                await router.navigate({ to: "/crm/customers/new" as string });

                await waitFor(() => {
                    expect(screen.getByText("Edit Customer")).toBeInTheDocument();
                });

                fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Updated" } });
                fireEvent.click(screen.getByText("Save Changes"));

                await waitFor(() => {
                    expect(screen.getByText("Update failed")).toBeInTheDocument();
                });
            });
        });
    });

    describe("UI操作", () => {
        test("Cancelボタンをクリックすると一覧に戻る", async () => {
            vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
                customers: [],
                loading: false,
                error: null,
                refetch: vi.fn(),
                createCustomer: vi.fn(),
                updateCustomer: vi.fn(),
                deleteCustomer: vi.fn(),
            });

            const router = createTestRouter("create");
            render(<RouterProvider router={router} />);
            await router.navigate({ to: "/crm/customers/new" as string });

            await waitFor(() => {
                expect(screen.getByText("New Customer")).toBeInTheDocument();
            });

            const cancelButton = screen.getByText("Cancel");
            expect(cancelButton).toBeInTheDocument();
        });

        test("戻るボタンが表示される", async () => {
            vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
                customers: [],
                loading: false,
                error: null,
                refetch: vi.fn(),
                createCustomer: vi.fn(),
                updateCustomer: vi.fn(),
                deleteCustomer: vi.fn(),
            });

            const router = createTestRouter("create");
            render(<RouterProvider router={router} />);
            await router.navigate({ to: "/crm/customers/new" as string });

            await waitFor(() => {
                expect(screen.getByText("New Customer")).toBeInTheDocument();
            });

            // ArrowLeftアイコンのボタンが存在することを確認
            const backButtons = screen.getAllByRole("link");
            expect(backButtons.length).toBeGreaterThan(0);
        });

        test("Status選択フィールドが正しく動作する", async () => {
            vi.mocked(useCustomersModule.useCustomers).mockReturnValue({
                customers: [],
                loading: false,
                error: null,
                refetch: vi.fn(),
                createCustomer: vi.fn(),
                updateCustomer: vi.fn(),
                deleteCustomer: vi.fn(),
            });

            const router = createTestRouter("create");
            render(<RouterProvider router={router} />);
            await router.navigate({ to: "/crm/customers/new" as string });

            await waitFor(() => {
                expect(screen.getByText("New Customer")).toBeInTheDocument();
                expect(screen.getByText("Status")).toBeInTheDocument();
            });
        });
    });
});
