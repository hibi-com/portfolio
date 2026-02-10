import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { AppError, ErrorCodes } from "@portfolio/log";
import type { Handler } from "hono";
import { DIContainer } from "~/di/container";
import { getLogger } from "~/lib/logger";
import { isValidUuid } from "~/lib/validation";

type Env = {
    DATABASE_URL: string;
    CACHE_URL: string;
    FREEE_CLIENT_ID?: string;
    FREEE_CLIENT_SECRET?: string;
    FREEE_AUTH_BASE_URL?: string;
    FREEE_API_BASE_URL?: string;
};

const app = new OpenAPIHono<{ Bindings: Env }>();

const FreeeIntegrationSchema = z
    .object({
        id: z.string().uuid(),
        userId: z.string().uuid(),
        companyId: z.number(),
        companyName: z.string().optional(),
        isActive: z.boolean(),
        lastSyncAt: z.string().datetime().optional(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    })
    .openapi("FreeeIntegration");

const SyncLogSchema = z
    .object({
        id: z.string().uuid(),
        integrationId: z.string().uuid(),
        direction: z.enum(["IMPORT", "EXPORT"]),
        entityType: z.string(),
        status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"]),
        totalRecords: z.number().optional(),
        processedRecords: z.number().optional(),
        errorMessage: z.string().optional(),
        startedAt: z.string().datetime().optional(),
        completedAt: z.string().datetime().optional(),
        createdAt: z.string().datetime(),
    })
    .openapi("SyncLog");

const AuthUrlResponseSchema = z
    .object({
        authUrl: z.string().url(),
        state: z.string(),
    })
    .openapi("AuthUrlResponse");

const CallbackInputSchema = z
    .object({
        code: z.string(),
        redirectUri: z.string(),
        userId: z.string().uuid(),
    })
    .openapi("FreeeCallbackInput");

const IntegrationStatusSchema = z
    .object({
        connected: z.boolean(),
        id: z.string().uuid().optional(),
        companyId: z.number().optional(),
        companyName: z.string().optional(),
        isActive: z.boolean().optional(),
        lastSyncAt: z.string().datetime().optional(),
    })
    .openapi("IntegrationStatus");

const ErrorResponseSchema = z
    .object({
        error: z.string(),
        details: z.unknown().optional(),
    })
    .openapi("ErrorResponse");

const IdParamSchema = z.object({
    id: z.string().uuid().openapi({ description: "Integration ID" }),
});

const getAuthUrlRoute = createRoute({
    method: "get",
    path: "/auth",
    tags: ["Freee"],
    summary: "Get freee OAuth authorization URL",
    request: {
        query: z.object({ redirect_uri: z.string() }),
    },
    responses: {
        200: { content: { "application/json": { schema: AuthUrlResponseSchema } }, description: "Authorization URL" },
        400: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Validation error" },
    },
});

const callbackRoute = createRoute({
    method: "post",
    path: "/callback",
    tags: ["Freee"],
    summary: "Handle freee OAuth callback",
    request: { body: { content: { "application/json": { schema: CallbackInputSchema } } } },
    responses: {
        200: {
            content: { "application/json": { schema: FreeeIntegrationSchema } },
            description: "Integration created",
        },
        400: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Validation error" },
    },
});

const getIntegrationRoute = createRoute({
    method: "get",
    path: "/integration",
    tags: ["Freee"],
    summary: "Get freee integration status",
    request: {
        query: z.object({ userId: z.string().uuid() }),
    },
    responses: {
        200: {
            content: { "application/json": { schema: IntegrationStatusSchema } },
            description: "Integration status",
        },
    },
});

const disconnectRoute = createRoute({
    method: "post",
    path: "/{id}/disconnect",
    tags: ["Freee"],
    summary: "Disconnect freee integration",
    request: { params: IdParamSchema },
    responses: {
        200: {
            content: { "application/json": { schema: z.object({ success: z.boolean() }) } },
            description: "Disconnected",
        },
        404: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Not found" },
    },
});

const syncImportRoute = createRoute({
    method: "post",
    path: "/{id}/sync/partners/import",
    tags: ["Freee"],
    summary: "Import partners from freee",
    request: { params: IdParamSchema },
    responses: {
        200: { content: { "application/json": { schema: SyncLogSchema } }, description: "Sync started" },
        400: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Sync failed" },
    },
});

const syncExportRoute = createRoute({
    method: "post",
    path: "/{id}/sync/partners/export",
    tags: ["Freee"],
    summary: "Export partners to freee",
    request: { params: IdParamSchema },
    responses: {
        200: { content: { "application/json": { schema: SyncLogSchema } }, description: "Sync started" },
        400: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Sync failed" },
    },
});

const getSyncLogsRoute = createRoute({
    method: "get",
    path: "/{id}/sync/logs",
    tags: ["Freee"],
    summary: "Get sync logs",
    request: { params: IdParamSchema },
    responses: {
        200: { content: { "application/json": { schema: z.array(SyncLogSchema) } }, description: "Sync logs" },
    },
});

const getAuthUrlHandler: Handler<{ Bindings: Env }> = async (c) => {
    const { FREEE_CLIENT_ID, FREEE_CLIENT_SECRET } = c.env;
    if (!FREEE_CLIENT_ID || !FREEE_CLIENT_SECRET) {
        return c.json({ error: "freee integration not configured" }, 500);
    }

    const redirectUri = c.req.query("redirect_uri");
    if (!redirectUri) {
        return c.json({ error: "redirect_uri is required" }, 400);
    }

    try {
        const state = crypto.randomUUID();
        const container = new DIContainer(
            c.env.DATABASE_URL,
            c.env.CACHE_URL,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getGetFreeeAuthUrlUseCase(FREEE_CLIENT_ID, FREEE_CLIENT_SECRET);
        const authUrl = useCase.execute(state, redirectUri);

        return c.json({ authUrl, state }, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to generate auth URL", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/freee/auth", method: "GET" });
        return c.json({ error: appError.message }, 500);
    }
};

const callbackHandler: Handler<{ Bindings: Env }> = async (c) => {
    const { FREEE_CLIENT_ID, FREEE_CLIENT_SECRET } = c.env;
    if (!FREEE_CLIENT_ID || !FREEE_CLIENT_SECRET) {
        return c.json({ error: "freee integration not configured" }, 500);
    }

    try {
        const { code, redirectUri, userId } = await c.req.json();
        if (!code || !redirectUri || !userId) {
            return c.json({ error: "code, redirectUri, and userId are required" }, 400);
        }

        const container = new DIContainer(
            c.env.DATABASE_URL,
            c.env.CACHE_URL,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getHandleFreeeCallbackUseCase(FREEE_CLIENT_ID, FREEE_CLIENT_SECRET);
        const integration = await useCase.execute(code, redirectUri, userId);

        return c.json(
            {
                id: integration.id,
                companyId: integration.companyId,
                companyName: integration.companyName,
                isActive: integration.isActive,
            },
            200,
        );
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to complete OAuth flow", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/freee/callback", method: "POST" });
        return c.json({ error: appError.message }, 400);
    }
};

const getIntegrationHandler: Handler<{ Bindings: Env }> = async (c) => {
    const userId = c.req.query("userId");
    if (!userId) {
        return c.json({ error: "userId is required" }, 400);
    }

    try {
        const container = new DIContainer(
            c.env.DATABASE_URL,
            c.env.CACHE_URL,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getGetFreeeIntegrationUseCase();
        const integration = await useCase.execute(userId);

        if (!integration) {
            return c.json({ connected: false }, 200);
        }

        return c.json(
            {
                connected: true,
                id: integration.id,
                companyId: integration.companyId,
                companyName: integration.companyName,
                isActive: integration.isActive,
                lastSyncAt: integration.lastSyncAt,
            },
            200,
        );
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch integration", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/freee/integration", method: "GET" });
        return c.json({ error: appError.message }, 500);
    }
};

const disconnectHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    if (!isValidUuid(id)) return c.json({ error: "Invalid integration ID format" }, 400);

    try {
        const container = new DIContainer(
            c.env.DATABASE_URL,
            c.env.CACHE_URL,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getDisconnectFreeeUseCase();
        await useCase.execute(id);
        return c.json({ success: true }, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to disconnect", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/freee/:id/disconnect", method: "POST", id });
        return c.json({ error: appError.message }, 400);
    }
};

const syncImportHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    const { FREEE_CLIENT_ID, FREEE_CLIENT_SECRET } = c.env;
    if (!FREEE_CLIENT_ID || !FREEE_CLIENT_SECRET) {
        return c.json({ error: "freee integration not configured" }, 500);
    }
    if (!isValidUuid(id)) return c.json({ error: "Invalid integration ID format" }, 400);

    try {
        const container = new DIContainer(
            c.env.DATABASE_URL,
            c.env.CACHE_URL,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getSyncPartnersFromFreeeUseCase(FREEE_CLIENT_ID, FREEE_CLIENT_SECRET);
        const result = await useCase.execute(id);
        return c.json(result, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to sync from freee", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/freee/:id/sync/partners/import", method: "POST", id });
        return c.json({ error: appError.message }, 400);
    }
};

const syncExportHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    const { FREEE_CLIENT_ID, FREEE_CLIENT_SECRET } = c.env;
    if (!FREEE_CLIENT_ID || !FREEE_CLIENT_SECRET) {
        return c.json({ error: "freee integration not configured" }, 500);
    }
    if (!isValidUuid(id)) return c.json({ error: "Invalid integration ID format" }, 400);

    try {
        const container = new DIContainer(
            c.env.DATABASE_URL,
            c.env.CACHE_URL,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getSyncPartnersToFreeeUseCase(FREEE_CLIENT_ID, FREEE_CLIENT_SECRET);
        const result = await useCase.execute(id);
        return c.json(result, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to sync to freee", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/freee/:id/sync/partners/export", method: "POST", id });
        return c.json({ error: appError.message }, 400);
    }
};

const getSyncLogsHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    if (!isValidUuid(id)) return c.json({ error: "Invalid integration ID format" }, 400);

    try {
        const container = new DIContainer(
            c.env.DATABASE_URL,
            c.env.CACHE_URL,
            undefined,
            undefined,
            c.env.FREEE_AUTH_BASE_URL,
            c.env.FREEE_API_BASE_URL,
        );
        const useCase = container.getGetSyncLogsUseCase();
        const logs = await useCase.execute(id);
        return c.json(logs, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch sync logs", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/freee/:id/sync/logs", method: "GET", id });
        return c.json({ error: appError.message }, 500);
    }
};

app.openapi(getAuthUrlRoute, getAuthUrlHandler as any);
app.openapi(callbackRoute, callbackHandler as any);
app.openapi(getIntegrationRoute, getIntegrationHandler as any);
app.openapi(disconnectRoute, disconnectHandler as any);
app.openapi(syncImportRoute, syncImportHandler as any);
app.openapi(syncExportRoute, syncExportHandler as any);
app.openapi(getSyncLogsRoute, getSyncLogsHandler as any);

export { app as freeeRouter };
