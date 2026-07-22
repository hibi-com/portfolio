import type { Env } from "./env";
import { createPrismaClient } from "@portfolio/db";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { openapiRouter } from "./interface/openapi";
import { getLogger, initLogger } from "./lib/logger";

export { ChatRoomDO } from "./interface/websocket/ChatRoomDO";
export type { Env } from "./env";

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
        const prisma = createPrismaClient({ d1: c.env.DB, databaseUrl: c.env.DATABASE_URL });
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

app.route("/api", openapiRouter);

export default app;
