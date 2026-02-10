import { getLeads } from "@generated/leads/leads";
import type {
    Lead,
    CreateLeadInput,
    UpdateLeadInput,
    LeadsListLeadsParams,
    LeadsListLeads200,
} from "@generated/api.schemas";

const leadsClient = getLeads();

export const listLeads = (params?: LeadsListLeadsParams): Promise<LeadsListLeads200> => {
    return leadsClient.leadsListLeads(params);
};

export const getLeadById = (id: string): Promise<Lead> => {
    return leadsClient.leadsGetLeadById(id);
};

export const createLead = (input: CreateLeadInput): Promise<Lead> => {
    return leadsClient.leadsCreateLead(input);
};

export const updateLead = (id: string, input: UpdateLeadInput): Promise<Lead> => {
    return leadsClient.leadsUpdateLead(id, input);
};

export const deleteLead = (id: string): Promise<void> => {
    return leadsClient.leadsDeleteLead(id);
};

export const convertLead = (id: string): Promise<Lead> => {
    return leadsClient.leadsConvertLead(id);
};

export const leads = {
    list: listLeads,
    getById: getLeadById,
    create: createLead,
    update: updateLead,
    delete: deleteLead,
    convert: convertLead,
} as const;
