import type {
    CreateInquiryInput,
    CreateInquiryResponseInput,
    InquiriesListInquiries200,
    InquiriesListInquiriesParams,
    Inquiry,
    InquiryResponse,
    UpdateInquiryInput,
} from "@generated/api.schemas";
import { getInquiries } from "@generated/inquiries/inquiries";

const getClient = () => getInquiries();

export const listInquiries = (params?: InquiriesListInquiriesParams): Promise<InquiriesListInquiries200> => {
    return getClient().inquiriesListInquiries(params);
};

export const getInquiryById = (id: string): Promise<Inquiry> => {
    return getClient().inquiriesGetInquiryById(id);
};

export const createInquiry = (input: CreateInquiryInput): Promise<Inquiry> => {
    return getClient().inquiriesCreateInquiry(input);
};

export const updateInquiry = (id: string, input: UpdateInquiryInput): Promise<Inquiry> => {
    return getClient().inquiriesUpdateInquiry(id, input);
};

export const deleteInquiry = (id: string): Promise<void> => {
    return getClient().inquiriesDeleteInquiry(id);
};

export const resolveInquiry = (id: string): Promise<Inquiry> => {
    return getClient().inquiriesResolveInquiry(id);
};

export const closeInquiry = (id: string): Promise<Inquiry> => {
    return getClient().inquiriesCloseInquiry(id);
};

export const getInquiryResponses = (id: string): Promise<InquiryResponse[]> => {
    return getClient().inquiriesGetInquiryResponses(id);
};

export const addInquiryResponse = (id: string, input: CreateInquiryResponseInput): Promise<InquiryResponse> => {
    return getClient().inquiriesAddInquiryResponse(id, input);
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
