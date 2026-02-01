import type { Customer, CustomerFormData } from "~/entities/customer";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = (await response.json().catch(() => ({ message: "Request failed" }))) as {
            message?: string;
        };
        throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    return response.json();
}

export const crmApi = {
    customers: {
        list: () => fetchWithAuth<Customer[]>("/api/crm/customers"),
        getById: (id: string) => fetchWithAuth<Customer>(`/api/crm/customers/${id}`),
        create: (data: CustomerFormData) =>
            fetchWithAuth<Customer>("/api/crm/customers", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        update: (id: string, data: Partial<CustomerFormData>) =>
            fetchWithAuth<Customer>(`/api/crm/customers/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }),
        delete: (id: string) =>
            fetchWithAuth<void>(`/api/crm/customers/${id}`, {
                method: "DELETE",
            }),
    },
    leads: {
        list: () => fetchWithAuth<Lead[]>("/api/crm/leads"),
        getById: (id: string) => fetchWithAuth<Lead>(`/api/crm/leads/${id}`),
        create: (data: LeadFormData) =>
            fetchWithAuth<Lead>("/api/crm/leads", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        update: (id: string, data: Partial<LeadFormData>) =>
            fetchWithAuth<Lead>(`/api/crm/leads/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }),
        delete: (id: string) =>
            fetchWithAuth<void>(`/api/crm/leads/${id}`, {
                method: "DELETE",
            }),
        convert: (id: string) =>
            fetchWithAuth<Deal>(`/api/crm/leads/${id}/convert`, {
                method: "POST",
            }),
    },
    deals: {
        list: () => fetchWithAuth<Deal[]>("/api/crm/deals"),
        getById: (id: string) => fetchWithAuth<Deal>(`/api/crm/deals/${id}`),
        create: (data: DealFormData) =>
            fetchWithAuth<Deal>("/api/crm/deals", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        update: (id: string, data: Partial<DealFormData>) =>
            fetchWithAuth<Deal>(`/api/crm/deals/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }),
        delete: (id: string) =>
            fetchWithAuth<void>(`/api/crm/deals/${id}`, {
                method: "DELETE",
            }),
        moveToStage: (id: string, stageId: string) =>
            fetchWithAuth<Deal>(`/api/crm/deals/${id}/stage`, {
                method: "PUT",
                body: JSON.stringify({ stageId }),
            }),
    },
    pipelines: {
        list: () => fetchWithAuth<Pipeline[]>("/api/crm/pipelines"),
        getById: (id: string) => fetchWithAuth<Pipeline>(`/api/crm/pipelines/${id}`),
    },
};

export interface Lead {
    id: string;
    customerId?: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    status: "NEW" | "CONTACTED" | "QUALIFIED" | "UNQUALIFIED" | "CONVERTED";
    score?: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface LeadFormData {
    customerId?: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    status?: Lead["status"];
    score?: number;
    notes?: string;
}

export interface Deal {
    id: string;
    customerId?: string;
    leadId?: string;
    pipelineId: string;
    stageId: string;
    name: string;
    value?: number;
    currency?: string;
    status: "OPEN" | "WON" | "LOST" | "ABANDONED";
    probability?: number;
    expectedCloseDate?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface DealFormData {
    customerId?: string;
    leadId?: string;
    pipelineId: string;
    stageId: string;
    name: string;
    value?: number;
    currency?: string;
    status?: Deal["status"];
    probability?: number;
    expectedCloseDate?: string;
    notes?: string;
}

export interface Pipeline {
    id: string;
    name: string;
    description?: string;
    isDefault: boolean;
    stages: PipelineStage[];
    createdAt: string;
    updatedAt: string;
}

export interface PipelineStage {
    id: string;
    pipelineId: string;
    name: string;
    order: number;
    color?: string;
    probability?: number;
}
