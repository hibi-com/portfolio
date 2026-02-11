import { type Portfolio, portfolios as portfoliosApi } from "@portfolio/api";
import { AppError, ErrorCodes } from "@portfolio/log";
import { useEffect, useState } from "react";
import { getLogger } from "~/shared/lib/logger";

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
                const data = Array.isArray(response) ? response : response.data || [];
                setPortfolios(data);
            } catch (err) {
                const appError =
                    err instanceof AppError
                        ? err
                        : AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to fetch portfolios", {
                              originalError: err instanceof Error ? err : new Error(String(err)),
                          });
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
