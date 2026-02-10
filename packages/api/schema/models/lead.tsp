import "@typespec/http";
import "@typespec/openapi3";

enum LeadStatus {
    NEW,
    CONTACTED,
    QUALIFIED,
    UNQUALIFIED,
    CONVERTED,
}

model Lead {
    id: string;
    customerId?: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    status: LeadStatus;
    score?: int32;
    notes?: string;
    convertedAt?: string;
    createdAt: string;
    updatedAt: string;
}

model CreateLeadInput {
    customerId?: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    status?: LeadStatus;
    score?: int32;
    notes?: string;
}

model UpdateLeadInput {
    customerId?: string;
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    status?: LeadStatus;
    score?: int32;
    notes?: string;
}
