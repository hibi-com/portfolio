import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { AppError, ErrorCodes } from "@portfolio/log";
import type { Handler } from "hono";
import { DIContainer } from "~/di/container";
import { getLogger, getMetrics } from "~/lib/logger";
import { isValidUuid } from "~/lib/validation";

type Env = {
    DATABASE_URL: string;
    CACHE_URL: string;
};

const app = new OpenAPIHono<{ Bindings: Env }>();

const PipelineStageSchema = z
    .object({
        id: z.string().uuid(),
        pipelineId: z.string().uuid(),
        name: z.string().min(1),
        order: z.number(),
        probability: z.number().optional(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    })
    .openapi("PipelineStage");

const PipelineSchema = z
    .object({
        id: z.string().uuid(),
        name: z.string().min(1),
        description: z.string().optional(),
        isDefault: z.boolean().optional(),
        stages: z.array(PipelineStageSchema).optional(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    })
    .openapi("Pipeline");

const CreatePipelineInputSchema = z
    .object({
        name: z.string().min(1),
        description: z.string().optional(),
        isDefault: z.boolean().optional(),
    })
    .openapi("CreatePipelineInput");

const UpdatePipelineInputSchema = z
    .object({
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        isDefault: z.boolean().optional(),
    })
    .openapi("UpdatePipelineInput");

const ErrorResponseSchema = z
    .object({
        error: z.string(),
        details: z.unknown().optional(),
    })
    .openapi("ErrorResponse");

const IdParamSchema = z.object({
    id: z.string().uuid().openapi({ description: "Pipeline ID", example: "123e4567-e89b-12d3-a456-426614174000" }),
});

const listPipelinesRoute = createRoute({
    method: "get",
    path: "/pipelines",
    tags: ["Pipelines"],
    summary: "List all pipelines",
    responses: {
        200: {
            content: { "application/json": { schema: z.array(PipelineSchema) } },
            description: "List of pipelines",
        },
    },
});

const getPipelineRoute = createRoute({
    method: "get",
    path: "/pipelines/{id}",
    tags: ["Pipelines"],
    summary: "Get a pipeline by ID",
    request: { params: IdParamSchema },
    responses: {
        200: {
            content: { "application/json": { schema: PipelineSchema } },
            description: "Pipeline details",
        },
        404: {
            content: { "application/json": { schema: ErrorResponseSchema } },
            description: "Pipeline not found",
        },
    },
});

const createPipelineRoute = createRoute({
    method: "post",
    path: "/pipelines",
    tags: ["Pipelines"],
    summary: "Create a new pipeline",
    request: {
        body: { content: { "application/json": { schema: CreatePipelineInputSchema } } },
    },
    responses: {
        201: {
            content: { "application/json": { schema: PipelineSchema } },
            description: "Pipeline created",
        },
        400: {
            content: { "application/json": { schema: ErrorResponseSchema } },
            description: "Validation error",
        },
    },
});

const updatePipelineRoute = createRoute({
    method: "put",
    path: "/pipelines/{id}",
    tags: ["Pipelines"],
    summary: "Update a pipeline",
    request: {
        params: IdParamSchema,
        body: { content: { "application/json": { schema: UpdatePipelineInputSchema } } },
    },
    responses: {
        200: {
            content: { "application/json": { schema: PipelineSchema } },
            description: "Pipeline updated",
        },
        404: {
            content: { "application/json": { schema: ErrorResponseSchema } },
            description: "Pipeline not found",
        },
    },
});

const deletePipelineRoute = createRoute({
    method: "delete",
    path: "/pipelines/{id}",
    tags: ["Pipelines"],
    summary: "Delete a pipeline",
    request: { params: IdParamSchema },
    responses: {
        204: { description: "Pipeline deleted" },
        404: {
            content: { "application/json": { schema: ErrorResponseSchema } },
            description: "Pipeline not found",
        },
    },
});

const listPipelinesHandler: Handler<{ Bindings: Env }> = async (c) => {
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getGetPipelinesUseCase();
        const pipelines = await useCase.execute();

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/crm/pipelines", status: "200" }, duration);

        return c.json(pipelines, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch pipelines", {
                      metadata: { route: "/api/crm/pipelines" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/pipelines", method: "GET" });
        return c.json({ error: appError.message }, 500);
    }
};

const getPipelineHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!isValidUuid(id)) {
        return c.json({ error: "Invalid pipeline ID format" }, 400);
    }

    try {
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getGetPipelineByIdUseCase();
        const pipeline = await useCase.execute(id);

        if (!pipeline) {
            return c.json({ error: "Pipeline not found" }, 404);
        }

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "GET", route: "/api/crm/pipelines/:id", status: "200" },
            duration,
        );

        return c.json(pipeline, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch pipeline", {
                      metadata: { route: "/api/crm/pipelines/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/pipelines/:id", method: "GET", id });
        return c.json({ error: appError.message }, 500);
    }
};

const createPipelineHandler: Handler<{ Bindings: Env }> = async (c) => {
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const body = await c.req.json();
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getCreatePipelineUseCase();
        const pipeline = await useCase.execute(body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "POST", route: "/api/crm/pipelines", status: "201" }, duration);

        return c.json(pipeline, 201);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create pipeline", {
                      metadata: { route: "/api/crm/pipelines" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/pipelines", method: "POST" });
        return c.json({ error: appError.message }, 400);
    }
};

const updatePipelineHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const body = await c.req.json();
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getUpdatePipelineUseCase();
        const pipeline = await useCase.execute(id, body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "PUT", route: "/api/crm/pipelines/:id", status: "200" },
            duration,
        );

        return c.json(pipeline, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to update pipeline", {
                      metadata: { route: "/api/crm/pipelines/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/pipelines/:id", method: "PUT", id });
        return c.json({ error: appError.message }, 400);
    }
};

const deletePipelineHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getDeletePipelineUseCase();
        await useCase.execute(id);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "DELETE", route: "/api/crm/pipelines/:id", status: "204" },
            duration,
        );

        return c.body(null, 204);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to delete pipeline", {
                      metadata: { route: "/api/crm/pipelines/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/pipelines/:id", method: "DELETE", id });
        return c.json({ error: appError.message }, 404);
    }
};

app.openapi(listPipelinesRoute, listPipelinesHandler as any);
app.openapi(getPipelineRoute, getPipelineHandler as any);
app.openapi(createPipelineRoute, createPipelineHandler as any);
app.openapi(updatePipelineRoute, updatePipelineHandler as any);
app.openapi(deletePipelineRoute, deletePipelineHandler as any);

export { app as pipelinesRouter };
