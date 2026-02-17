import { portfolios as portfoliosApi, posts as postsApi } from "@portfolio/api";
import { AppError, ErrorCodes } from "@portfolio/log";
import { useEffect, useState } from "react";
import { getLogger } from "~/shared/lib/logger";
import type { DashboardStats } from "../model/types";

function toDataArray<T>(response: T[] | { data?: T[] }): T[] {
    return Array.isArray(response) ? response : response.data ?? [];
}

function toAppError(err: unknown): AppError {
    if (err instanceof AppError) return err;
    const originalError = err instanceof Error ? err : new Error(String(err));
    return AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to fetch stats", { originalError });
}

function buildStats(postsData: unknown[], portfoliosData: unknown[]): DashboardStats {
    return {
        posts: Array.isArray(postsData) ? postsData.length : 0,
        portfolios: Array.isArray(portfoliosData) ? portfoliosData.length : 0,
        totalViews: 0,
        users: 0,
    };
}

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats>({
        posts: 0,
        portfolios: 0,
        totalViews: 0,
        users: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const logger = getLogger();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const [postsResponse, portfoliosResponse] = await Promise.all([
                    postsApi.list(),
                    portfoliosApi.list(),
                ]);
                const postsData = toDataArray(postsResponse);
                const portfoliosData = toDataArray(portfoliosResponse);
                setStats(buildStats(postsData, portfoliosData));
            } catch (err) {
                const appError = toAppError(err);
                setError(appError);
                logger.logError(appError, { endpoint: "/api/dashboard/stats" });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [logger]);

    return { stats, loading, error };
}
