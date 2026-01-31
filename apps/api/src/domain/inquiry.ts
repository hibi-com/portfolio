export type InquiryStatus = "OPEN" | "IN_PROGRESS" | "WAITING_CUSTOMER" | "RESOLVED" | "CLOSED";
export type InquiryPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type InquiryCategory = "GENERAL" | "TECHNICAL" | "BILLING" | "SALES" | "COMPLAINT" | "FEATURE_REQUEST" | "OTHER";

export interface Inquiry {
    id: string;
    customerId?: string;
    assigneeId?: string;
    subject: string;
    content: string;
    status: InquiryStatus;
    priority: InquiryPriority;
    category: InquiryCategory;
    tags?: string[];
    source?: string;
    metadata?: Record<string, unknown>;
    resolvedAt?: Date;
    closedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface InquiryResponse {
    id: string;
    inquiryId: string;
    userId?: string;
    content: string;
    isInternal: boolean;
    attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateInquiryInput {
    customerId?: string;
    assigneeId?: string;
    subject: string;
    content: string;
    status?: InquiryStatus;
    priority?: InquiryPriority;
    category?: InquiryCategory;
    tags?: string[];
    source?: string;
    metadata?: Record<string, unknown>;
}

export interface UpdateInquiryInput {
    customerId?: string;
    assigneeId?: string;
    subject?: string;
    content?: string;
    status?: InquiryStatus;
    priority?: InquiryPriority;
    category?: InquiryCategory;
    tags?: string[];
    source?: string;
    metadata?: Record<string, unknown>;
}

export interface CreateInquiryResponseInput {
    inquiryId: string;
    userId?: string;
    content: string;
    isInternal?: boolean;
    attachments?: string[];
}

export interface InquiryRepository {
    findAll(): Promise<Inquiry[]>;
    findById(id: string): Promise<Inquiry | null>;
    findByCustomerId(customerId: string): Promise<Inquiry[]>;
    findByAssigneeId(assigneeId: string): Promise<Inquiry[]>;
    findByStatus(status: InquiryStatus): Promise<Inquiry[]>;
    create(input: CreateInquiryInput): Promise<Inquiry>;
    update(id: string, input: UpdateInquiryInput): Promise<Inquiry>;
    delete(id: string): Promise<void>;
    resolve(id: string): Promise<Inquiry>;
    close(id: string): Promise<Inquiry>;
    addResponse(input: CreateInquiryResponseInput): Promise<InquiryResponse>;
    getResponses(inquiryId: string): Promise<InquiryResponse[]>;
}
