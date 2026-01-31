import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CustomerStatus } from "~/domain/customer";
import { CustomerRepositoryImpl } from "./customer.repository";

const mockPrismaClient = {
    customer: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
};

vi.mock("@portfolio/db", () => ({
    createPrismaClient: () => mockPrismaClient,
}));

describe("CustomerRepositoryImpl", () => {
    let repository: CustomerRepositoryImpl;

    beforeEach(() => {
        vi.clearAllMocks();
        repository = new CustomerRepositoryImpl();
    });

    const mockCustomerData = {
        id: "customer-uuid-1",
        name: "Test Customer",
        email: "test@example.com",
        phone: "03-1234-5678",
        company: "Test Company",
        website: "https://example.com",
        address: "Tokyo, Japan",
        notes: "Test notes",
        status: "ACTIVE" as CustomerStatus,
        tags: '["tag1", "tag2"]',
        customFields: '{"field1": "value1"}',
        createdAt: new Date("2025-01-01T00:00:00Z"),
        updatedAt: new Date("2025-01-01T00:00:00Z"),
    };

    describe("findAll", () => {
        it("should return all customers", async () => {
            mockPrismaClient.customer.findMany.mockResolvedValue([mockCustomerData]);

            const result = await repository.findAll();

            expect(result).toHaveLength(1);
            expect(result[0]?.id).toBe("customer-uuid-1");
            expect(result[0]?.name).toBe("Test Customer");
            expect(result[0]?.tags).toEqual(["tag1", "tag2"]);
            expect(mockPrismaClient.customer.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: "desc" },
            });
        });

        it("should return empty array when no customers exist", async () => {
            mockPrismaClient.customer.findMany.mockResolvedValue([]);

            const result = await repository.findAll();

            expect(result).toHaveLength(0);
        });
    });

    describe("findById", () => {
        it("should return customer when found", async () => {
            mockPrismaClient.customer.findUnique.mockResolvedValue(mockCustomerData);

            const result = await repository.findById("customer-uuid-1");

            expect(result).not.toBeNull();
            expect(result?.id).toBe("customer-uuid-1");
            expect(mockPrismaClient.customer.findUnique).toHaveBeenCalledWith({
                where: { id: "customer-uuid-1" },
            });
        });

        it("should return null when customer not found", async () => {
            mockPrismaClient.customer.findUnique.mockResolvedValue(null);

            const result = await repository.findById("non-existent");

            expect(result).toBeNull();
        });
    });

    describe("findByEmail", () => {
        it("should return customer when found by email", async () => {
            mockPrismaClient.customer.findFirst.mockResolvedValue(mockCustomerData);

            const result = await repository.findByEmail("test@example.com");

            expect(result).not.toBeNull();
            expect(result?.email).toBe("test@example.com");
        });
    });

    describe("create", () => {
        it("should create a new customer", async () => {
            const createData = {
                name: "New Customer",
                email: "new@example.com",
                phone: "03-9999-9999",
                company: "New Company",
            };
            mockPrismaClient.customer.create.mockResolvedValue({
                ...mockCustomerData,
                ...createData,
                id: "new-customer-uuid",
                tags: null,
                customFields: null,
            });

            const result = await repository.create(createData);

            expect(result.name).toBe("New Customer");
            expect(mockPrismaClient.customer.create).toHaveBeenCalledWith({
                data: {
                    name: "New Customer",
                    email: "new@example.com",
                    phone: "03-9999-9999",
                    company: "New Company",
                    website: undefined,
                    address: undefined,
                    notes: undefined,
                    status: "PROSPECT",
                    tags: undefined,
                    customFields: undefined,
                },
            });
        });
    });

    describe("update", () => {
        it("should update an existing customer", async () => {
            const updateData = { name: "Updated Customer" };
            mockPrismaClient.customer.update.mockResolvedValue({
                ...mockCustomerData,
                ...updateData,
            });

            const result = await repository.update("customer-uuid-1", updateData);

            expect(result.name).toBe("Updated Customer");
            expect(mockPrismaClient.customer.update).toHaveBeenCalledWith({
                where: { id: "customer-uuid-1" },
                data: {
                    name: "Updated Customer",
                    email: undefined,
                    phone: undefined,
                    company: undefined,
                    website: undefined,
                    address: undefined,
                    notes: undefined,
                    status: undefined,
                    tags: undefined,
                    customFields: undefined,
                },
            });
        });
    });

    describe("delete", () => {
        it("should delete an existing customer", async () => {
            mockPrismaClient.customer.delete.mockResolvedValue(mockCustomerData);

            await repository.delete("customer-uuid-1");

            expect(mockPrismaClient.customer.delete).toHaveBeenCalledWith({
                where: { id: "customer-uuid-1" },
            });
        });
    });
});
