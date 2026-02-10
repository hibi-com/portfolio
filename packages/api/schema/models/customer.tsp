import "@typespec/http";
import "@typespec/openapi3";

enum CustomerStatus {
    ACTIVE,
    INACTIVE,
    PROSPECT,
    CHURNED,
}

model Customer {
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
    customFields?: Record<unknown>;
    createdAt: string;
    updatedAt: string;
}

model CreateCustomerInput {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    website?: string;
    address?: string;
    notes?: string;
    status?: CustomerStatus;
    tags?: string[];
    customFields?: Record<unknown>;
}

model UpdateCustomerInput {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    website?: string;
    address?: string;
    notes?: string;
    status?: CustomerStatus;
    tags?: string[];
    customFields?: Record<unknown>;
}
