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
    createdAt: string;
    updatedAt: string;
}

export interface CustomerListItem {
    id: string;
    name: string;
    email?: string;
    company?: string;
    status: CustomerStatus;
    createdAt: string;
}

export interface CustomerFormData {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    website?: string;
    address?: string;
    notes?: string;
    status?: CustomerStatus;
    tags?: string[];
}
