import "@typespec/http";
import "@typespec/openapi3";

enum DealStatus {
    OPEN,
    WON,
    LOST,
    STALLED,
}

model Deal {
    id: string;
    customerId?: string;
    leadId?: string;
    stageId: string;
    name: string;
    value?: float64;
    currency: string;
    expectedCloseDate?: string;
    actualCloseDate?: string;
    status: DealStatus;
    notes?: string;
    lostReason?: string;
    createdAt: string;
    updatedAt: string;
}

model CreateDealInput {
    customerId?: string;
    leadId?: string;
    stageId: string;
    name: string;
    value?: float64;
    currency?: string;
    expectedCloseDate?: string;
    status?: DealStatus;
    notes?: string;
}

model UpdateDealInput {
    customerId?: string;
    stageId?: string;
    name?: string;
    value?: float64;
    currency?: string;
    expectedCloseDate?: string;
    actualCloseDate?: string;
    status?: DealStatus;
    notes?: string;
    lostReason?: string;
}
