import { getInquiries } from "@generated/inquiries/inquiries";
import type {
    Inquiry,
    InquiryResponse,
    CreateInquiryInput,
    UpdateInquiryInput,
    CreateInquiryResponseInput,
    InquiriesListInquiriesParams,
    InquiriesListInquiries200,
} from "@generated/api.schemas";

const inquiriesClient = getInquiries();

export const listInquiries = (params?: InquiriesListInquiriesParams): Promise<InquiriesListInquiries200> => {
    return inquiriesClient.inquiriesListInquiries(params);
};

export const getInquiryById = (id: string): Promise<Inquiry> => {
    return inquiriesClient.inquiriesGetInquiryById(id);
};

export const createInquiry = (input: CreateInquiryInput): Promise<Inquiry> => {
    return inquiriesClient.inquiriesCreateInquiry(input);
};

export const updateInquiry = (id: string, input: UpdateInquiryInput): Promise<Inquiry> => {
    return inquiriesClient.inquiriesUpdateInquiry(id, input);
};

export const deleteInquiry = (id: string): Promise<void> => {
    return inquiriesClient.inquiriesDeleteInquiry(id);
};

export const resolveInquiry = (id: string): Promise<Inquiry> => {
    return inquiriesClient.inquiriesResolveInquiry(id);
};

export const closeInquiry = (id: string): Promise<Inquiry> => {
    return inquiriesClient.inquiriesCloseInquiry(id);
};

export const getInquiryResponses = (id: string): Promise<InquiryResponse[]> => {
    return inquiriesClient.inquiriesGetInquiryResponses(id);
};

export const addInquiryResponse = (id: string, input: CreateInquiryResponseInput): Promise<InquiryResponse> => {
    return inquiriesClient.inquiriesAddInquiryResponse(id, input);
};

export const inquiries = {
    list: listInquiries,
    getById: getInquiryById,
    create: createInquiry,
    update: updateInquiry,
    delete: deleteInquiry,
    resolve: resolveInquiry,
    close: closeInquiry,
    getResponses: getInquiryResponses,
    addResponse: addInquiryResponse,
} as const;
