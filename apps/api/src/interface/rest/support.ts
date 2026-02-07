import { AppError, ErrorCodes } from "@portfolio/log";
import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { DIContainer } from "~/di/container";
import { getLogger, getMetrics } from "~/lib/logger";
import { isValidUuid } from "~/lib/validation";

export async function getInquiries(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetInquiriesUseCase();
        const inquiries = await useCase.execute();

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "GET", route: "/api/support/inquiries", status: "200" },
            duration,
        );
        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/support/inquiries", status: "200" });

        return c.json(inquiries);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch inquiries", {
                      metadata: { route: "/api/support/inquiries" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/support/inquiries", method: "GET" });
        metrics.httpRequestErrors.inc({
            method: "GET",
            route: "/api/support/inquiries",
            status: String(appError.httpStatus),
        });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getInquiryById(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid inquiry ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetInquiryByIdUseCase();
        const inquiry = await useCase.execute(id);

        if (!inquiry) {
            const notFoundError = AppError.fromCode(ErrorCodes.NOT_FOUND_RESOURCE, "Inquiry not found", {
                metadata: { id },
            });
            return c.json(notFoundError.toJSON(), notFoundError.httpStatus as StatusCode);
        }

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "GET", route: "/api/support/inquiries/:id", status: "200" },
            duration,
        );

        return c.json(inquiry);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch inquiry", {
                      metadata: { route: "/api/support/inquiries/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/support/inquiries/:id", method: "GET", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function createInquiry(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const body = await c.req.json();

        if (!body.subject || !body.content) {
            const validationError = AppError.fromCode(
                ErrorCodes.VALIDATION_MISSING_FIELD,
                "Subject and content are required",
                {
                    metadata: { fields: ["subject", "content"] },
                },
            );
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getCreateInquiryUseCase();
        const inquiry = await useCase.execute(body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "POST", route: "/api/support/inquiries", status: "201" },
            duration,
        );

        return c.json(inquiry, 201);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create inquiry", {
                      metadata: { route: "/api/support/inquiries" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/support/inquiries", method: "POST" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function updateInquiry(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid inquiry ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const body = await c.req.json();
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getUpdateInquiryUseCase();
        const inquiry = await useCase.execute(id, body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "PUT", route: "/api/support/inquiries/:id", status: "200" },
            duration,
        );

        return c.json(inquiry);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to update inquiry", {
                      metadata: { route: "/api/support/inquiries/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/support/inquiries/:id", method: "PUT", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function deleteInquiry(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid inquiry ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getDeleteInquiryUseCase();
        await useCase.execute(id);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "DELETE", route: "/api/support/inquiries/:id", status: "204" },
            duration,
        );

        return c.body(null, 204);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to delete inquiry", {
                      metadata: { route: "/api/support/inquiries/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/support/inquiries/:id", method: "DELETE", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function resolveInquiry(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid inquiry ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getResolveInquiryUseCase();
        const inquiry = await useCase.execute(id);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "POST", route: "/api/support/inquiries/:id/resolve", status: "200" },
            duration,
        );

        return c.json(inquiry);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to resolve inquiry", {
                      metadata: { route: "/api/support/inquiries/:id/resolve", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/support/inquiries/:id/resolve", method: "POST", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function closeInquiry(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid inquiry ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getCloseInquiryUseCase();
        const inquiry = await useCase.execute(id);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "POST", route: "/api/support/inquiries/:id/close", status: "200" },
            duration,
        );

        return c.json(inquiry);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to close inquiry", {
                      metadata: { route: "/api/support/inquiries/:id/close", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/support/inquiries/:id/close", method: "POST", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function addInquiryResponse(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const inquiryId = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!inquiryId || !isValidUuid(inquiryId)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid inquiry ID format", {
            metadata: { field: "id", receivedValue: inquiryId },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const body = await c.req.json();

        if (!body.content) {
            const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Content is required", {
                metadata: { field: "content" },
            });
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getAddInquiryResponseUseCase();
        const response = await useCase.execute({
            inquiryId,
            ...body,
        });

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "POST", route: "/api/support/inquiries/:id/responses", status: "201" },
            duration,
        );

        return c.json(response, 201);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to add response", {
                      metadata: { route: "/api/support/inquiries/:id/responses", inquiryId },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/support/inquiries/:id/responses", method: "POST", inquiryId });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getInquiryResponses(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const inquiryId = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!inquiryId || !isValidUuid(inquiryId)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid inquiry ID format", {
            metadata: { field: "id", receivedValue: inquiryId },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetInquiryResponsesUseCase();
        const responses = await useCase.execute(inquiryId);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "GET", route: "/api/support/inquiries/:id/responses", status: "200" },
            duration,
        );

        return c.json(responses);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch responses", {
                      metadata: { route: "/api/support/inquiries/:id/responses", inquiryId },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/support/inquiries/:id/responses", method: "GET", inquiryId });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}
