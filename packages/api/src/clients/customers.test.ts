import type {
	CreateCustomerInput,
	Customer,
	CustomersListCustomers200,
	CustomersListCustomersParams,
	UpdateCustomerInput,
} from "@generated/api.schemas";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@generated/customers/customers", () => ({
	getCustomers: vi.fn(() => ({
		customersListCustomers: vi.fn(),
		customersGetCustomerById: vi.fn(),
		customersCreateCustomer: vi.fn(),
		customersUpdateCustomer: vi.fn(),
		customersDeleteCustomer: vi.fn(),
	})),
}));

import { getCustomers } from "@generated/customers/customers";
import { createCustomer, customers, deleteCustomer, getCustomerById, listCustomers, updateCustomer } from "./customers";

describe("customers client", () => {
	const mockCustomersListCustomers = vi.fn();
	const mockCustomersGetCustomerById = vi.fn();
	const mockCustomersCreateCustomer = vi.fn();
	const mockCustomersUpdateCustomer = vi.fn();
	const mockCustomersDeleteCustomer = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getCustomers).mockReturnValue({
			customersListCustomers: mockCustomersListCustomers,
			customersGetCustomerById: mockCustomersGetCustomerById,
			customersCreateCustomer: mockCustomersCreateCustomer,
			customersUpdateCustomer: mockCustomersUpdateCustomer,
			customersDeleteCustomer: mockCustomersDeleteCustomer,
		});
	});

	const mockCustomer: Customer = {
		id: "cust-123",
		name: "Test Customer",
		email: "test@example.com",
		status: "ACTIVE",
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	};

	describe("listCustomers", () => {
		describe("正常系", () => {
			test("パラメータなしで全顧客を取得する", async () => {
				const mockResponse: CustomersListCustomers200 = {
					data: [mockCustomer],
					meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
				};
				mockCustomersListCustomers.mockResolvedValue(mockResponse);

				const result = await listCustomers();

				expect(result).toEqual(mockResponse);
				expect(mockCustomersListCustomers).toHaveBeenCalledWith(undefined);
				expect(mockCustomersListCustomers).toHaveBeenCalledTimes(1);
			});

			test("ページネーションパラメータを渡して顧客を取得する", async () => {
				const params: CustomersListCustomersParams = { page: 2, perPage: 5 };
				const mockResponse: CustomersListCustomers200 = {
					data: [],
					meta: { total: 10, page: 2, perPage: 5, totalPages: 2 },
				};
				mockCustomersListCustomers.mockResolvedValue(mockResponse);

				const result = await listCustomers(params);

				expect(result).toEqual(mockResponse);
				expect(mockCustomersListCustomers).toHaveBeenCalledWith(params);
			});

			test("statusフィルターを渡して顧客を取得する", async () => {
				const params: CustomersListCustomersParams = { status: "ACTIVE" };
				const mockResponse: CustomersListCustomers200 = {
					data: [mockCustomer],
					meta: { total: 1, page: 1, perPage: 10, totalPages: 1 },
				};
				mockCustomersListCustomers.mockResolvedValue(mockResponse);

				const result = await listCustomers(params);

				expect(result).toEqual(mockResponse);
				expect(mockCustomersListCustomers).toHaveBeenCalledWith(params);
			});
		});

		describe("異常系", () => {
			test("APIエラーの場合はエラーをそのまま伝播する", async () => {
				const error = new Error("API Error");
				mockCustomersListCustomers.mockRejectedValue(error);

				await expect(listCustomers()).rejects.toThrow("API Error");
			});
		});
	});

	describe("getCustomerById", () => {
		describe("正常系", () => {
			test("IDで顧客を取得する", async () => {
				mockCustomersGetCustomerById.mockResolvedValue(mockCustomer);

				const result = await getCustomerById("cust-123");

				expect(result).toEqual(mockCustomer);
				expect(mockCustomersGetCustomerById).toHaveBeenCalledWith("cust-123");
				expect(mockCustomersGetCustomerById).toHaveBeenCalledTimes(1);
			});
		});

		describe("異常系", () => {
			test("存在しないIDの場合はAPIエラーを伝播する", async () => {
				const error = new Error("Not Found");
				mockCustomersGetCustomerById.mockRejectedValue(error);

				await expect(getCustomerById("non-existent")).rejects.toThrow("Not Found");
			});
		});
	});

	describe("createCustomer", () => {
		describe("正常系", () => {
			test("顧客を作成する", async () => {
				const input: CreateCustomerInput = {
					name: "New Customer",
					email: "new@example.com",
				};
				mockCustomersCreateCustomer.mockResolvedValue(mockCustomer);

				const result = await createCustomer(input);

				expect(result).toEqual(mockCustomer);
				expect(mockCustomersCreateCustomer).toHaveBeenCalledWith(input);
				expect(mockCustomersCreateCustomer).toHaveBeenCalledTimes(1);
			});

			test("最小限のフィールドで顧客を作成する", async () => {
				const input: CreateCustomerInput = { name: "Minimal Customer" };
				mockCustomersCreateCustomer.mockResolvedValue({ ...mockCustomer, name: "Minimal Customer" });

				const result = await createCustomer(input);

				expect(result.name).toBe("Minimal Customer");
				expect(mockCustomersCreateCustomer).toHaveBeenCalledWith(input);
			});
		});

		describe("異常系", () => {
			test("バリデーションエラーの場合はエラーを伝播する", async () => {
				const input: CreateCustomerInput = { name: "" };
				const error = new Error("Validation Error");
				mockCustomersCreateCustomer.mockRejectedValue(error);

				await expect(createCustomer(input)).rejects.toThrow("Validation Error");
			});
		});
	});

	describe("updateCustomer", () => {
		describe("正常系", () => {
			test("顧客を更新する", async () => {
				const input: UpdateCustomerInput = { name: "Updated Customer" };
				const updatedCustomer = { ...mockCustomer, name: "Updated Customer" };
				mockCustomersUpdateCustomer.mockResolvedValue(updatedCustomer);

				const result = await updateCustomer("cust-123", input);

				expect(result).toEqual(updatedCustomer);
				expect(mockCustomersUpdateCustomer).toHaveBeenCalledWith("cust-123", input);
			});

			test("ステータスを更新する", async () => {
				const input: UpdateCustomerInput = { status: "INACTIVE" };
				const updatedCustomer = { ...mockCustomer, status: "INACTIVE" };
				mockCustomersUpdateCustomer.mockResolvedValue(updatedCustomer);

				const result = await updateCustomer("cust-123", input);

				expect(result.status).toBe("INACTIVE");
			});
		});

		describe("異常系", () => {
			test("存在しないIDの場合はエラーを伝播する", async () => {
				const input: UpdateCustomerInput = { name: "Test" };
				const error = new Error("Not Found");
				mockCustomersUpdateCustomer.mockRejectedValue(error);

				await expect(updateCustomer("non-existent", input)).rejects.toThrow("Not Found");
			});
		});
	});

	describe("deleteCustomer", () => {
		describe("正常系", () => {
			test("顧客を削除する", async () => {
				mockCustomersDeleteCustomer.mockResolvedValue(undefined);

				await deleteCustomer("cust-123");

				expect(mockCustomersDeleteCustomer).toHaveBeenCalledWith("cust-123");
				expect(mockCustomersDeleteCustomer).toHaveBeenCalledTimes(1);
			});
		});

		describe("異常系", () => {
			test("存在しないIDの場合はエラーを伝播する", async () => {
				const error = new Error("Not Found");
				mockCustomersDeleteCustomer.mockRejectedValue(error);

				await expect(deleteCustomer("non-existent")).rejects.toThrow("Not Found");
			});
		});
	});

	describe("customers オブジェクト", () => {
		test("listメソッドが正しく動作する", async () => {
			const mockResponse: CustomersListCustomers200 = {
				data: [],
				meta: { total: 0, page: 1, perPage: 10, totalPages: 0 },
			};
			mockCustomersListCustomers.mockResolvedValue(mockResponse);

			const result = await customers.list();

			expect(result).toEqual(mockResponse);
		});

		test("getByIdメソッドが正しく動作する", async () => {
			mockCustomersGetCustomerById.mockResolvedValue(mockCustomer);

			const result = await customers.getById("cust-123");

			expect(result).toEqual(mockCustomer);
		});

		test("createメソッドが正しく動作する", async () => {
			mockCustomersCreateCustomer.mockResolvedValue(mockCustomer);

			const result = await customers.create({ name: "Test" });

			expect(result).toEqual(mockCustomer);
		});

		test("updateメソッドが正しく動作する", async () => {
			mockCustomersUpdateCustomer.mockResolvedValue(mockCustomer);

			const result = await customers.update("cust-123", { name: "Updated" });

			expect(result).toEqual(mockCustomer);
		});

		test("deleteメソッドが正しく動作する", async () => {
			mockCustomersDeleteCustomer.mockResolvedValue(undefined);

			await customers.delete("cust-123");

			expect(mockCustomersDeleteCustomer).toHaveBeenCalledWith("cust-123");
		});
	});
});
