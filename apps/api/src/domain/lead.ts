export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "UNQUALIFIED" | "CONVERTED";

export interface Lead {
    id: string;
    customerId?: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    status: LeadStatus;
    score?: number;
    notes?: string;
    convertedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateLeadInput {
    customerId?: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    status?: LeadStatus;
    score?: number;
    notes?: string;
}

export interface UpdateLeadInput {
    customerId?: string;
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    status?: LeadStatus;
    score?: number;
    notes?: string;
}

export interface LeadRepository {
    findAll(): Promise<Lead[]>;
    findById(id: string): Promise<Lead | null>;
    findByCustomerId(customerId: string): Promise<Lead[]>;
    create(input: CreateLeadInput): Promise<Lead>;
    update(id: string, input: UpdateLeadInput): Promise<Lead>;
    delete(id: string): Promise<void>;
    convertToDeal(id: string): Promise<Lead>;
}
