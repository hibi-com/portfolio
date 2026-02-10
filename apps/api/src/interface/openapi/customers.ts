import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { AppError, ErrorCodes } from "@portfolio/log";
import type { Handler } from "hono";
import { DIContainer } from "~/di/container";
import { getLogger, getMetrics } from "~/lib/logger";

type Env = {
    DATABASE_URL: string;
    CACHE_URL: string;
};

const app = new OpenAPIHono<{ Bindings: Env }>();

const CustomerStatusSchema = z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).openapi("CustomerStatus");

const CustomerSchema = z
    .object({
        id: z.string().uuid(),
        name: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        website: z.string().url().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
        status: CustomerStatusSchema,
        tags: z.array(z.string()).optional(),
        customFields: z.record(z.string(), z.unknown()).optional(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    })
    .openapi("Customer");

const CreateCustomerInputSchema = z
    .object({
        name: z.string().min(1),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        website: z.string().url().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
        status: CustomerStatusSchema.optional(),
        tags: z.array(z.string()).optional(),
        customFields: z.record(z.string(), z.unknown()).optional(),
    })
    .openapi("CreateCustomerInput");

const UpdateCustomerInputSchema = z
    .object({
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        company: z.string().optional(),
        website: z.string().url().optional(),
        address: z.string().optional(),
        notes: z.string().optional(),
        status: CustomerStatusSchema.optional(),
        tags: z.array(z.string()).optional(),
        customFields: z.record(z.string(), z.unknown()).optional(),
    })
    .openapi("UpdateCustomerInput");

const ErrorResponseSchema = z
    .object({
        error: z.string(),
        details: z.unknown().optional(),
    })
    .openapi("ErrorResponse");

const IdParamSchema = z.object({
    id: z.string().uuid().openapi({ description: "Customer ID", example: "123e4567-e89b-12d3-a456-426614174000" }),
});

const listCustomersRoute = createRoute({
    method: "get",
    path: "/customers",
    tags: ["Customers"],
    summary: "List all customers",
    responses: {
        200: {
            content: { "application/json": { schema: z.array(CustomerSchema) } },
            description: "List of customers",
        },
    },
});

const getCustomerRoute = createRoute({
    method: "get",
    path: "/customers/{id}",
    tags: ["Customers"],
    summary: "Get a customer by ID",
    request: {
        params: IdParamSchema,
    },
    responses: {
        200: {
            content: { "application/json": { schema: CustomerSchema } },
            description: "Customer details",
        },
        404: {
            content: { "application/json": { schema: ErrorResponseSchema } },
            description: "Customer not found",
        },
    },
});

const createCustomerRoute = createRoute({
    method: "post",
    path: "/customers",
    tags: ["Customers"],
    summary: "Create a new customer",
    request: {
        body: {
            content: { "application/json": { schema: CreateCustomerInputSchema } },
        },
    },
    responses: {
        201: {
            content: { "application/json": { schema: CustomerSchema } },
            description: "Customer created",
        },
        400: {
            content: { "application/json": { schema: ErrorResponseSchema } },
            description: "Validation error",
        },
    },
});

const updateCustomerRoute = createRoute({
    method: "put",
    path: "/customers/{id}",
    tags: ["Customers"],
    summary: "Update a customer",
    request: {
        params: IdParamSchema,
        body: {
            content: { "application/json": { schema: UpdateCustomerInputSchema } },
        },
    },
    responses: {
        200: {
            content: { "application/json": { schema: CustomerSchema } },
            description: "Customer updated",
        },
        404: {
            content: { "application/json": { schema: ErrorResponseSchema } },
            description: "Customer not found",
        },
    },
});

const deleteCustomerRoute = createRoute({
    method: "delete",
    path: "/customers/{id}",
    tags: ["Customers"],
    summary: "Delete a customer",
    request: {
        params: IdParamSchema,
    },
    responses: {
        204: {
            description: "Customer deleted",
        },
        404: {
            content: { "application/json": { schema: ErrorResponseSchema } },
            description: "Customer not found",
        },
    },
});

const listCustomersHandler: Handler<{ Bindings: Env }> = async (c) => {
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getGetCustomersUseCase();
        const customers = await useCase.execute();

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/crm/customers", status: "200" }, duration);
        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/crm/customers", status: "200" });

        return c.json(customers, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch customers", {
                      metadata: { route: "/api/crm/customers" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/customers", method: "GET" });
        return c.json({ error: appError.message }, 500);
    }
};

const getCustomerHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getGetCustomerByIdUseCase();
        const customer = await useCase.execute(id);

        if (!customer) {
            return c.json({ error: "Customer not found" }, 404);
        }

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "GET", route: "/api/crm/customers/:id", status: "200" },
            duration,
        );

        return c.json(customer, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch customer", {
                      metadata: { route: "/api/crm/customers/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/customers/:id", method: "GET", id });
        return c.json({ error: appError.message }, 500);
    }
};

const createCustomerHandler: Handler<{ Bindings: Env }> = async (c) => {
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const body = await c.req.json();
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getCreateCustomerUseCase();
        const customer = await useCase.execute(body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "POST", route: "/api/crm/customers", status: "201" }, duration);

        return c.json(customer, 201);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create customer", {
                      metadata: { route: "/api/crm/customers" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/customers", method: "POST" });
        return c.json({ error: appError.message }, 400);
    }
};

const updateCustomerHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const body = await c.req.json();
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getUpdateCustomerUseCase();
        const customer = await useCase.execute(id, body);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "PUT", route: "/api/crm/customers/:id", status: "200" },
            duration,
        );

        return c.json(customer, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to update customer", {
                      metadata: { route: "/api/crm/customers/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/customers/:id", method: "PUT", id });
        return c.json({ error: appError.message }, 400);
    }
};

const deleteCustomerHandler: Handler<{ Bindings: Env }> = async (c) => {
    const id = c.req.param("id");
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getDeleteCustomerUseCase();
        await useCase.execute(id);

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe(
            { method: "DELETE", route: "/api/crm/customers/:id", status: "204" },
            duration,
        );

        return c.body(null, 204);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to delete customer", {
                      metadata: { route: "/api/crm/customers/:id", id },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/crm/customers/:id", method: "DELETE", id });
        return c.json({ error: appError.message }, 404);
    }
};

app.openapi(listCustomersRoute, listCustomersHandler as any);
app.openapi(getCustomerRoute, getCustomerHandler as any);
app.openapi(createCustomerRoute, createCustomerHandler as any);
app.openapi(updateCustomerRoute, updateCustomerHandler as any);
app.openapi(deleteCustomerRoute, deleteCustomerHandler as any);

export { app as customersRouter };
