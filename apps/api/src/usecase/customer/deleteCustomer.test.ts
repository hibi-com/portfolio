import { describe, expect, test, vi } from "vitest";
import type { Customer, CustomerRepository } from "~/domain/customer";
import { DeleteCustomerUseCase } from "./deleteCustomer";

describe("DeleteCustomerUseCase", () => {
    const mockCustomer: Customer = {
        id: "customer-1",
        name: "Test Customer",
        email: "test@example.com",
        phone: "123-456-7890",
        company: "Test Company",
        status: "ACTIVE",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
    };

    const createMockRepository = (overrides: Partial<CustomerRepository> = {}): CustomerRepository => ({
        findAll: vi.fn().mockResolvedValue([]),
        findById: vi.fn().mockResolvedValue(null),
        findByEmail: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(mockCustomer),
        update: vi.fn().mockResolvedValue(mockCustomer),
        delete: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    });

    test("should delete customer", async () => {
        const mockRepository = createMockRepository({
            delete: vi.fn().mockResolvedValue(undefined),
        });

        const useCase = new DeleteCustomerUseCase(mockRepository);
        await useCase.execute("customer-1");

        expect(mockRepository.delete).toHaveBeenCalledWith("customer-1");
        expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });
});
