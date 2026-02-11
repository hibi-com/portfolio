import { AppError, ErrorCodes } from "@portfolio/log";
import { useCallback, useEffect, useState } from "react";
import type { Customer, CustomerFormData } from "~/entities/customer";
import { crmApi } from "~/shared/lib/crm-api";
import { getLogger } from "~/shared/lib/logger";

export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const logger = getLogger();

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await crmApi.customers.list();
            setCustomers(data);
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to fetch customers", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: "/api/crm/customers" });
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setLoading(false);
        }
    }, [logger]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const createCustomer = async (data: CustomerFormData): Promise<Customer | null> => {
        try {
            const customer = await crmApi.customers.create(data);
            setCustomers((prev) => [customer, ...prev]);
            return customer;
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to create customer", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: "/api/crm/customers" });
            throw err;
        }
    };

    const updateCustomer = async (id: string, data: Partial<CustomerFormData>): Promise<Customer | null> => {
        try {
            const customer = await crmApi.customers.update(id, data);
            setCustomers((prev) => prev.map((c) => (c.id === id ? customer : c)));
            return customer;
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to update customer", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: `/api/crm/customers/${id}` });
            throw err;
        }
    };

    const deleteCustomer = async (id: string): Promise<void> => {
        try {
            await crmApi.customers.delete(id);
            setCustomers((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            const appError = AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to delete customer", {
                originalError: err instanceof Error ? err : new Error(String(err)),
            });
            logger.logError(appError, { endpoint: `/api/crm/customers/${id}` });
            throw err;
        }
    };

    return {
        customers,
        loading,
        error,
        refetch: fetchCustomers,
        createCustomer,
        updateCustomer,
        deleteCustomer,
    };
}
