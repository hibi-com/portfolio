import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { AppError, ErrorCodes } from "@portfolio/log";
import type { Handler } from "hono";
import { DIContainer } from "~/di/container";
import { getLogger } from "~/lib/logger";
import { isValidUuid } from "~/lib/validation";

type Env = {
    DATABASE_URL: string;
    CACHE_URL: string;
    RESEND_API_KEY?: string;
    RESEND_FROM_EMAIL?: string;
};

const app = new OpenAPIHono<{ Bindings: Env }>();

const EmailLogStatusSchema = z.enum(["PENDING", "SENT", "FAILED", "BOUNCED"]).openapi("EmailLogStatus");

const EmailLogSchema = z
    .object({
        id: z.string().uuid(),
        templateId: z.string().uuid().optional(),
        to: z.string().email(),
        from: z.string().email(),
        subject: z.string(),
        htmlContent: z.string(),
        textContent: z.string().optional(),
        status: EmailLogStatusSchema,
        sentAt: z.string().datetime().optional(),
        errorMessage: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    })
    .openapi("EmailLog");

const EmailTemplateSchema = z
    .object({
        id: z.string().uuid(),
        name: z.string(),
        slug: z.string(),
        subject: z.string(),
        htmlContent: z.string(),
        textContent: z.string().optional(),
        variables: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    })
    .openapi("EmailTemplate");

const CreateTemplateInputSchema = z
    .object({
        name: z.string(),
        slug: z.string(),
        subject: z.string(),
        htmlContent: z.string(),
        textContent: z.string().optional(),
        variables: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
    })
    .openapi("CreateEmailTemplateInput");

const UpdateTemplateInputSchema = z
    .object({
        name: z.string().optional(),
        slug: z.string().optional(),
        subject: z.string().optional(),
        htmlContent: z.string().optional(),
        textContent: z.string().optional(),
        variables: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
    })
    .openapi("UpdateEmailTemplateInput");

const SendEmailInputSchema = z
    .object({
        to: z.string().email(),
        subject: z.string(),
        htmlContent: z.string(),
        textContent: z.string().optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
    })
    .openapi("SendEmailInput");

const SendWithTemplateInputSchema = z
    .object({
        to: z.string().email(),
        templateSlug: z.string(),
        variables: z.record(z.string(), z.string()).optional(),
        metadata: z.record(z.string(), z.unknown()).optional(),
    })
    .openapi("SendWithTemplateInput");

const ErrorResponseSchema = z
    .object({
        error: z.string(),
        details: z.unknown().optional(),
    })
    .openapi("ErrorResponse");

const IdParamSchema = z.object({
    id: z.string().uuid().openapi({ description: "Resource ID" }),
});

const listLogsRoute = createRoute({
    method: "get",
    path: "/logs",
    tags: ["Email"],
    summary: "List email logs",
    responses: {
        200: {
            content: { "application/json": { schema: z.array(EmailLogSchema) } },
            description: "List of email logs",
        },
    },
});

const getLogRoute = createRoute({
    method: "get",
    path: "/logs/{id}",
    tags: ["Email"],
    summary: "Get email log by ID",
    request: { params: IdParamSchema },
    responses: {
        200: { content: { "application/json": { schema: EmailLogSchema } }, description: "Email log details" },
        404: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Not found" },
    },
});

const listTemplatesRoute = createRoute({
    method: "get",
    path: "/templates",
    tags: ["Email"],
    summary: "List email templates",
    responses: {
        200: {
            content: { "application/json": { schema: z.array(EmailTemplateSchema) } },
            description: "List of templates",
        },
    },
});

const getTemplateRoute = createRoute({
    method: "get",
    path: "/templates/{id}",
    tags: ["Email"],
    summary: "Get email template by ID",
    request: { params: IdParamSchema },
    responses: {
        200: { content: { "application/json": { schema: EmailTemplateSchema } }, description: "Template details" },
        404: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Not found" },
    },
});

const createTemplateRoute = createRoute({
    method: "post",
    path: "/templates",
    tags: ["Email"],
    summary: "Create email template",
    request: { body: { content: { "application/json": { schema: CreateTemplateInputSchema } } } },
    responses: {
        201: { content: { "application/json": { schema: EmailTemplateSchema } }, description: "Template created" },
        400: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Validation error" },
    },
});

const updateTemplateRoute = createRoute({
    method: "put",
    path: "/templates/{id}",
    tags: ["Email"],
    summary: "Update email template",
    request: {
        params: IdParamSchema,
        body: { content: { "application/json": { schema: UpdateTemplateInputSchema } } },
    },
    responses: {
        200: { content: { "application/json": { schema: EmailTemplateSchema } }, description: "Template updated" },
        404: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Not found" },
    },
});

const deleteTemplateRoute = createRoute({
    method: "delete",
    path: "/templates/{id}",
    tags: ["Email"],
    summary: "Delete email template",
    request: { params: IdParamSchema },
    responses: {
        204: { description: "Template deleted" },
        404: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Not found" },
    },
});

const sendEmailRoute = createRoute({
    method: "post",
    path: "/send",
    tags: ["Email"],
    summary: "Send email",
    request: { body: { content: { "application/json": { schema: SendEmailInputSchema } } } },
    responses: {
        200: { content: { "application/json": { schema: EmailLogSchema } }, description: "Email sent" },
        400: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Validation error" },
    },
});

const sendWithTemplateRoute = createRoute({
    method: "post",
    path: "/send-with-template",
    tags: ["Email"],
    summary: "Send email with template",
    request: { body: { content: { "application/json": { schema: SendWithTemplateInputSchema } } } },
    responses: {
        200: { content: { "application/json": { schema: EmailLogSchema } }, description: "Email sent" },
        400: { content: { "application/json": { schema: ErrorResponseSchema } }, description: "Validation error" },
    },
});

const listLogsHandler: Handler<{ Bindings: Env }> = async (c) => {
    try {
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getGetEmailLogsUseCase();
        const logs = await useCase.execute();
        return c.json(logs, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch email logs", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/email/logs", method: "GET" });
        return c.json({ error: appError.message }, 500);
    }
};

const getLogHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    if (!isValidUuid(id)) return c.json({ error: "Invalid email log ID format" }, 400);

    try {
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getGetEmailLogByIdUseCase();
        const log = await useCase.execute(id);
        if (!log) return c.json({ error: "Email log not found" }, 404);
        return c.json(log, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch email log", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/email/logs/:id", method: "GET", id });
        return c.json({ error: appError.message }, 500);
    }
};

const listTemplatesHandler: Handler<{ Bindings: Env }> = async (c) => {
    try {
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getGetEmailTemplatesUseCase();
        const templates = await useCase.execute();
        return c.json(templates, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch templates", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/email/templates", method: "GET" });
        return c.json({ error: appError.message }, 500);
    }
};

const getTemplateHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    if (!isValidUuid(id)) return c.json({ error: "Invalid template ID format" }, 400);

    try {
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getGetEmailTemplateByIdUseCase();
        const template = await useCase.execute(id);
        if (!template) return c.json({ error: "Template not found" }, 404);
        return c.json(template, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch template", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/email/templates/:id", method: "GET", id });
        return c.json({ error: appError.message }, 500);
    }
};

const createTemplateHandler: Handler<{ Bindings: Env }> = async (c) => {
    try {
        const body = await c.req.json();
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getCreateEmailTemplateUseCase();
        const template = await useCase.execute(body);
        return c.json(template, 201);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create template", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/email/templates", method: "POST" });
        return c.json({ error: appError.message }, 400);
    }
};

const updateTemplateHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    try {
        const body = await c.req.json();
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getUpdateEmailTemplateUseCase();
        const template = await useCase.execute(id, body);
        return c.json(template, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to update template", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/email/templates/:id", method: "PUT", id });
        return c.json({ error: appError.message }, 400);
    }
};

const deleteTemplateHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    try {
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getDeleteEmailTemplateUseCase();
        await useCase.execute(id);
        return c.body(null, 204);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to delete template", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/email/templates/:id", method: "DELETE", id });
        return c.json({ error: appError.message }, 404);
    }
};

const sendEmailHandler: Handler<{ Bindings: Env }> = async (c) => {
    const resendApiKey = c.env.RESEND_API_KEY;
    const defaultFromEmail = c.env.RESEND_FROM_EMAIL || "noreply@example.com";

    if (!resendApiKey) {
        return c.json({ error: "Email service not configured" }, 500);
    }

    try {
        const body = await c.req.json();
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getSendEmailUseCase(resendApiKey, defaultFromEmail);
        const result = await useCase.execute(body);
        return c.json(result, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to send email", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/email/send", method: "POST" });
        return c.json({ error: appError.message }, 400);
    }
};

const sendWithTemplateHandler: Handler<{ Bindings: Env }> = async (c) => {
    const resendApiKey = c.env.RESEND_API_KEY;
    const defaultFromEmail = c.env.RESEND_FROM_EMAIL || "noreply@example.com";

    if (!resendApiKey) {
        return c.json({ error: "Email service not configured" }, 500);
    }

    try {
        const body = await c.req.json();
        const { templateSlug, to, variables, customerId } = body;

        if (!templateSlug || !to) {
            return c.json({ error: "templateSlug and to are required" }, 400);
        }

        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getSendEmailWithTemplateUseCase(resendApiKey, defaultFromEmail);
        const result = await useCase.execute(templateSlug, to, variables, customerId);
        return c.json(result, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to send email", {
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });
        logger.logError(appError, { route: "/api/email/send-with-template", method: "POST" });
        return c.json({ error: appError.message }, 400);
    }
};

app.openapi(listLogsRoute, listLogsHandler as any);
app.openapi(getLogRoute, getLogHandler as any);
app.openapi(listTemplatesRoute, listTemplatesHandler as any);
app.openapi(getTemplateRoute, getTemplateHandler as any);
app.openapi(createTemplateRoute, createTemplateHandler as any);
app.openapi(updateTemplateRoute, updateTemplateHandler as any);
app.openapi(deleteTemplateRoute, deleteTemplateHandler as any);
app.openapi(sendEmailRoute, sendEmailHandler as any);
app.openapi(sendWithTemplateRoute, sendWithTemplateHandler as any);

export { app as emailsRouter };
