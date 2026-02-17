import type {
    CreateDealInput,
    Deal,
    DealsListDeals200,
    DealsListDealsParams,
    UpdateDealInput,
} from "@generated/api.schemas";
import { getDeals } from "@generated/deals/deals";

const getClient = () => getDeals();

export const listDeals = (params?: DealsListDealsParams): Promise<DealsListDeals200> => {
    return getClient().dealsListDeals(params);
};

export const getDealById = (id: string): Promise<Deal> => {
    return getClient().dealsGetDealById(id);
};

export const createDeal = (input: CreateDealInput): Promise<Deal> => {
    return getClient().dealsCreateDeal(input);
};

export const updateDeal = (id: string, input: UpdateDealInput): Promise<Deal> => {
    return getClient().dealsUpdateDeal(id, input);
};

export const deleteDeal = (id: string): Promise<void> => {
    return getClient().dealsDeleteDeal(id);
};

export const moveDealToStage = (id: string, stageId: string): Promise<Deal> => {
    return getClient().dealsMoveDealToStage(id, { stageId });
};

export const markDealAsWon = (id: string): Promise<Deal> => {
    return getClient().dealsMarkDealAsWon(id);
};

export const markDealAsLost = (id: string, reason?: string): Promise<Deal> => {
    return getClient().dealsMarkDealAsLost(id, reason ? { reason } : undefined);
};

export const deals = {
    list: listDeals,
    getById: getDealById,
    create: createDeal,
    update: updateDeal,
    delete: deleteDeal,
    moveToStage: moveDealToStage,
    markAsWon: markDealAsWon,
    markAsLost: markDealAsLost,
} as const;
