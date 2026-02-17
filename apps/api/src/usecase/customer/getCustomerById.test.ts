import type { Customer, CustomerRepository } from "~/domain/customer";
import { GetCustomerByIdUseCase } from "./getCustomerById";

describe("GetCustomerByIdUseCase", () => {
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

    test("should return customer by id", async () => {
        const mockRepository = createMockRepository({
            findById: vi.fn().mockResolvedValue(mockCustomer),
        });

        const useCase = new GetCustomerByIdUseCase(mockRepository);
        const result = await useCase.execute("customer-1");

        expect(result).toEqual(mockCustomer);
        expect(mockRepository.findById).toHaveBeenCalledWith("customer-1");
    });

    test("should return null when customer not found", async () => {
        const mockRepository = createMockRepository({
            findById: vi.fn().mockResolvedValue(null),
        });

        const useCase = new GetCustomerByIdUseCase(mockRepository);
        const result = await useCase.execute("non-existent");

        expect(result).toBeNull();
        expect(mockRepository.findById).toHaveBeenCalledWith("non-existent");
    });
});
