import { AppError, ErrorCodes } from "@portfolio/log";
import { useCallback, useEffect, useState } from "react";
import { crmApi, type Deal, type DealFormData, type Pipeline } from "~/shared/lib/crm-api";
import { getLogger } from "~/shared/lib/logger";

export function useDeals() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [pipelines, setPipelines] = useState<Pipeline[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const logger = getLogger();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [dealsData, pipelinesData] = await Promise.all([crmApi.deals.list(), crmApi.pipelines.list()]);
            setDeals(dealsData);
            setPipelines(pipelinesData);
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to fetch deals", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: "/api/crm/deals" });
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [logger]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const createDeal = async (data: DealFormData): Promise<Deal | null> => {
        try {
            const deal = await crmApi.deals.create(data);
            setDeals((prev) => [deal, ...prev]);
            return deal;
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to create deal", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: "/api/crm/deals" });
            throw err;
        }
    };

    const updateDeal = async (id: string, data: Partial<DealFormData>): Promise<Deal | null> => {
        try {
            const deal = await crmApi.deals.update(id, data);
            setDeals((prev) => prev.map((d) => (d.id === id ? deal : d)));
            return deal;
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to update deal", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: `/api/crm/deals/${id}` });
            throw err;
        }
    };

    const deleteDeal = async (id: string): Promise<void> => {
        try {
            await crmApi.deals.delete(id);
            setDeals((prev) => prev.filter((d) => d.id !== id));
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to delete deal", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: `/api/crm/deals/${id}` });
            throw err;
        }
    };

    const moveToStage = async (id: string, stageId: string): Promise<void> => {
        try {
            const deal = await crmApi.deals.moveToStage(id, stageId);
            setDeals((prev) => prev.map((d) => (d.id === id ? deal : d)));
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to move deal", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: `/api/crm/deals/${id}/stage` });
            throw err;
        }
    };

    return {
        deals,
        pipelines,
        loading,
        error,
        refetch: fetchData,
        createDeal,
        updateDeal,
        deleteDeal,
        moveToStage,
    };
}
