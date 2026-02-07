import { AppError, ErrorCodes } from "@portfolio/log";
import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import { DIContainer } from "~/di/container";
import { getLogger, getMetrics } from "~/lib/logger";
import { isValidUuid } from "~/lib/validation";

export async function getCustomers(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetCustomersUseCase();
        const customers = await useCase.execute();

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/crm/customers", status: "200" }, duration);
        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/crm/customers", status: "200" });

        return c.json(customers);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch customers", {
                      metadata: { route: "/api/crm/customers" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/customers", method: "GET" });
        metrics.httpRequestErrors.inc({
            method: "GET",
            route: "/api/crm/customers",
            status: String(appError.httpStatus),
        });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getCustomerById(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid customer ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetCustomerByIdUseCase();
        const customer = await useCase.execute(id);

        if (!customer) {
            const notFoundError = AppError.fromCode(ErrorCodes.NOT_FOUND_RESOURCE, "Customer not found", {
                metadata: { id },
            });
            return c.json(notFoundError.toJSON(), notFoundError.httpStatus as StatusCode);
        }

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "GET", route: "/api/crm/customers/:id", status: "200" },
            duration,
        );

        return c.json(customer);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch customer", {
                      metadata: { route: "/api/crm/customers/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/customers/:id", method: "GET", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function createCustomer(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const body = await c.req.json();

        if (!body.name) {
            const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Name is required", {
                metadata: { field: "name" },
            });
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getCreateCustomerUseCase();
        const customer = await useCase.execute(body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "POST", route: "/api/crm/customers", status: "201" }, duration);

        return c.json(customer, 201);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create customer", {
                      metadata: { route: "/api/crm/customers" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/customers", method: "POST" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function updateCustomer(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid customer ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const body = await c.req.json();
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getUpdateCustomerUseCase();
        const customer = await useCase.execute(id, body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "PUT", route: "/api/crm/customers/:id", status: "200" },
            duration,
        );

        return c.json(customer);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to update customer", {
                      metadata: { route: "/api/crm/customers/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/customers/:id", method: "PUT", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function deleteCustomer(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid customer ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getDeleteCustomerUseCase();
        await useCase.execute(id);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "DELETE", route: "/api/crm/customers/:id", status: "204" },
            duration,
        );

        return c.body(null, 204);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to delete customer", {
                      metadata: { route: "/api/crm/customers/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/customers/:id", method: "DELETE", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getLeads(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetLeadsUseCase();
        const leads = await useCase.execute();

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/crm/leads", status: "200" }, duration);

        return c.json(leads);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch leads", {
                      metadata: { route: "/api/crm/leads" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/leads", method: "GET" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getLeadById(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid lead ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetLeadByIdUseCase();
        const lead = await useCase.execute(id);

        if (!lead) {
            const notFoundError = AppError.fromCode(ErrorCodes.NOT_FOUND_RESOURCE, "Lead not found", {
                metadata: { id },
            });
            return c.json(notFoundError.toJSON(), notFoundError.httpStatus as StatusCode);
        }

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/crm/leads/:id", status: "200" }, duration);

        return c.json(lead);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch lead", {
                      metadata: { route: "/api/crm/leads/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/leads/:id", method: "GET", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function createLead(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const body = await c.req.json();

        if (!body.name) {
            const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Name is required", {
                metadata: { field: "name" },
            });
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getCreateLeadUseCase();
        const lead = await useCase.execute(body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "POST", route: "/api/crm/leads", status: "201" }, duration);

        return c.json(lead, 201);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create lead", {
                      metadata: { route: "/api/crm/leads" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/leads", method: "POST" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function updateLead(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid lead ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const body = await c.req.json();
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getUpdateLeadUseCase();
        const lead = await useCase.execute(id, body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "PUT", route: "/api/crm/leads/:id", status: "200" }, duration);

        return c.json(lead);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to update lead", {
                      metadata: { route: "/api/crm/leads/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/leads/:id", method: "PUT", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function deleteLead(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid lead ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getDeleteLeadUseCase();
        await useCase.execute(id);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "DELETE", route: "/api/crm/leads/:id", status: "204" }, duration);

        return c.body(null, 204);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to delete lead", {
                      metadata: { route: "/api/crm/leads/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/leads/:id", method: "DELETE", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function convertLeadToDeal(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid lead ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getConvertLeadToDealUseCase();
        const lead = await useCase.execute(id);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "POST", route: "/api/crm/leads/:id/convert", status: "200" },
            duration,
        );

        return c.json(lead);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to convert lead", {
                      metadata: { route: "/api/crm/leads/:id/convert", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/leads/:id/convert", method: "POST", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getDeals(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetDealsUseCase();
        const deals = await useCase.execute();

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/crm/deals", status: "200" }, duration);

        return c.json(deals);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch deals", {
                      metadata: { route: "/api/crm/deals" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/deals", method: "GET" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getDealById(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid deal ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetDealByIdUseCase();
        const deal = await useCase.execute(id);

        if (!deal) {
            const notFoundError = AppError.fromCode(ErrorCodes.NOT_FOUND_RESOURCE, "Deal not found", {
                metadata: { id },
            });
            return c.json(notFoundError.toJSON(), notFoundError.httpStatus as StatusCode);
        }

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/crm/deals/:id", status: "200" }, duration);

        return c.json(deal);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch deal", {
                      metadata: { route: "/api/crm/deals/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/deals/:id", method: "GET", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function createDeal(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const body = await c.req.json();

        if (!body.name || !body.stageId) {
            const validationError = AppError.fromCode(
                ErrorCodes.VALIDATION_MISSING_FIELD,
                "Name and stageId are required",
                {
                    metadata: { fields: ["name", "stageId"] },
                },
            );
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getCreateDealUseCase();
        const deal = await useCase.execute(body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "POST", route: "/api/crm/deals", status: "201" }, duration);

        return c.json(deal, 201);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create deal", {
                      metadata: { route: "/api/crm/deals" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/deals", method: "POST" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function updateDeal(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid deal ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const body = await c.req.json();
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getUpdateDealUseCase();
        const deal = await useCase.execute(id, body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "PUT", route: "/api/crm/deals/:id", status: "200" }, duration);

        return c.json(deal);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to update deal", {
                      metadata: { route: "/api/crm/deals/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/deals/:id", method: "PUT", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function deleteDeal(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid deal ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getDeleteDealUseCase();
        await useCase.execute(id);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "DELETE", route: "/api/crm/deals/:id", status: "204" }, duration);

        return c.body(null, 204);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to delete deal", {
                      metadata: { route: "/api/crm/deals/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/deals/:id", method: "DELETE", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function moveDealToStage(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid deal ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const body = await c.req.json();

        if (!body.stageId) {
            const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "stageId is required", {
                metadata: { field: "stageId" },
            });
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getMoveDealToStageUseCase();
        const deal = await useCase.execute(id, body.stageId);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "PUT", route: "/api/crm/deals/:id/stage", status: "200" },
            duration,
        );

        return c.json(deal);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to move deal to stage", {
                      metadata: { route: "/api/crm/deals/:id/stage", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/deals/:id/stage", method: "PUT", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getPipelines(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetPipelinesUseCase();
        const pipelines = await useCase.execute();

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/crm/pipelines", status: "200" }, duration);

        return c.json(pipelines);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch pipelines", {
                      metadata: { route: "/api/crm/pipelines" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/pipelines", method: "GET" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function getPipelineById(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid pipeline ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getGetPipelineByIdUseCase();
        const pipeline = await useCase.execute(id);

        if (!pipeline) {
            const notFoundError = AppError.fromCode(ErrorCodes.NOT_FOUND_RESOURCE, "Pipeline not found", {
                metadata: { id },
            });
            return c.json(notFoundError.toJSON(), notFoundError.httpStatus as StatusCode);
        }

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "GET", route: "/api/crm/pipelines/:id", status: "200" },
            duration,
        );

        return c.json(pipeline);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch pipeline", {
                      metadata: { route: "/api/crm/pipelines/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/pipelines/:id", method: "GET", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function createPipeline(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const body = await c.req.json();

        if (!body.name) {
            const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Name is required", {
                metadata: { field: "name" },
            });
            return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
        }

        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getCreatePipelineUseCase();
        const pipeline = await useCase.execute(body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "POST", route: "/api/crm/pipelines", status: "201" }, duration);

        return c.json(pipeline, 201);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create pipeline", {
                      metadata: { route: "/api/crm/pipelines" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/pipelines", method: "POST" });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function updatePipeline(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid pipeline ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const body = await c.req.json();
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getUpdatePipelineUseCase();
        const pipeline = await useCase.execute(id, body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "PUT", route: "/api/crm/pipelines/:id", status: "200" },
            duration,
        );

        return c.json(pipeline);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to update pipeline", {
                      metadata: { route: "/api/crm/pipelines/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/pipelines/:id", method: "PUT", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}

export async function deletePipeline(c: Context) {
    const databaseUrl = c.env.DATABASE_URL;
    const redisUrl = c.env.CACHE_URL;
    const id = c.req.param("id");
    const logger = getLogger();
    const metrics = getMetrics();
    const startTime = Date.now();

    if (!id || !isValidUuid(id)) {
        const validationError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "Invalid pipeline ID format", {
            metadata: { field: "id", receivedValue: id },
        });
        return c.json(validationError.toJSON(), validationError.httpStatus as StatusCode);
    }

    try {
        const container = new DIContainer(databaseUrl, redisUrl);
        const useCase = container.getDeletePipelineUseCase();
        await useCase.execute(id);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "DELETE", route: "/api/crm/pipelines/:id", status: "204" },
            duration,
        );

        return c.body(null, 204);
    } catch (error) {
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to delete pipeline", {
                      metadata: { route: "/api/crm/pipelines/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/pipelines/:id", method: "DELETE", id });

        return c.json(appError.toJSON(), appError.httpStatus as StatusCode);
    }
}
