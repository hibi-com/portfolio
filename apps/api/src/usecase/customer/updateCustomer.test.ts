import { describe, expect, test, vi } from "vitest";
import type { Customer, CustomerRepository, UpdateCustomerInput } from "~/domain/customer";
import { UpdateCustomerUseCase } from "./updateCustomer";

describe("UpdateCustomerUseCase", () => {
    const mockCustomer: Customer = {
        id: "customer-1",
        name: "Test Customer",
        email: "test@example.com",
        phone: "123-456-7890",
        company: "Test Company",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
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

    test("should update customer", async () => {
        const input: UpdateCustomerInput = {
            name: "Updated Customer",
            email: "updated@example.com",
        };

        const updatedCustomer: Customer = {
            ...mockCustomer,
            name: "Updated Customer",
            email: "updated@example.com",
        };

        const mockRepository = createMockRepository({
            update: vi.fn().mockResolvedValue(updatedCustomer),
        });

        const useCase = new UpdateCustomerUseCase(mockRepository);
        const result = await useCase.execute("customer-1", input);

        expect(result.name).toBe("Updated Customer");
        expect(result.email).toBe("updated@example.com");
        expect(mockRepository.update).toHaveBeenCalledWith("customer-1", input);
    });

    test("should update customer status", async () => {
        const input: UpdateCustomerInput = {
            status: "CHURNED",
        };

        const updatedCustomer: Customer = {
            ...mockCustomer,
            status: "CHURNED",
        };

        const mockRepository = createMockRepository({
            update: vi.fn().mockResolvedValue(updatedCustomer),
        });

        const useCase = new UpdateCustomerUseCase(mockRepository);
        const result = await useCase.execute("customer-1", input);

        expect(result.status).toBe("CHURNED");
    });
});
