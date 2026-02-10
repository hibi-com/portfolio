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

// Schemas
const InquiryStatusSchema = z.enum(["OPEN", "IN_PROGRESS", "WAITING_CUSTOMER", "RESOLVED", "CLOSED"]).openapi("InquiryStatus");
const InquiryPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).openapi("InquiryPriority");
const InquiryCategorySchema = z.enum(["GENERAL", "SUPPORT", "SALES", "BILLING", "TECHNICAL"]).openapi("InquiryCategory");

const InquiryResponseSchema = z.object({
	id: z.string().uuid(),
	inquiryId: z.string().uuid(),
	userId: z.string().uuid().optional(),
	content: z.string(),
	isInternal: z.boolean(),
	attachments: z.array(z.string()).optional(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
}).openapi("InquiryResponse");

const InquirySchema = z.object({
	id: z.string().uuid(),
	customerId: z.string().uuid().optional(),
	assigneeId: z.string().uuid().optional(),
	subject: z.string().min(1),
	content: z.string(),
	status: InquiryStatusSchema,
	priority: InquiryPrioritySchema.optional(),
	category: InquiryCategorySchema.optional(),
	source: z.string().optional(),
	tags: z.array(z.string()).optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
}).openapi("Inquiry");

const CreateInquiryInputSchema = z.object({
	customerId: z.string().uuid().optional(),
	assigneeId: z.string().uuid().optional(),
	subject: z.string().min(1),
	content: z.string(),
	status: InquiryStatusSchema.optional(),
	priority: InquiryPrioritySchema.optional(),
	category: InquiryCategorySchema.optional(),
	source: z.string().optional(),
	tags: z.array(z.string()).optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
}).openapi("CreateInquiryInput");

const UpdateInquiryInputSchema = z.object({
	customerId: z.string().uuid().optional(),
	assigneeId: z.string().uuid().optional(),
	subject: z.string().min(1).optional(),
	content: z.string().optional(),
	status: InquiryStatusSchema.optional(),
	priority: InquiryPrioritySchema.optional(),
	category: InquiryCategorySchema.optional(),
	source: z.string().optional(),
	tags: z.array(z.string()).optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
}).openapi("UpdateInquiryInput");

const AddResponseInputSchema = z.object({
	inquiryId: z.string().uuid(),
	userId: z.string().uuid().optional(),
	content: z.string(),
	isInternal: z.boolean().optional(),
	attachments: z.array(z.string()).optional(),
}).openapi("AddResponseInput");

const ErrorResponseSchema = z.object({
	error: z.string(),
	details: z.unknown().optional(),
}).openapi("ErrorResponse");

const IdParamSchema = z.object({
	id: z.string().uuid().openapi({ description: "Inquiry ID", example: "123e4567-e89b-12d3-a456-426614174000" }),
});

// Routes
const listInquiriesRoute = createRoute({
	method: "get",
	path: "/inquiries",
	tags: ["Support"],
	summary: "List all inquiries",
	responses: {
		200: {
			content: { "application/json": { schema: z.array(InquirySchema) } },
			description: "List of inquiries",
		},
	},
});

const getInquiryRoute = createRoute({
	method: "get",
	path: "/inquiries/{id}",
	tags: ["Support"],
	summary: "Get an inquiry by ID",
	request: { params: IdParamSchema },
	responses: {
		200: {
			content: { "application/json": { schema: InquirySchema } },
			description: "Inquiry details",
		},
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Inquiry not found",
		},
	},
});

const createInquiryRoute = createRoute({
	method: "post",
	path: "/inquiries",
	tags: ["Support"],
	summary: "Create a new inquiry",
	request: {
		body: { content: { "application/json": { schema: CreateInquiryInputSchema } } },
	},
	responses: {
		201: {
			content: { "application/json": { schema: InquirySchema } },
			description: "Inquiry created",
		},
		400: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Validation error",
		},
	},
});

const updateInquiryRoute = createRoute({
	method: "put",
	path: "/inquiries/{id}",
	tags: ["Support"],
	summary: "Update an inquiry",
	request: {
		params: IdParamSchema,
		body: { content: { "application/json": { schema: UpdateInquiryInputSchema } } },
	},
	responses: {
		200: {
			content: { "application/json": { schema: InquirySchema } },
			description: "Inquiry updated",
		},
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Inquiry not found",
		},
	},
});

const deleteInquiryRoute = createRoute({
	method: "delete",
	path: "/inquiries/{id}",
	tags: ["Support"],
	summary: "Delete an inquiry",
	request: { params: IdParamSchema },
	responses: {
		204: { description: "Inquiry deleted" },
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Inquiry not found",
		},
	},
});

const resolveInquiryRoute = createRoute({
	method: "post",
	path: "/inquiries/{id}/resolve",
	tags: ["Support"],
	summary: "Resolve an inquiry",
	request: { params: IdParamSchema },
	responses: {
		200: {
			content: { "application/json": { schema: InquirySchema } },
			description: "Inquiry resolved",
		},
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Inquiry not found",
		},
	},
});

const closeInquiryRoute = createRoute({
	method: "post",
	path: "/inquiries/{id}/close",
	tags: ["Support"],
	summary: "Close an inquiry",
	request: { params: IdParamSchema },
	responses: {
		200: {
			content: { "application/json": { schema: InquirySchema } },
			description: "Inquiry closed",
		},
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Inquiry not found",
		},
	},
});

const getResponsesRoute = createRoute({
	method: "get",
	path: "/inquiries/{id}/responses",
	tags: ["Support"],
	summary: "Get responses for an inquiry",
	request: { params: IdParamSchema },
	responses: {
		200: {
			content: { "application/json": { schema: z.array(InquiryResponseSchema) } },
			description: "List of responses",
		},
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Inquiry not found",
		},
	},
});

const addResponseRoute = createRoute({
	method: "post",
	path: "/inquiries/{id}/responses",
	tags: ["Support"],
	summary: "Add a response to an inquiry",
	request: {
		params: IdParamSchema,
		body: { content: { "application/json": { schema: AddResponseInputSchema } } },
	},
	responses: {
		201: {
			content: { "application/json": { schema: InquiryResponseSchema } },
			description: "Response added",
		},
		400: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Validation error",
		},
	},
});

// Handlers
const listInquiriesHandler: Handler<{ Bindings: Env }> = async (c) => {
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getGetInquiriesUseCase();
		const inquiries = await useCase.execute();

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "GET", route: "/api/support/inquiries", status: "200" }, duration);

		return c.json(inquiries, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch inquiries", {
						metadata: { route: "/api/support/inquiries" },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/support/inquiries", method: "GET" });
		return c.json({ error: appError.message }, 500);
	}
};

const getInquiryHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	if (!isValidUuid(id)) {
		return c.json({ error: "Invalid inquiry ID format" }, 400);
	}

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getGetInquiryByIdUseCase();
		const inquiry = await useCase.execute(id);

		if (!inquiry) {
			return c.json({ error: "Inquiry not found" }, 404);
		}

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "GET", route: "/api/support/inquiries/:id", status: "200" }, duration);

		return c.json(inquiry, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch inquiry", {
						metadata: { route: "/api/support/inquiries/:id", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/support/inquiries/:id", method: "GET", id });
		return c.json({ error: appError.message }, 500);
	}
};

const createInquiryHandler: Handler<{ Bindings: Env }> = async (c) => {
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const body = await c.req.json();
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getCreateInquiryUseCase();
		const inquiry = await useCase.execute(body);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "POST", route: "/api/support/inquiries", status: "201" }, duration);

		return c.json(inquiry, 201);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create inquiry", {
						metadata: { route: "/api/support/inquiries" },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/support/inquiries", method: "POST" });
		return c.json({ error: appError.message }, 400);
	}
};

const updateInquiryHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const body = await c.req.json();
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getUpdateInquiryUseCase();
		const inquiry = await useCase.execute(id, body);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "PUT", route: "/api/support/inquiries/:id", status: "200" }, duration);

		return c.json(inquiry, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to update inquiry", {
						metadata: { route: "/api/support/inquiries/:id", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/support/inquiries/:id", method: "PUT", id });
		return c.json({ error: appError.message }, 400);
	}
};

const deleteInquiryHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getDeleteInquiryUseCase();
		await useCase.execute(id);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "DELETE", route: "/api/support/inquiries/:id", status: "204" }, duration);

		return c.body(null, 204);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to delete inquiry", {
						metadata: { route: "/api/support/inquiries/:id", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/support/inquiries/:id", method: "DELETE", id });
		return c.json({ error: appError.message }, 404);
	}
};

const resolveInquiryHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getResolveInquiryUseCase();
		const inquiry = await useCase.execute(id);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "POST", route: "/api/support/inquiries/:id/resolve", status: "200" }, duration);

		return c.json(inquiry, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to resolve inquiry", {
						metadata: { route: "/api/support/inquiries/:id/resolve", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/support/inquiries/:id/resolve", method: "POST", id });
		return c.json({ error: appError.message }, 400);
	}
};

const closeInquiryHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getCloseInquiryUseCase();
		const inquiry = await useCase.execute(id);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "POST", route: "/api/support/inquiries/:id/close", status: "200" }, duration);

		return c.json(inquiry, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to close inquiry", {
						metadata: { route: "/api/support/inquiries/:id/close", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/support/inquiries/:id/close", method: "POST", id });
		return c.json({ error: appError.message }, 400);
	}
};

const getResponsesHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getGetInquiryResponsesUseCase();
		const responses = await useCase.execute(id);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "GET", route: "/api/support/inquiries/:id/responses", status: "200" }, duration);

		return c.json(responses, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch responses", {
						metadata: { route: "/api/support/inquiries/:id/responses", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/support/inquiries/:id/responses", method: "GET", id });
		return c.json({ error: appError.message }, 500);
	}
};

const addResponseHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const body = await c.req.json();
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getAddInquiryResponseUseCase();
		const response = await useCase.execute({ ...body, inquiryId: id });

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "POST", route: "/api/support/inquiries/:id/responses", status: "201" }, duration);

		return c.json(response, 201);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to add response", {
						metadata: { route: "/api/support/inquiries/:id/responses", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/support/inquiries/:id/responses", method: "POST", id });
		return c.json({ error: appError.message }, 400);
	}
};

// Register routes
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(listInquiriesRoute, listInquiriesHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(getInquiryRoute, getInquiryHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(createInquiryRoute, createInquiryHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(updateInquiryRoute, updateInquiryHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(deleteInquiryRoute, deleteInquiryHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(resolveInquiryRoute, resolveInquiryHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(closeInquiryRoute, closeInquiryHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(getResponsesRoute, getResponsesHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(addResponseRoute, addResponseHandler as any);

export { app as inquiriesRouter };
