export type DealStatus = "OPEN" | "WON" | "LOST" | "STALLED";

export interface Deal {
    id: string;
    customerId?: string;
    leadId?: string;
    stageId: string;
    name: string;
    value?: number;
    currency: string;
    expectedCloseDate?: Date;
    actualCloseDate?: Date;
    status: DealStatus;
    notes?: string;
    lostReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateDealInput {
    customerId?: string;
    leadId?: string;
    stageId: string;
    name: string;
    value?: number;
    currency?: string;
    expectedCloseDate?: Date;
    status?: DealStatus;
    notes?: string;
}

export interface UpdateDealInput {
    customerId?: string;
    stageId?: string;
    name?: string;
    value?: number;
    currency?: string;
    expectedCloseDate?: Date;
    actualCloseDate?: Date;
    status?: DealStatus;
    notes?: string;
    lostReason?: string;
}

export interface DealRepository {
    findAll(): Promise<Deal[]>;
    findById(id: string): Promise<Deal | null>;
    findByCustomerId(customerId: string): Promise<Deal[]>;
    findByStageId(stageId: string): Promise<Deal[]>;
    create(input: CreateDealInput): Promise<Deal>;
    update(id: string, input: UpdateDealInput): Promise<Deal>;
    delete(id: string): Promise<void>;
    moveToStage(id: string, stageId: string): Promise<Deal>;
    markAsWon(id: string): Promise<Deal>;
    markAsLost(id: string, reason?: string): Promise<Deal>;
}
