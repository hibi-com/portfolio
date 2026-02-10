import "@typespec/http";
import "@typespec/openapi3";

enum InquiryStatus {
    OPEN,
    IN_PROGRESS,
    WAITING_CUSTOMER,
    RESOLVED,
    CLOSED,
}

enum InquiryPriority {
    LOW,
    MEDIUM,
    HIGH,
    URGENT,
}

enum InquiryCategory {
    GENERAL,
    TECHNICAL,
    BILLING,
    SALES,
    COMPLAINT,
    FEATURE_REQUEST,
    OTHER,
}

model Inquiry {
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
    metadata?: Record<unknown>;
    resolvedAt?: string;
    closedAt?: string;
    createdAt: string;
    updatedAt: string;
}

model InquiryResponse {
    id: string;
    inquiryId: string;
    userId?: string;
    content: string;
    isInternal: boolean;
    attachments?: string[];
    createdAt: string;
    updatedAt: string;
}

model CreateInquiryInput {
    customerId?: string;
    assigneeId?: string;
    subject: string;
    content: string;
    status?: InquiryStatus;
    priority?: InquiryPriority;
    category?: InquiryCategory;
    tags?: string[];
    source?: string;
    metadata?: Record<unknown>;
}

model UpdateInquiryInput {
    customerId?: string;
    assigneeId?: string;
    subject?: string;
    content?: string;
    status?: InquiryStatus;
    priority?: InquiryPriority;
    category?: InquiryCategory;
    tags?: string[];
    source?: string;
    metadata?: Record<unknown>;
}

model CreateInquiryResponseInput {
    inquiryId: string;
    userId?: string;
    content: string;
    isInternal?: boolean;
    attachments?: string[];
}
