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

const PortfolioContentSchema = z
    .object({
        html: z.string(),
    })
    .openapi("PortfolioContent");

const PortfolioSchema = z
    .object({
        id: z.string().uuid(),
        slug: z.string(),
        title: z.string(),
        description: z.string().optional(),
        content: PortfolioContentSchema.optional(),
        coverImage: z.string().optional(),
        technologies: z.array(z.string()).optional(),
        projectUrl: z.string().optional(),
        githubUrl: z.string().optional(),
        featured: z.boolean().optional(),
        publishedAt: z.string().datetime().optional(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
    })
    .openapi("Portfolio");

const ErrorResponseSchema = z
    .object({
        error: z.string(),
        details: z.unknown().optional(),
    })
    .openapi("ErrorResponse");

const SlugParamSchema = z.object({
    slug: z.string().openapi({ description: "Portfolio slug", example: "my-portfolio-project" }),
});

const listPortfoliosRoute = createRoute({
    method: "get",
    path: "/portfolios",
    tags: ["Portfolios"],
    summary: "List all portfolios",
    responses: {
        200: {
            content: { "application/json": { schema: z.array(PortfolioSchema) } },
            description: "List of portfolios",
        },
        404: {
            content: { "application/json": { schema: ErrorResponseSchema } },
            description: "Portfolios not found",
        },
    },
});

const getPortfolioBySlugRoute = createRoute({
    method: "get",
    path: "/portfolio/{slug}",
    tags: ["Portfolios"],
    summary: "Get a portfolio by slug",
    request: {
        params: SlugParamSchema,
    },
    responses: {
        200: {
            content: { "application/json": { schema: PortfolioSchema } },
            description: "Portfolio details",
        },
        404: {
            content: { "application/json": { schema: ErrorResponseSchema } },
            description: "Portfolio not found",
        },
    },
});

const listPortfoliosHandler: Handler<{ Bindings: Env }> = async (c) => {
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getGetPortfoliosUseCase();
        const portfolios = await useCase.execute();

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/portfolios", status: "200" }, duration);
        metrics.httpRequestTotal.inc({ method: "GET", route: "/api/portfolios", status: "200" });

        if (!portfolios || portfolios.length === 0) {
            return c.json({ error: "Portfolios not found" }, 404);
        }

        return c.json(portfolios, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch portfolios", {
                      metadata: { route: "/api/portfolios" },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/portfolios", method: "GET" });
        return c.json({ error: appError.message }, 500);
    }
};

const getPortfolioBySlugHandler: Handler<{ Bindings: Env }> = async (c) => {
    const slug = c.req.param("slug");
    const metrics = getMetrics();
    const startTime = Date.now();

    try {
        const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
        const useCase = container.getGetPortfolioBySlugUseCase();
        const portfolio = await useCase.execute(slug);

        if (!portfolio) {
            return c.json({ error: "Portfolio not found" }, 404);
        }

        const duration = (Date.now() - startTime) / 1000;
        metrics.httpRequestDuration.observe({ method: "GET", route: "/api/portfolio/:slug", status: "200" }, duration);

        return c.json(portfolio, 200);
    } catch (error) {
        const logger = getLogger();
        const appError =
            error instanceof AppError
                ? error
                : AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch portfolio", {
                      metadata: { route: "/api/portfolio/:slug", slug },
                      originalError: error instanceof Error ? error : new Error(String(error)),
                  });

        logger.logError(appError, { route: "/api/portfolio/:slug", method: "GET", slug });
        return c.json({ error: appError.message }, 500);
    }
};

app.openapi(listPortfoliosRoute, listPortfoliosHandler as any);
app.openapi(getPortfolioBySlugRoute, getPortfolioBySlugHandler as any);

export { app as portfoliosRouter };
