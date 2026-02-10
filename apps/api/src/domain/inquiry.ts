export type {
    Inquiry,
    InquiryCategory,
    InquiryPriority,
    InquiryResponse,
    InquiryStatus,
    CreateInquiryInput,
    CreateInquiryResponseInput,
    UpdateInquiryInput,
} from "@portfolio/api/generated/zod";

import type {
    Inquiry,
    InquiryResponse,
    InquiryStatus,
    CreateInquiryInput,
    CreateInquiryResponseInput,
    UpdateInquiryInput,
} from "@portfolio/api/generated/zod";

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
