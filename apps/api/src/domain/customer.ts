export type {
    Customer,
    CustomerStatus,
    CreateCustomerInput,
    UpdateCustomerInput,
} from "@portfolio/api/generated/zod";

import type { Customer, CreateCustomerInput, UpdateCustomerInput } from "@portfolio/api/generated/zod";

export interface CustomerRepository {
    findAll(): Promise<Customer[]>;
    findById(id: string): Promise<Customer | null>;
    findByEmail(email: string): Promise<Customer | null>;
    create(input: CreateCustomerInput): Promise<Customer>;
    update(id: string, input: UpdateCustomerInput): Promise<Customer>;
    delete(id: string): Promise<void>;
}
