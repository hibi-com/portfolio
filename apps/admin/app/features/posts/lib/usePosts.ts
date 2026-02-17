import { type Post, posts as postsApi } from "@portfolio/api";
import { AppError, ErrorCodes } from "@portfolio/log";
import { useEffect, useState } from "react";
import { getLogger } from "~/shared/lib/logger";

function toDataArray(response: Post[] | { data?: Post[] }): Post[] {
    return Array.isArray(response) ? response : response.data ?? [];
}

function toAppError(err: unknown): AppError {
    if (err instanceof AppError) return err;
    const originalError = err instanceof Error ? err : new Error(String(err));
    return AppError.fromCode(ErrorCodes.EXTERNAL_API_ERROR, "Failed to fetch posts", { originalError });
}

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
                const response = await postsApi.list();
                setPosts(toDataArray(response));
            } catch (err) {
                const appError = toAppError(err);
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
