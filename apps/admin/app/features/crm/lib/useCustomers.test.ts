import type { Customer } from "@portfolio/api";
import { customers as customersApi } from "@portfolio/api";
import { renderHook, waitFor } from "@testing-library/react";
import { useCustomers } from "./useCustomers";

vi.mock("@portfolio/api", () => ({
    customers: {
        list: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("useCustomers", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("fetchCustomers", () => {
        describe("正常系", () => {
            test("初期状態は空配列とloading trueである", () => {
                vi.mocked(customersApi.list).mockResolvedValue({ data: [] } as never);

                const { result } = renderHook(() => useCustomers());

                expect(result.current.customers).toEqual([]);
                expect(result.current.loading).toBe(true);
                expect(result.current.error).toBeNull();
            });

            test("顧客リストを取得して更新する", async () => {
                const mockCustomers: Customer[] = [
                    {
                        id: "1",
                        name: "Test Customer",
                        email: "test@example.com",
                        status: "ACTIVE",
                        createdAt: "2024-01-01",
                        updatedAt: "2024-01-01",
                    },
                ];

                vi.mocked(customersApi.list).mockResolvedValue({ data: mockCustomers } as never);

                const { result } = renderHook(() => useCustomers());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.customers).toEqual(mockCustomers);
                expect(customersApi.list).toHaveBeenCalled();
            });

            test("dataがnullの場合は空配列を設定する", async () => {
                vi.mocked(customersApi.list).mockResolvedValue({ data: null } as never);

                const { result } = renderHook(() => useCustomers());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.customers).toEqual([]);
            });

            test("配列が直接返却される場合も処理する", async () => {
                const mockCustomers: Customer[] = [
                    {
                        id: "1",
                        name: "Test Customer",
                        email: "test@example.com",
                        status: "ACTIVE",
                        createdAt: "2024-01-01",
                        updatedAt: "2024-01-01",
                    },
                ];

                vi.mocked(customersApi.list).mockResolvedValue(mockCustomers as never);

                const { result } = renderHook(() => useCustomers());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.customers).toEqual(mockCustomers);
            });
        });

        describe("異常系", () => {
            test("エラーが発生した場合はエラー状態を設定する", async () => {
                const error = new Error("Failed to fetch");
                vi.mocked(customersApi.list).mockRejectedValue(error);

                const { result } = renderHook(() => useCustomers());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                expect(result.current.error).toBeInstanceOf(Error);
                expect(result.current.error?.message).toContain("Failed to fetch");
                expect(result.current.customers).toEqual([]);
            });
        });
    });

    describe("createCustomer", () => {
        describe("正常系", () => {
            test("新規顧客を作成してリストの先頭に追加する", async () => {
                const existingCustomer: Customer = {
                    id: "1",
                    name: "Existing",
                    email: "existing@example.com",
                    status: "ACTIVE",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const newCustomer: Customer = {
                    id: "2",
                    name: "New Customer",
                    email: "new@example.com",
                    status: "PROSPECT",
                    createdAt: "2024-01-02",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(customersApi.list).mockResolvedValue([existingCustomer] as never);
                vi.mocked(customersApi.create).mockResolvedValue(newCustomer as never);

                const { result } = renderHook(() => useCustomers());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                const created = await result.current.createCustomer({
                    name: "New Customer",
                    email: "new@example.com",
                    status: "PROSPECT",
                });

                expect(created).toEqual(newCustomer);
                expect(result.current.customers).toEqual([newCustomer, existingCustomer]);
            });
        });

        describe("異常系", () => {
            test("作成に失敗した場合はエラーをthrowする", async () => {
                vi.mocked(customersApi.list).mockResolvedValue([] as never);
                const error = new Error("Create failed");
                vi.mocked(customersApi.create).mockRejectedValue(error);

                const { result } = renderHook(() => useCustomers());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(
                    result.current.createCustomer({
                        name: "Test",
                        email: "test@example.com",
                        status: "PROSPECT",
                    }),
                ).rejects.toThrow("Create failed");
            });
        });
    });

    describe("updateCustomer", () => {
        describe("正常系", () => {
            test("顧客を更新してリスト内の該当項目を置き換える", async () => {
                const customer: Customer = {
                    id: "1",
                    name: "Original",
                    email: "original@example.com",
                    status: "PROSPECT",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const updatedCustomer: Customer = {
                    ...customer,
                    name: "Updated",
                    status: "ACTIVE",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(customersApi.list).mockResolvedValue([customer] as never);
                vi.mocked(customersApi.update).mockResolvedValue(updatedCustomer as never);

                const { result } = renderHook(() => useCustomers());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                const updated = await result.current.updateCustomer("1", {
                    name: "Updated",
                    status: "ACTIVE",
                });

                expect(updated).toEqual(updatedCustomer);
                expect(result.current.customers).toEqual([updatedCustomer]);
            });
        });

        describe("異常系", () => {
            test("更新に失敗した場合はエラーをthrowする", async () => {
                const customer: Customer = {
                    id: "1",
                    name: "Test",
                    email: "test@example.com",
                    status: "ACTIVE",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                vi.mocked(customersApi.list).mockResolvedValue([customer] as never);
                const error = new Error("Update failed");
                vi.mocked(customersApi.update).mockRejectedValue(error);

                const { result } = renderHook(() => useCustomers());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(result.current.updateCustomer("1", { name: "Updated" })).rejects.toThrow("Update failed");
            });
        });
    });

    describe("deleteCustomer", () => {
        describe("正常系", () => {
            test("顧客を削除してリストから除外する", async () => {
                const customer1: Customer = {
                    id: "1",
                    name: "Customer 1",
                    email: "customer1@example.com",
                    status: "ACTIVE",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                const customer2: Customer = {
                    id: "2",
                    name: "Customer 2",
                    email: "customer2@example.com",
                    status: "ACTIVE",
                    createdAt: "2024-01-02",
                    updatedAt: "2024-01-02",
                };

                vi.mocked(customersApi.list).mockResolvedValue([customer1, customer2] as never);
                vi.mocked(customersApi.delete).mockResolvedValue(undefined as never);

                const { result } = renderHook(() => useCustomers());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await result.current.deleteCustomer("1");

                expect(result.current.customers).toEqual([customer2]);
            });
        });

        describe("異常系", () => {
            test("削除に失敗した場合はエラーをthrowする", async () => {
                const customer: Customer = {
                    id: "1",
                    name: "Test",
                    email: "test@example.com",
                    status: "ACTIVE",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                };

                vi.mocked(customersApi.list).mockResolvedValue([customer] as never);
                const error = new Error("Delete failed");
                vi.mocked(customersApi.delete).mockRejectedValue(error);

                const { result } = renderHook(() => useCustomers());

                await waitFor(() => {
                    expect(result.current.loading).toBe(false);
                });

                await expect(result.current.deleteCustomer("1")).rejects.toThrow("Delete failed");
            });
        });
    });
});
