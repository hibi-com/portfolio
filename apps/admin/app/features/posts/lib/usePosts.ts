import type { Post } from "@portfolio/api";
import { AppError, ErrorCodes } from "@portfolio/log";
import { useEffect, useState } from "react";
import { api } from "~/shared/lib/api";
import { getLogger } from "~/shared/lib/logger";

export function usePosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const logger = getLogger();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.posts.listPosts();
                const data = Array.isArray(response) ? response : response.data || [];
                setPosts(data);
            } catch (err) {
                const appError =
                    err instanceof AppError
                        ? err
                        : AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to fetch posts", {
                              originalError: err instanceof Error ? err : new Error(String(err)),
                          });
                setError(appError);
                logger.logError(appError, { endpoint: "/api/posts" });
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [logger]);

    return { posts, loading, error };
}
