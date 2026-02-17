import type { Customer, CustomerRepository } from "~/domain/customer";
import { GetCustomersUseCase } from "./getCustomers";

describe("GetCustomersUseCase", () => {
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

    test("should return all customers", async () => {
        const customers: Customer[] = [mockCustomer, { ...mockCustomer, id: "customer-2", name: "Customer 2" }];
        const mockRepository = createMockRepository({
            findAll: vi.fn().mockResolvedValue(customers),
        });

        const useCase = new GetCustomersUseCase(mockRepository);
        const result = await useCase.execute();

        expect(result).toEqual(customers);
        expect(result).toHaveLength(2);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    test("should return empty array when no customers", async () => {
        const mockRepository = createMockRepository({
            findAll: vi.fn().mockResolvedValue([]),
        });

        const useCase = new GetCustomersUseCase(mockRepository);
        const result = await useCase.execute();

        expect(result).toEqual([]);
        expect(result).toHaveLength(0);
    });
});
