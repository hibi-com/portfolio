import type {
    CreateLeadInput,
    Lead,
    LeadsListLeads200,
    LeadsListLeadsParams,
    UpdateLeadInput,
} from "@generated/api.schemas";
import { getLeads } from "@generated/leads/leads";

const getClient = () => getLeads();

export const listLeads = (params?: LeadsListLeadsParams): Promise<LeadsListLeads200> => {
    return getClient().leadsListLeads(params);
};

export const getLeadById = (id: string): Promise<Lead> => {
    return getClient().leadsGetLeadById(id);
};

export const createLead = (input: CreateLeadInput): Promise<Lead> => {
    return getClient().leadsCreateLead(input);
};

export const updateLead = (id: string, input: UpdateLeadInput): Promise<Lead> => {
    return getClient().leadsUpdateLead(id, input);
};

export const deleteLead = (id: string): Promise<void> => {
    return getClient().leadsDeleteLead(id);
};

export const convertLead = (id: string): Promise<Lead> => {
    return getClient().leadsConvertLead(id);
};

export const leads = {
    list: listLeads,
    getById: getLeadById,
    create: createLead,
    update: updateLead,
    delete: deleteLead,
    convert: convertLead,
} as const;
