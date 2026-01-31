import { AppError, ErrorCodes } from "@portfolio/log";
import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { DIContainer } from "~/di/container";
import { getLogger, getMetrics } from "~/lib/logger";
import { isValidUuid } from "~/lib/validation";

export async function getEmailLogs(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetEmailLogsUseCase();
        const logs = await useCase.execute();

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/email/logs", status: "200" }, duration);
        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/email/logs", status: "200" });

        return c.json(logs);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch email logs", {
                      metadata: { route: "/api/email/logs" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/email/logs", method: "GET" });
        metrics.httpRequestErrors.inc({
            method: "GET",
            route: "/api/email/logs",
            status: String(appError.httpStatus),
        });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getEmailLogById(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid email log ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetEmailLogByIdUseCase();
        const log = await useCase.execute(id);

        if (!log) {
            const notFoundError = AppError.fromCode(ErrorCodes.NOT_FOUND_RESOURCE, "Email log not found", {
                metadata: { id },
            });
            return c.json(notFoundError.toJSON(), notFoundError.httpStatus as StatusCode);
        }

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/email/logs/:id", status: "200" }, duration);

        return c.json(log);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch email log", {
                      metadata: { route: "/api/email/logs/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/email/logs/:id", method: "GET", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getEmailTemplates(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetEmailTemplatesUseCase();
        const templates = await useCase.execute();

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/email/templates", status: "200" }, duration);
        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/email/templates", status: "200" });

        return c.json(templates);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch email templates", {
                      metadata: { route: "/api/email/templates" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/email/templates", method: "GET" });
        metrics.httpRequestErrors.inc({
            method: "GET",
            route: "/api/email/templates",
            status: String(appError.httpStatus),
        });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getEmailTemplateById(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid template ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetEmailTemplateByIdUseCase();
        const template = await useCase.execute(id);

        if (!template) {
            const notFoundError = AppError.fromCode(ErrorCodes.NOT_FOUND_RESOURCE, "Email template not found", {
                metadata: { id },
            });
            return c.json(notFoundError.toJSON(), notFoundError.httpStatus as StatusCode);
        }

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "GET", route: "/api/email/templates/:id", status: "200" },
            duration,
        );

        return c.json(template);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch email template", {
                      metadata: { route: "/api/email/templates/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/email/templates/:id", method: "GET", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function createEmailTemplate(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const body = await c.req.json();

        if (!body.name || !body.slug || !body.subject || !body.htmlContent) {
            const validationError = AppError.fromCode(
                ErrorCodes.VALIDATION_MISSING_FIELD,
                "Name, slug, subject, and htmlContent are required",
                {
                    metadata: { fields: ["name", "slug", "subject", "htmlContent"] },
                },
            );
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getCreateEmailTemplateUseCase();
        const template = await useCase.execute(body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "POST", route: "/api/email/templates", status: "201" }, duration);

        return c.json(template, 201);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create email template", {
                      metadata: { route: "/api/email/templates" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/email/templates", method: "POST" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function updateEmailTemplate(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid template ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const body = await c.req.json();
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getUpdateEmailTemplateUseCase();
        const template = await useCase.execute(id, body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "PUT", route: "/api/email/templates/:id", status: "200" },
            duration,
        );

        return c.json(template);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to update email template", {
                      metadata: { route: "/api/email/templates/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/email/templates/:id", method: "PUT", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function deleteEmailTemplate(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid template ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getDeleteEmailTemplateUseCase();
        await useCase.execute(id);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "DELETE", route: "/api/email/templates/:id", status: "204" },
            duration,
        );

        return c.body(null, 204);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to delete email template", {
                      metadata: { route: "/api/email/templates/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/email/templates/:id", method: "DELETE", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function sendEmail(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const resendApiKey = c.env.RESEND_API_KEY;
    const defaultFromEmail = c.env.RESEND_FROM_EMAIL || "noreply@example.com";
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!resendApiKey) {
        const configError = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Email service not configured", {
            metadata: { route: "/api/email/send" },
        });
        return c.json(configError.toJSON(), configError.httpStatus as StatusCode);
    }

    try {
        const body = await c.req.json();

        if (!body.toEmail || !body.subject) {
            const validationError = AppError.fromCode(
                ErrorCodes.VALIDATION_MISSING_FIELD,
                "toEmail and subject are required",
                {
                    metadata: { fields: ["toEmail", "subject"] },
                },
            );
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        if (!body.htmlContent && !body.textContent) {
            const validationError = AppError.fromCode(
                ErrorCodes.VALIDATION_MISSING_FIELD,
                "Either htmlContent or textContent is required",
                {
                    metadata: { fields: ["htmlContent", "textContent"] },
                },
            );
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getSendEmailUseCase(resendApiKey, defaultFromEmail);
        const log = await useCase.execute(body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "POST", route: "/api/email/send", status: "200" }, duration);

        return c.json(log);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to send email", {
                      metadata: { route: "/api/email/send" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/email/send", method: "POST" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function sendEmailWithTemplate(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.REDIS_URL;
    const resendApiKey = c.env.RESEND_API_KEY;
    const defaultFromEmail = c.env.RESEND_FROM_EMAIL || "noreply@example.com";
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!resendApiKey) {
        const configError = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Email service not configured", {
            metadata: { route: "/api/email/send-with-template" },
        });
        return c.json(configError.toJSON(), configError.httpStatus as StatusCode);
    }

    try {
        const body = await c.req.json();

        if (!body.templateSlug || !body.toEmail) {
            const validationError = AppError.fromCode(
                ErrorCodes.VALIDATION_MISSING_FIELD,
                "templateSlug and toEmail are required",
                {
                    metadata: { fields: ["templateSlug", "toEmail"] },
                },
            );
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getSendEmailWithTemplateUseCase(resendApiKey, defaultFromEmail);
        const log = await useCase.execute(body.templateSlug, body.toEmail, body.variables, body.customerId);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "POST", route: "/api/email/send-with-template", status: "200" },
            duration,
        );

        return c.json(log);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to send email with template", {
                      metadata: { route: "/api/email/send-with-template" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/email/send-with-template", method: "POST" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}
