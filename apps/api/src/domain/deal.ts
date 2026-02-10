export type { CreateDealInput, Deal, DealStatus, UpdateDealInput } from "@portfolio/api/generated/zod";

import type { CreateDealInput, Deal, UpdateDealInput } from "@portfolio/api/generated/zod";

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
