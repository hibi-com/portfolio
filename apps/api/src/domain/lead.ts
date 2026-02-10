export type { Lead, LeadStatus, CreateLeadInput, UpdateLeadInput } from "@portfolio/api/generated/zod";

import type { Lead, CreateLeadInput, UpdateLeadInput } from "@portfolio/api/generated/zod";

export interface LeadRepository {
    findAll(): Promise<Lead[]>;
    findById(id: string): Promise<Lead | null>;
    findByCustomerId(customerId: string): Promise<Lead[]>;
    create(input: CreateLeadInput): Promise<Lead>;
    update(id: string, input: UpdateLeadInput): Promise<Lead>;
    delete(id: string): Promise<void>;
    convertToDeal(id: string): Promise<Lead>;
}
