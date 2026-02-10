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
const LeadStatusSchema = z.enum(["NEW", "CONTACTED", "QUALIFIED", "UNQUALIFIED", "CONVERTED"]).openapi("LeadStatus");

const LeadSchema = z.object({
	id: z.string().uuid(),
	customerId: z.string().uuid().optional(),
	name: z.string().min(1),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	company: z.string().optional(),
	source: z.string().optional(),
	status: LeadStatusSchema,
	notes: z.string().optional(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
}).openapi("Lead");

const CreateLeadInputSchema = z.object({
	customerId: z.string().uuid().optional(),
	name: z.string().min(1),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	company: z.string().optional(),
	source: z.string().optional(),
	status: LeadStatusSchema.optional(),
	notes: z.string().optional(),
}).openapi("CreateLeadInput");

const UpdateLeadInputSchema = z.object({
	customerId: z.string().uuid().optional(),
	name: z.string().min(1).optional(),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	company: z.string().optional(),
	source: z.string().optional(),
	status: LeadStatusSchema.optional(),
	notes: z.string().optional(),
}).openapi("UpdateLeadInput");

const ErrorResponseSchema = z.object({
	error: z.string(),
	details: z.unknown().optional(),
}).openapi("ErrorResponse");

const IdParamSchema = z.object({
	id: z.string().uuid().openapi({ description: "Lead ID", example: "123e4567-e89b-12d3-a456-426614174000" }),
});

// Routes
const listLeadsRoute = createRoute({
	method: "get",
	path: "/leads",
	tags: ["Leads"],
	summary: "List all leads",
	responses: {
		200: {
			content: { "application/json": { schema: z.array(LeadSchema) } },
			description: "List of leads",
		},
	},
});

const getLeadRoute = createRoute({
	method: "get",
	path: "/leads/{id}",
	tags: ["Leads"],
	summary: "Get a lead by ID",
	request: { params: IdParamSchema },
	responses: {
		200: {
			content: { "application/json": { schema: LeadSchema } },
			description: "Lead details",
		},
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Lead not found",
		},
	},
});

const createLeadRoute = createRoute({
	method: "post",
	path: "/leads",
	tags: ["Leads"],
	summary: "Create a new lead",
	request: {
		body: { content: { "application/json": { schema: CreateLeadInputSchema } } },
	},
	responses: {
		201: {
			content: { "application/json": { schema: LeadSchema } },
			description: "Lead created",
		},
		400: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Validation error",
		},
	},
});

const updateLeadRoute = createRoute({
	method: "put",
	path: "/leads/{id}",
	tags: ["Leads"],
	summary: "Update a lead",
	request: {
		params: IdParamSchema,
		body: { content: { "application/json": { schema: UpdateLeadInputSchema } } },
	},
	responses: {
		200: {
			content: { "application/json": { schema: LeadSchema } },
			description: "Lead updated",
		},
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Lead not found",
		},
	},
});

const deleteLeadRoute = createRoute({
	method: "delete",
	path: "/leads/{id}",
	tags: ["Leads"],
	summary: "Delete a lead",
	request: { params: IdParamSchema },
	responses: {
		204: { description: "Lead deleted" },
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Lead not found",
		},
	},
});

const convertLeadRoute = createRoute({
	method: "post",
	path: "/leads/{id}/convert",
	tags: ["Leads"],
	summary: "Convert lead to deal",
	request: { params: IdParamSchema },
	responses: {
		200: {
			content: { "application/json": { schema: z.object({ dealId: z.string().uuid() }) } },
			description: "Lead converted to deal",
		},
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Lead not found",
		},
	},
});

// Handlers
const listLeadsHandler: Handler<{ Bindings: Env }> = async (c) => {
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getGetLeadsUseCase();
		const leads = await useCase.execute();

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "GET", route: "/api/crm/leads", status: "200" }, duration);

		return c.json(leads, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch leads", {
						metadata: { route: "/api/crm/leads" },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/crm/leads", method: "GET" });
		return c.json({ error: appError.message }, 500);
	}
};

const getLeadHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	if (!isValidUuid(id)) {
		return c.json({ error: "Invalid lead ID format" }, 400);
	}

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getGetLeadByIdUseCase();
		const lead = await useCase.execute(id);

		if (!lead) {
			return c.json({ error: "Lead not found" }, 404);
		}

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "GET", route: "/api/crm/leads/:id", status: "200" }, duration);

		return c.json(lead, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch lead", {
						metadata: { route: "/api/crm/leads/:id", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/crm/leads/:id", method: "GET", id });
		return c.json({ error: appError.message }, 500);
	}
};

const createLeadHandler: Handler<{ Bindings: Env }> = async (c) => {
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const body = await c.req.json();
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getCreateLeadUseCase();
		const lead = await useCase.execute(body);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "POST", route: "/api/crm/leads", status: "201" }, duration);

		return c.json(lead, 201);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create lead", {
						metadata: { route: "/api/crm/leads" },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/crm/leads", method: "POST" });
		return c.json({ error: appError.message }, 400);
	}
};

const updateLeadHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const body = await c.req.json();
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getUpdateLeadUseCase();
		const lead = await useCase.execute(id, body);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "PUT", route: "/api/crm/leads/:id", status: "200" }, duration);

		return c.json(lead, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to update lead", {
						metadata: { route: "/api/crm/leads/:id", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/crm/leads/:id", method: "PUT", id });
		return c.json({ error: appError.message }, 400);
	}
};

const deleteLeadHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getDeleteLeadUseCase();
		await useCase.execute(id);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "DELETE", route: "/api/crm/leads/:id", status: "204" }, duration);

		return c.body(null, 204);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to delete lead", {
						metadata: { route: "/api/crm/leads/:id", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/crm/leads/:id", method: "DELETE", id });
		return c.json({ error: appError.message }, 404);
	}
};

const convertLeadHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getConvertLeadToDealUseCase();
		const deal = await useCase.execute(id);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "POST", route: "/api/crm/leads/:id/convert", status: "200" }, duration);

		return c.json({ dealId: deal.id }, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to convert lead", {
						metadata: { route: "/api/crm/leads/:id/convert", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/crm/leads/:id/convert", method: "POST", id });
		return c.json({ error: appError.message }, 400);
	}
};

// Register routes
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(listLeadsRoute, listLeadsHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(getLeadRoute, getLeadHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(createLeadRoute, createLeadHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(updateLeadRoute, updateLeadHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(deleteLeadRoute, deleteLeadHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(convertLeadRoute, convertLeadHandler as any);

export { app as leadsRouter };
