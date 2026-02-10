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
const DealStatusSchema = z.enum(["OPEN", "WON", "LOST", "STALLED"]).openapi("DealStatus");

const DealSchema = z.object({
	id: z.string().uuid(),
	customerId: z.string().uuid().optional(),
	leadId: z.string().uuid().optional(),
	stageId: z.string().uuid(),
	name: z.string().min(1),
	value: z.number().optional(),
	currency: z.string().optional(),
	status: DealStatusSchema,
	expectedCloseDate: z.string().datetime().optional(),
	notes: z.string().optional(),
	lostReason: z.string().optional(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
}).openapi("Deal");

const CreateDealInputSchema = z.object({
	customerId: z.string().uuid().optional(),
	leadId: z.string().uuid().optional(),
	stageId: z.string().uuid(),
	name: z.string().min(1),
	value: z.number().optional(),
	currency: z.string().optional(),
	status: DealStatusSchema.optional(),
	expectedCloseDate: z.string().datetime().optional(),
	notes: z.string().optional(),
}).openapi("CreateDealInput");

const UpdateDealInputSchema = z.object({
	customerId: z.string().uuid().optional(),
	stageId: z.string().uuid().optional(),
	name: z.string().min(1).optional(),
	value: z.number().optional(),
	currency: z.string().optional(),
	status: DealStatusSchema.optional(),
	expectedCloseDate: z.string().datetime().optional(),
	notes: z.string().optional(),
	lostReason: z.string().optional(),
}).openapi("UpdateDealInput");

const ErrorResponseSchema = z.object({
	error: z.string(),
	details: z.unknown().optional(),
}).openapi("ErrorResponse");

const IdParamSchema = z.object({
	id: z.string().uuid().openapi({ description: "Deal ID", example: "123e4567-e89b-12d3-a456-426614174000" }),
});

// Routes
const listDealsRoute = createRoute({
	method: "get",
	path: "/deals",
	tags: ["Deals"],
	summary: "List all deals",
	responses: {
		200: {
			content: { "application/json": { schema: z.array(DealSchema) } },
			description: "List of deals",
		},
	},
});

const getDealRoute = createRoute({
	method: "get",
	path: "/deals/{id}",
	tags: ["Deals"],
	summary: "Get a deal by ID",
	request: { params: IdParamSchema },
	responses: {
		200: {
			content: { "application/json": { schema: DealSchema } },
			description: "Deal details",
		},
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Deal not found",
		},
	},
});

const createDealRoute = createRoute({
	method: "post",
	path: "/deals",
	tags: ["Deals"],
	summary: "Create a new deal",
	request: {
		body: { content: { "application/json": { schema: CreateDealInputSchema } } },
	},
	responses: {
		201: {
			content: { "application/json": { schema: DealSchema } },
			description: "Deal created",
		},
		400: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Validation error",
		},
	},
});

const updateDealRoute = createRoute({
	method: "put",
	path: "/deals/{id}",
	tags: ["Deals"],
	summary: "Update a deal",
	request: {
		params: IdParamSchema,
		body: { content: { "application/json": { schema: UpdateDealInputSchema } } },
	},
	responses: {
		200: {
			content: { "application/json": { schema: DealSchema } },
			description: "Deal updated",
		},
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Deal not found",
		},
	},
});

const deleteDealRoute = createRoute({
	method: "delete",
	path: "/deals/{id}",
	tags: ["Deals"],
	summary: "Delete a deal",
	request: { params: IdParamSchema },
	responses: {
		204: { description: "Deal deleted" },
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Deal not found",
		},
	},
});

const moveDealToStageRoute = createRoute({
	method: "put",
	path: "/deals/{id}/stage",
	tags: ["Deals"],
	summary: "Move deal to a different stage",
	request: {
		params: IdParamSchema,
		body: { content: { "application/json": { schema: z.object({ stageId: z.string().uuid() }) } } },
	},
	responses: {
		200: {
			content: { "application/json": { schema: DealSchema } },
			description: "Deal moved to new stage",
		},
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Deal not found",
		},
	},
});

// Handlers
const listDealsHandler: Handler<{ Bindings: Env }> = async (c) => {
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getGetDealsUseCase();
		const deals = await useCase.execute();

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "GET", route: "/api/crm/deals", status: "200" }, duration);

		return c.json(deals, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch deals", {
						metadata: { route: "/api/crm/deals" },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/crm/deals", method: "GET" });
		return c.json({ error: appError.message }, 500);
	}
};

const getDealHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	if (!isValidUuid(id)) {
		return c.json({ error: "Invalid deal ID format" }, 400);
	}

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getGetDealByIdUseCase();
		const deal = await useCase.execute(id);

		if (!deal) {
			return c.json({ error: "Deal not found" }, 404);
		}

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "GET", route: "/api/crm/deals/:id", status: "200" }, duration);

		return c.json(deal, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch deal", {
						metadata: { route: "/api/crm/deals/:id", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/crm/deals/:id", method: "GET", id });
		return c.json({ error: appError.message }, 500);
	}
};

const createDealHandler: Handler<{ Bindings: Env }> = async (c) => {
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const body = await c.req.json();
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getCreateDealUseCase();
		const deal = await useCase.execute(body);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "POST", route: "/api/crm/deals", status: "201" }, duration);

		return c.json(deal, 201);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to create deal", {
						metadata: { route: "/api/crm/deals" },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/crm/deals", method: "POST" });
		return c.json({ error: appError.message }, 400);
	}
};

const updateDealHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const body = await c.req.json();
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getUpdateDealUseCase();
		const deal = await useCase.execute(id, body);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "PUT", route: "/api/crm/deals/:id", status: "200" }, duration);

		return c.json(deal, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to update deal", {
						metadata: { route: "/api/crm/deals/:id", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/crm/deals/:id", method: "PUT", id });
		return c.json({ error: appError.message }, 400);
	}
};

const deleteDealHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getDeleteDealUseCase();
		await useCase.execute(id);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "DELETE", route: "/api/crm/deals/:id", status: "204" }, duration);

		return c.body(null, 204);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to delete deal", {
						metadata: { route: "/api/crm/deals/:id", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/crm/deals/:id", method: "DELETE", id });
		return c.json({ error: appError.message }, 404);
	}
};

const moveDealToStageHandler: Handler<{ Bindings: Env }> = async (c) => {
	const id = c.req.param("id");
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const { stageId } = await c.req.json();
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getMoveDealToStageUseCase();
		const deal = await useCase.execute(id, stageId);

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "PUT", route: "/api/crm/deals/:id/stage", status: "200" }, duration);

		return c.json(deal, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to move deal", {
						metadata: { route: "/api/crm/deals/:id/stage", id },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/crm/deals/:id/stage", method: "PUT", id });
		return c.json({ error: appError.message }, 400);
	}
};

// Register routes
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(listDealsRoute, listDealsHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(getDealRoute, getDealHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(createDealRoute, createDealHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(updateDealRoute, updateDealHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(deleteDealRoute, deleteDealHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC
app.openapi(moveDealToStageRoute, moveDealToStageHandler as any);

export { app as dealsRouter };
