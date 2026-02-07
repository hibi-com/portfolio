import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { AppError, ErrorCodes } from "@portfolio/log";
import { getLogger, getMetrics } from "~/lib/logger";
import { DIContainer } from "~/di/container";

export async function getPosts(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetPostsUseCase();
        const posts = await useCase.execute();

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/posts", status: "200" }, duration);
        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/posts", status: "200" });

        if (!posts || posts.length === 0) {
            const notFoundError = AppError.fromCode(ErrorCodes.NOT_FOUND_POST, "Posts not found");
            metrics.httpRequestDuration.observe({ method: "GET", route: "/api/posts", status: "404" }, duration);
            metrics.httpRequestTotal.inc({ method: "GET", route: "/api/posts", status: "404" });
            metrics.httpRequestErrors.inc({ method: "GET", route: "/api/posts", status: "404" });
            return c.json(notFoundError.toJSON(), notFoundError.httpStatus as StatusCode);
        }

        return c.json(posts);
    } catch (error) {
        const duration = (Date.now() - startTime) / 1000;
        const appError = error instanceof AppError
            ? error
            : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch posts", {
                  metadata: { route: "/api/posts" },
                  originalError: error instanceof Error ? error : new Error(String(error)),
              });

        logger.logError(appError, { route: "/api/posts", method: "GET" });
        metrics.errorsTotal.inc({ category: appError.category, code: appError.code });
        metrics.errorsByCode.inc({ code: appError.code, category: appError.category });
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/posts", status: String(appError.httpStatus) }, duration);
        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/posts", status: String(appError.httpStatus) });
        metrics.httpRequestErrors.inc({ method: "GET", route: "/api/posts", status: String(appError.httpStatus) });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getPostBySlug(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const slug = c.req.param("slug");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!slug) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid slug", {
            metadata: { field: "slug" },
        });
        metrics.httpRequestErrors.inc({ method: "GET", route: "/api/posts/:slug", status: "400" });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetPostBySlugUseCase();
        const post = await useCase.execute(slug);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/posts/:slug", status: "200" }, duration);
        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/posts/:slug", status: "200" });

        if (!post) {
            const notFoundError = AppError.fromCode(ErrorCodes.NOT_FOUND_POST, "Post not found", {
                metadata: { slug },
            });
            metrics.httpRequestDuration.observe({ method: "GET", route: "/api/posts/:slug", status: "404" }, duration);
            metrics.httpRequestTotal.inc({ method: "GET", route: "/api/posts/:slug", status: "404" });
            metrics.httpRequestErrors.inc({ method: "GET", route: "/api/posts/:slug", status: "404" });
            return c.json(notFoundError.toJSON(), notFoundError.httpStatus as StatusCode);
        }

        return c.json(post);
    } catch (error) {
        const duration = (Date.now() - startTime) / 1000;
        const appError = error instanceof AppError
            ? error
            : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch post", {
                  metadata: { route: "/api/posts/:slug", slug },
                  originalError: error instanceof Error ? error : new Error(String(error)),
              });

        logger.logError(appError, { route: "/api/posts/:slug", method: "GET", slug });
        metrics.errorsTotal.inc({ category: appError.category, code: appError.code });
        metrics.errorsByCode.inc({ code: appError.code, category: appError.category });
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/posts/:slug", status: String(appError.httpStatus) }, duration);
        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/posts/:slug", status: String(appError.httpStatus) });
        metrics.httpRequestErrors.inc({ method: "GET", route: "/api/posts/:slug", status: String(appError.httpStatus) });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}
