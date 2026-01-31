import { createPrismaClient } from "@portfolio/db";
import type {
    CreateCustomerInput,
    Customer,
    CustomerRepository,
    CustomerStatus,
    UpdateCustomerInput,
} from "~/domain/customer";

export class CustomerRepositoryImpl implements CustomerRepository {
    constructor(private readonly databaseUrl?: string) {}

    private mapToCustomer(data: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        company: string | null;
        website: string | null;
        address: string | null;
        notes: string | null;
        status: string;
        tags: string | null;
        customFields: string | null;
        createdAt: Date;
        updatedAt: Date;
    }): Customer {
        return {
            id: data.id,
            name: data.name,
            email: data.email ?? undefined,
            phone: data.phone ?? undefined,
            company: data.company ?? undefined,
            website: data.website ?? undefined,
            address: data.address ?? undefined,
            notes: data.notes ?? undefined,
            status: data.status as CustomerStatus,
            tags: data.tags ? JSON.parse(data.tags) : undefined,
            customFields: data.customFields ? JSON.parse(data.customFields) : undefined,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        };
    }

    async findAll(): Promise<Customer[]> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const customers = await prisma.customer.findMany({
            orderBy: { createdAt: "desc" },
        });

        return customers.map((customer) => this.mapToCustomer(customer));
    }

    async findById(id: string): Promise<Customer | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const customer = await prisma.customer.findUnique({
            where: { id },
        });

        if (!customer) return null;

        return this.mapToCustomer(customer);
    }

    async findByEmail(email: string): Promise<Customer | null> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const customer = await prisma.customer.findFirst({
            where: { email },
        });

        if (!customer) return null;

        return this.mapToCustomer(customer);
    }

    async create(input: CreateCustomerInput): Promise<Customer> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const customer = await prisma.customer.create({
            data: {
                name: input.name,
                email: input.email,
                phone: input.phone,
                company: input.company,
                website: input.website,
                address: input.address,
                notes: input.notes,
                status: input.status ?? "PROSPECT",
                tags: input.tags ? JSON.stringify(input.tags) : undefined,
                customFields: input.customFields ? JSON.stringify(input.customFields) : undefined,
            },
        });

        return this.mapToCustomer(customer);
    }

    async update(id: string, input: UpdateCustomerInput): Promise<Customer> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        const customer = await prisma.customer.update({
            where: { id },
            data: {
                name: input.name,
                email: input.email,
                phone: input.phone,
                company: input.company,
                website: input.website,
                address: input.address,
                notes: input.notes,
                status: input.status,
                tags: input.tags ? JSON.stringify(input.tags) : undefined,
                customFields: input.customFields ? JSON.stringify(input.customFields) : undefined,
            },
        });

        return this.mapToCustomer(customer);
    }

    async delete(id: string): Promise<void> {
        const prisma = createPrismaClient({ databaseUrl: this.databaseUrl });
        await prisma.customer.delete({
            where: { id },
        });
    }
}
