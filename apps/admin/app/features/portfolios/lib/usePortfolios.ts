import { type Portfolio, portfolios as portfoliosApi } from "@portfolio/api";
import { AppError, ErrorCodes } from "@portfolio/log";
import { useEffect, useState } from "react";
import { getLogger } from "~/shared/lib/logger";

function toDataArray(response: Portfolio[] | { data?: Portfolio[] }): Portfolio[] {
    return Array.isArray(response) ? response : response.data ?? [];
}

function toAppError(err: unknown): AppError {
    if (err instanceof AppError) return err;
    const originalError = err instanceof Error ? err : new Error(String(err));
    return AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to fetch portfolios", { originalError });
}

export function usePortfolios() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const logger = getLogger();

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await portfoliosApi.list();
                setPortfolios(toDataArray(response));
            } catch (err) {
                const appError = toAppError(err);
                setError(appError);
                logger.logError(appError, { endpoint: "/api/portfolios" });
            } finally {
                setLoading(false);
            }
        };
        fetchPortfolios();
    }, [logger]);

    return { portfolios, loading, error };
}
