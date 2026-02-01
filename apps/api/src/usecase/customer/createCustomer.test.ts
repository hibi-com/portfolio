import { describe, expect, test, vi } from "vitest";
import type { CreateCustomerInput, Customer, CustomerRepository } from "~/domain/customer";
import { CreateCustomerUseCase } from "./createCustomer";

describe("CreateCustomerUseCase", () => {
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

    test("should create a new customer", async () => {
        const input: CreateCustomerInput = {
            name: "Test Customer",
            email: "test@example.com",
            phone: "123-456-7890",
            company: "Test Company",
            status: "ACTIVE",
        };

        const mockRepository = createMockRepository({
            create: vi.fn().mockResolvedValue(mockCustomer),
        });

        const useCase = new CreateCustomerUseCase(mockRepository);
        const result = await useCase.execute(input);

        expect(result).toEqual(mockCustomer);
        expect(mockRepository.create).toHaveBeenCalledWith(input);
    });

    test("should create customer with minimal input", async () => {
        const input: CreateCustomerInput = {
            name: "Minimal Customer",
        };

        const minimalCustomer: Customer = {
            ...mockCustomer,
            name: "Minimal Customer",
            email: undefined,
            phone: undefined,
            company: undefined,
            status: "PROSPECT",
        };

        const mockRepository = createMockRepository({
            create: vi.fn().mockResolvedValue(minimalCustomer),
        });

        const useCase = new CreateCustomerUseCase(mockRepository);
        const result = await useCase.execute(input);

        expect(result.name).toBe("Minimal Customer");
        expect(mockRepository.create).toHaveBeenCalledWith(input);
    });

    test("should create customer with tags and custom fields", async () => {
        const input: CreateCustomerInput = {
            name: "Tagged Customer",
            tags: ["vip", "enterprise"],
            customFields: { industry: "Technology", size: "Large" },
        };

        const taggedCustomer: Customer = {
            ...mockCustomer,
            name: "Tagged Customer",
            tags: ["vip", "enterprise"],
            customFields: { industry: "Technology", size: "Large" },
        };

        const mockRepository = createMockRepository({
            create: vi.fn().mockResolvedValue(taggedCustomer),
        });

        const useCase = new CreateCustomerUseCase(mockRepository);
        const result = await useCase.execute(input);

        expect(result.tags).toEqual(["vip", "enterprise"]);
        expect(result.customFields).toEqual({ industry: "Technology", size: "Large" });
    });
});
