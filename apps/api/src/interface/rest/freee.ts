import { AppError, ErrorCodes } from "@portfolio/log";
import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { DIContainer } from "~/di/container";
import { getLogger, getMetrics } from "~/lib/logger";
import { isValidUuid } from "~/lib/validation";

export async function getFreeeAuthUrl(c: Context) {
    const freeeClientId = c.env.FREEE_CLIENT_ID;
    const freeeClientSecret = c.env.FREEE_CLIENT_SECRET;
    const logger = getLogger();
    const metrics = getMetrics();

    if (!freeeClientId || !freeeClientSecret) {
        const configError = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "freee integration not configured", {
            metadata: { route: "/api/freee/auth" },
        });
        return c.json(configError.toJSON(), configError.httpStatus as StatusCode);
    }

    try {
        const redirectUri = c.req.query("redirect_uri");
        if (!redirectUri) {
            const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "redirect_uri is required", {
                metadata: { field: "redirect_uri" },
            });
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const state = crypto.randomUUID();

        const container = new DIContainer(
            c.env.DATABASE_URL,
            c.env.REDIS_URL,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getGetFreeeAuthUrlUseCase(freeeClientId, freeeClientSecret);
        const authUrl = useCase.execute(state, redirectUri);

        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/freee/auth", status: "200" });

        return c.json({ authUrl, state });
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to generate auth URL", {
                      metadata: { route: "/api/freee/auth" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/freee/auth", method: "GET" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function handleFreeeCallback(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const freeeClientId = c.env.FREEE_CLIENT_ID;
    const freeeClientSecret = c.env.FREEE_CLIENT_SECRET;
    const logger = getLogger();
    const metrics = getMetrics();

    if (!freeeClientId || !freeeClientSecret) {
        const configError = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "freee integration not configured", {
            metadata: { route: "/api/freee/callback" },
        });
        return c.json(configError.toJSON(), configError.httpStatus as StatusCode);
    }

    try {
        const body = await c.req.json();
        const { code, redirectUri, userId } = body as {
            code: string;
            redirectUri: string;
            userId: string;
        };

        if (!code || !redirectUri || !userId) {
            const validationError = AppError.fromCode(
                ErrorCodes.VALIDATION_MISSING_FIELD,
                "code, redirectUri, and userId are required",
                {
                    metadata: { fields: ["code", "redirectUri", "userId"] },
                },
            );
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const container = new DIContainer(
            databaseUrl,
            redisUrl,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getHandleFreeeCallbackUseCase(freeeClientId, freeeClientSecret);
        const integration = await useCase.execute(code, redirectUri, userId);

        metrics.httpRequestTotal.inc({ method: "POST", route: "/api/freee/callback", status: "200" });

        return c.json({
            id: integration.id,
            companyId: integration.companyId,
            companyName: integration.companyName,
            isActive: integration.isActive,
        });
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to complete OAuth flow", {
                      metadata: { route: "/api/freee/callback" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/freee/callback", method: "POST" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getFreeeIntegration(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const userId = c.req.query("userId");
    const logger = getLogger();
    const metrics = getMetrics();

    if (!userId) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "userId is required", {
            metadata: { field: "userId" },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(
            databaseUrl,
            redisUrl,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getGetFreeeIntegrationUseCase();
        const integration = await useCase.execute(userId);

        if (!integration) {
            return c.json({ connected: false });
        }

        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/freee/integration", status: "200" });

        return c.json({
            connected: true,
            id: integration.id,
            companyId: integration.companyId,
            companyName: integration.companyName,
            isActive: integration.isActive,
            lastSyncAt: integration.lastSyncAt,
        });
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch integration", {
                      metadata: { route: "/api/freee/integration" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/freee/integration", method: "GET" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function disconnectFreee(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(
            ErrorCodes.VALIDATION_MISSING_FIELD,
            "Invalid integration ID format",
            {
                metadata: { field: "id", receivedValue: id },
            },
        );
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(
            databaseUrl,
            redisUrl,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getDisconnectFreeeUseCase();
        await useCase.execute(id);

        metrics.httpRequestTotal.inc({ method: "POST", route: "/api/freee/disconnect/:id", status: "204" });

        return c.body(null, 204);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to disconnect freee", {
                      metadata: { route: "/api/freee/disconnect/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/freee/disconnect/:id", method: "POST", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function syncPartnersFromFreee(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const freeeClientId = c.env.FREEE_CLIENT_ID;
    const freeeClientSecret = c.env.FREEE_CLIENT_SECRET;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();

    if (!freeeClientId || !freeeClientSecret) {
        const configError = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "freee integration not configured", {
            metadata: { route: "/api/freee/:id/sync/partners/import" },
        });
        return c.json(configError.toJSON(), configError.httpStatus as StatusCode);
    }

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(
            ErrorCodes.VALIDATION_MISSING_FIELD,
            "Invalid integration ID format",
            {
                metadata: { field: "id", receivedValue: id },
            },
        );
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(
            databaseUrl,
            redisUrl,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getSyncPartnersFromFreeeUseCase(freeeClientId, freeeClientSecret);
        const syncLog = await useCase.execute(id);

        metrics.httpRequestTotal.inc({ method: "POST", route: "/api/freee/:id/sync/partners/import", status: "200" });

        return c.json(syncLog);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to sync partners from freee", {
                      metadata: { route: "/api/freee/:id/sync/partners/import", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/freee/:id/sync/partners/import", method: "POST", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function syncPartnersToFreee(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const freeeClientId = c.env.FREEE_CLIENT_ID;
    const freeeClientSecret = c.env.FREEE_CLIENT_SECRET;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();

    if (!freeeClientId || !freeeClientSecret) {
        const configError = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "freee integration not configured", {
            metadata: { route: "/api/freee/:id/sync/partners/export" },
        });
        return c.json(configError.toJSON(), configError.httpStatus as StatusCode);
    }

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(
            ErrorCodes.VALIDATION_MISSING_FIELD,
            "Invalid integration ID format",
            {
                metadata: { field: "id", receivedValue: id },
            },
        );
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(
            databaseUrl,
            redisUrl,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getSyncPartnersToFreeeUseCase(freeeClientId, freeeClientSecret);
        const syncLog = await useCase.execute(id);

        metrics.httpRequestTotal.inc({ method: "POST", route: "/api/freee/:id/sync/partners/export", status: "200" });

        return c.json(syncLog);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to sync partners to freee", {
                      metadata: { route: "/api/freee/:id/sync/partners/export", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/freee/:id/sync/partners/export", method: "POST", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getSyncLogs(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(
            ErrorCodes.VALIDATION_MISSING_FIELD,
            "Invalid integration ID format",
            {
                metadata: { field: "id", receivedValue: id },
            },
        );
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const limit = c.req.query("limit") ? Number.parseInt(c.req.query("limit") as string, 10) : undefined;

        const container = new DIContainer(
            databaseUrl,
            redisUrl,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getGetSyncLogsUseCase();
        const logs = await useCase.execute(id, limit);

        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/freee/:id/sync/logs", status: "200" });

        return c.json(logs);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch sync logs", {
                      metadata: { route: "/api/freee/:id/sync/logs", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/freee/:id/sync/logs", method: "GET", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}
