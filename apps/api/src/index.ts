import type { DurableObjectNamespace } from "@cloudflare/workers-types";
import { createPrismaClient } from "@portfolio/db";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { openapiRouter } from "./interface/openapi";
import { ChatRoomDO } from "./interface/websocket/ChatRoomDO";
import { getLogger, initLogger } from "./lib/logger";

export { ChatRoomDO };

type Env = {
	DATABASE_URL: string;
	CACHE_URL?: string;
	NODE_ENV: string;
	SENTRY_DSN?: string;
	APP_VERSION?: string;
	BETTER_AUTH_URL?: string;
	BETTER_AUTH_SECRET?: string;
	GOOGLE_CLIENT_ID?: string;
	GOOGLE_CLIENT_SECRET?: string;
	CORS_ORIGINS?: string;
	RESEND_API_KEY?: string;
	RESEND_FROM_EMAIL?: string;
	CHAT_ROOMS?: DurableObjectNamespace;
	FREEE_CLIENT_ID?: string;
	FREEE_CLIENT_SECRET?: string;
	FREEE_AUTH_BASE_URL?: string;
	FREEE_API_BASE_URL?: string;
};

const app = new Hono<{ Bindings: Env }>();

let initialized = false;

app.use("*", async (c, next) => {
	if (!initialized) {
		initLogger({
			SENTRY_DSN: c.env.SENTRY_DSN,
			NODE_ENV: c.env.NODE_ENV,
			APP_VERSION: c.env.APP_VERSION,
		});
		initialized = true;
	}
	return next();
});

app.use(
	"*",
	secureHeaders({
		xFrameOptions: "DENY",
		xContentTypeOptions: "nosniff",
		referrerPolicy: "strict-origin-when-cross-origin",
		xXssProtection: "1; mode=block",
	}),
);

app.use("*", async (c, next) => {
	const corsOrigins = c.env.CORS_ORIGINS;

	const allowedOrigins = corsOrigins
		? corsOrigins.split(",").map((o) => o.trim())
		: ["http://localhost:3000", "http://localhost:5173", "http://localhost:8787"];

	const corsMiddleware = cors({
		origin: allowedOrigins,
		credentials: true,
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
		exposeHeaders: ["Content-Length", "X-Request-Id"],
		maxAge: 86400,
	});

	return corsMiddleware(c, next);
});

app.get("/health", async (c) => {
	const health = {
		status: "ok",
		version: c.env.APP_VERSION || "unknown",
		environment: c.env.NODE_ENV,
		database: "unknown" as "ok" | "error" | "unknown",
	};

	try {
		const prisma = createPrismaClient({ databaseUrl: c.env.DATABASE_URL });
		await prisma.$queryRaw`SELECT 1`;
		health.database = "ok";
	} catch (error) {
		const errorInstance = error instanceof Error ? error : new Error(String(error));
		getLogger().error("Database health check failed", errorInstance);
		health.database = "error";
		health.status = "degraded";
	}

	const statusCode = health.status === "ok" ? 200 : 503;
	return c.json(health, statusCode);
});

// OpenAPI routes - complete migration from rest router
app.route("/api", openapiRouter);

export default app;
