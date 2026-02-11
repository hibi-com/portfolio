import { AppError, ErrorCodes } from "@portfolio/log";
import { useEffect, useState } from "react";
import { api } from "~/shared/lib/api";
import { getLogger } from "~/shared/lib/logger";
import type { DashboardStats } from "../model/types";

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
                    api.posts.listPosts(),
                    api.portfolios.listPortfolios(),
                ]);

                const postsData = Array.isArray(postsResponse) ? postsResponse : postsResponse.data || [];
                const portfoliosData = Array.isArray(portfoliosResponse)
                    ? portfoliosResponse
                    : portfoliosResponse.data || [];

                setStats({
                    posts: Array.isArray(postsData) ? postsData.length : 0,
                    portfolios: Array.isArray(portfoliosData) ? portfoliosData.length : 0,
                    totalViews: 0,
                    users: 0,
                });
            } catch (err) {
                const appError =
                    err instanceof AppError
                        ? err
                        : AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to fetch stats", {
                              originalError: err instanceof Error ? err : new Error(String(err)),
                          });
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
