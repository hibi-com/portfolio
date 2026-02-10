import { inquiries } from "@portfolio/api";
import type {
    Inquiry,
    InquiryResponse,
    CreateInquiryInput,
    UpdateInquiryInput,
    CreateInquiryResponseInput,
} from "@portfolio/api";

// Helper to extract array from paginated response
const asArray = <T>(data: T[] | { data: T[] }): T[] => {
    return Array.isArray(data) ? data : data.data;
};

export const supportApi = {
    inquiries: {
        list: async (): Promise<Inquiry[]> => asArray(await inquiries.list()),
        getById: (id: string) => inquiries.getById(id),
        create: (data: CreateInquiryInput) => inquiries.create(data),
        update: (id: string, data: UpdateInquiryInput) => inquiries.update(id, data),
        respond: (id: string, data: CreateInquiryResponseInput) => inquiries.addResponse(id, data),
        close: (id: string) => inquiries.close(id),
    },
};

// Re-export types for backward compatibility
export type { Inquiry, InquiryResponse } from "@portfolio/api";
export type { CreateInquiryInput as InquiryFormData } from "@portfolio/api";
export type { CreateInquiryResponseInput as InquiryResponseFormData } from "@portfolio/api";

// Legacy types for existing code compatibility
export type InquiryStatus = "OPEN" | "PENDING" | "RESOLVED" | "CLOSED";
export type InquiryPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type InquiryType = "GENERAL" | "SUPPORT" | "SALES" | "FEEDBACK" | "BUG_REPORT";

// Extended type with responses and legacy field aliases
export interface InquiryDetail {
    id: string;
    customerId?: string;
    assigneeId?: string;
    subject: string;
    content: string;
    // Alias for content for backward compatibility
    description?: string;
    status: InquiryStatus;
    priority: InquiryPriority;
    // category maps to type for backward compatibility
    category?: string;
    type?: InquiryType;
    tags?: string[];
    source?: string;
    // Legacy fields from old API
    name?: string;
    email?: string;
    phone?: string;
    resolvedAt?: string;
    closedAt?: string;
    createdAt: string;
    updatedAt: string;
    responses: InquiryResponse[];
    customer?: {
        id: string;
        name: string;
        email?: string;
    };
}
