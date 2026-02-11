import type {
    CreateCustomerInput,
    CreateDealInput,
    CreateLeadInput,
    Customer,
    Deal,
    Lead,
    Pipeline,
    UpdateCustomerInput,
    UpdateDealInput,
    UpdateLeadInput,
} from "@portfolio/api";
import { customers, deals, leads, pipelines } from "@portfolio/api";

const asArray = <T>(data: T[] | { data: T[] }): T[] => {
    return Array.isArray(data) ? data : data.data;
};

export const crmApi = {
    customers: {
        list: async (): Promise<Customer[]> => asArray(await customers.list()),
        getById: (id: string) => customers.getById(id),
        create: (data: CreateCustomerInput) => customers.create(data),
        update: (id: string, data: UpdateCustomerInput) => customers.update(id, data),
        delete: (id: string) => customers.delete(id),
    },
    leads: {
        list: async (): Promise<Lead[]> => asArray(await leads.list()),
        getById: (id: string) => leads.getById(id),
        create: (data: CreateLeadInput) => leads.create(data),
        update: (id: string, data: UpdateLeadInput) => leads.update(id, data),
        delete: (id: string) => leads.delete(id),
        convert: (id: string) => leads.convert(id),
    },
    deals: {
        list: async (): Promise<Deal[]> => asArray(await deals.list()),
        getById: (id: string) => deals.getById(id),
        create: (data: CreateDealInput) => deals.create(data),
        update: (id: string, data: UpdateDealInput) => deals.update(id, data),
        delete: (id: string) => deals.delete(id),
        moveToStage: (id: string, stageId: string) => deals.moveToStage(id, stageId),
    },
    pipelines: {
        list: (): Promise<Pipeline[]> => pipelines.list(),
        getById: (id: string) => pipelines.getById(id),
    },
};

export type {
    CreateCustomerInput as CustomerFormData,
    CreateDealInput as DealFormData,
    CreateLeadInput as LeadFormData,
    Customer,
    Deal,
    Lead,
    Pipeline,
    PipelineStage,
} from "@portfolio/api";
