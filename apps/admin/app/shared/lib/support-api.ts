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

export const supportApi = {
    inquiries: {
        list: () => fetchWithAuth<Inquiry[]>("/api/support/inquiries"),
        getById: (id: string) => fetchWithAuth<InquiryDetail>(`/api/support/inquiries/${id}`),
        create: (data: InquiryFormData) =>
            fetchWithAuth<Inquiry>("/api/support/inquiries", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        update: (id: string, data: Partial<InquiryFormData>) =>
            fetchWithAuth<Inquiry>(`/api/support/inquiries/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            }),
        respond: (id: string, data: InquiryResponseFormData) =>
            fetchWithAuth<InquiryResponse>(`/api/support/inquiries/${id}/respond`, {
                method: "POST",
                body: JSON.stringify(data),
            }),
        close: (id: string) =>
            fetchWithAuth<Inquiry>(`/api/support/inquiries/${id}/close`, {
                method: "POST",
            }),
    },
};

export type InquiryStatus = "OPEN" | "PENDING" | "RESOLVED" | "CLOSED";
export type InquiryPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type InquiryType = "GENERAL" | "SUPPORT" | "SALES" | "FEEDBACK" | "BUG_REPORT";

export interface Inquiry {
    id: string;
    customerId?: string;
    subject: string;
    description: string;
    type: InquiryType;
    status: InquiryStatus;
    priority: InquiryPriority;
    email?: string;
    name?: string;
    phone?: string;
    assigneeId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface InquiryDetail extends Inquiry {
    responses: InquiryResponse[];
    customer?: {
        id: string;
        name: string;
        email?: string;
    };
}

export interface InquiryResponse {
    id: string;
    inquiryId: string;
    message: string;
    isInternal: boolean;
    senderId?: string;
    senderType: "STAFF" | "CUSTOMER";
    createdAt: string;
}

export interface InquiryFormData {
    customerId?: string;
    subject: string;
    description: string;
    type?: InquiryType;
    status?: InquiryStatus;
    priority?: InquiryPriority;
    email?: string;
    name?: string;
    phone?: string;
}

export interface InquiryResponseFormData {
    message: string;
    isInternal?: boolean;
}
