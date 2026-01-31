export type CustomerStatus = "ACTIVE" | "INACTIVE" | "PROSPECT" | "CHURNED";

export interface Customer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    website?: string;
    address?: string;
    notes?: string;
    status: CustomerStatus;
    tags?: string[];
    customFields?: Record<string, unknown>;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCustomerInput {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    website?: string;
    address?: string;
    notes?: string;
    status?: CustomerStatus;
    tags?: string[];
    customFields?: Record<string, unknown>;
}

export interface UpdateCustomerInput {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    website?: string;
    address?: string;
    notes?: string;
    status?: CustomerStatus;
    tags?: string[];
    customFields?: Record<string, unknown>;
}

export interface CustomerRepository {
    findAll(): Promise<Customer[]>;
    findById(id: string): Promise<Customer | null>;
    findByEmail(email: string): Promise<Customer | null>;
    create(input: CreateCustomerInput): Promise<Customer>;
    update(id: string, input: UpdateCustomerInput): Promise<Customer>;
    delete(id: string): Promise<void>;
}
