import { AppError, ErrorCodes } from "@portfolio/log";
import { useCallback, useEffect, useState } from "react";
import { getLogger } from "~/lib/logger";
import { crmApi, type Lead, type LeadFormData } from "~/shared/lib/crm-api";

export function useLeads() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const logger = getLogger();

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await crmApi.leads.list();
            setLeads(data);
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to fetch leads", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: "/api/crm/leads" });
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [logger]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const createLead = async (data: LeadFormData): Promise<Lead | null> => {
        try {
            const lead = await crmApi.leads.create(data);
            setLeads((prev) => [lead, ...prev]);
            return lead;
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to create lead", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: "/api/crm/leads" });
            throw err;
        }
    };

    const updateLead = async (id: string, data: Partial<LeadFormData>): Promise<Lead | null> => {
        try {
            const lead = await crmApi.leads.update(id, data);
            setLeads((prev) => prev.map((l) => (l.id === id ? lead : l)));
            return lead;
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to update lead", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: `/api/crm/leads/${id}` });
            throw err;
        }
    };

    const deleteLead = async (id: string): Promise<void> => {
        try {
            await crmApi.leads.delete(id);
            setLeads((prev) => prev.filter((l) => l.id !== id));
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to delete lead", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: `/api/crm/leads/${id}` });
            throw err;
        }
    };

    const convertLead = async (id: string): Promise<void> => {
        try {
            await crmApi.leads.convert(id);
            setLeads((prev) => prev.filter((l) => l.id !== id));
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to convert lead", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: `/api/crm/leads/${id}/convert` });
            throw err;
        }
    };

    return {
        leads,
        loading,
        error,
        refetch: fetchLeads,
        createLead,
        updateLead,
        deleteLead,
        convertLead,
    };
}
