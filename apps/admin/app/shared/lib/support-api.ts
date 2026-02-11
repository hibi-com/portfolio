import type {
    CreateInquiryInput,
    CreateInquiryResponseInput,
    Inquiry,
    InquiryResponse,
    UpdateInquiryInput,
} from "@portfolio/api";
import { inquiries } from "@portfolio/api";

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

export type {
    CreateInquiryInput as InquiryFormData,
    CreateInquiryResponseInput as InquiryResponseFormData,
    Inquiry,
    InquiryResponse,
} from "@portfolio/api";

export type InquiryStatus = "OPEN" | "PENDING" | "RESOLVED" | "CLOSED";
export type InquiryPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type InquiryType = "GENERAL" | "SUPPORT" | "SALES" | "FEEDBACK" | "BUG_REPORT";

export interface InquiryDetail {
    id: string;
    customerId?: string;
    assigneeId?: string;
    subject: string;
    content: string;
    description?: string;
    status: InquiryStatus;
    priority: InquiryPriority;
    category?: string;
    type?: InquiryType;
    tags?: string[];
    source?: string;
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
