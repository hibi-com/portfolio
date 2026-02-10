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

// Schemas
const PostContentSchema = z.object({
	html: z.string(),
}).openapi("PostContent");

const PostSchema = z.object({
	id: z.string().uuid(),
	slug: z.string(),
	title: z.string(),
	excerpt: z.string().optional(),
	content: PostContentSchema.optional(),
	coverImage: z.string().optional(),
	publishedAt: z.string().datetime().optional(),
	author: z.string().optional(),
	tags: z.array(z.string()).optional(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
}).openapi("Post");

const ErrorResponseSchema = z.object({
	error: z.string(),
	details: z.unknown().optional(),
}).openapi("ErrorResponse");

const SlugParamSchema = z.object({
	slug: z.string().openapi({ description: "Post slug", example: "my-first-post" }),
});

// Routes
const listPostsRoute = createRoute({
	method: "get",
	path: "/posts",
	tags: ["Posts"],
	summary: "List all posts",
	responses: {
		200: {
			content: { "application/json": { schema: z.array(PostSchema) } },
			description: "List of posts",
		},
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Posts not found",
		},
	},
});

const getPostBySlugRoute = createRoute({
	method: "get",
	path: "/post/{slug}",
	tags: ["Posts"],
	summary: "Get a post by slug",
	request: {
		params: SlugParamSchema,
	},
	responses: {
		200: {
			content: { "application/json": { schema: PostSchema } },
			description: "Post details",
		},
		404: {
			content: { "application/json": { schema: ErrorResponseSchema } },
			description: "Post not found",
		},
	},
});

// Handlers
const listPostsHandler: Handler<{ Bindings: Env }> = async (c) => {
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getGetPostsUseCase();
		const posts = await useCase.execute();

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "GET", route: "/api/posts", status: "200" }, duration);
		metrics.httpRequestTotal.inc({ method: "GET", route: "/api/posts", status: "200" });

		if (!posts || posts.length === 0) {
			return c.json({ error: "Posts not found" }, 404);
		}

		return c.json(posts, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch posts", {
						metadata: { route: "/api/posts" },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/posts", method: "GET" });
		return c.json({ error: appError.message }, 500);
	}
};

const getPostBySlugHandler: Handler<{ Bindings: Env }> = async (c) => {
	const slug = c.req.param("slug");
	const metrics = getMetrics();
	const startTime = Date.now();

	try {
		const container = new DIContainer(c.env.DATABASE_URL, c.env.CACHE_URL);
		const useCase = container.getGetPostBySlugUseCase();
		const post = await useCase.execute(slug);

		if (!post) {
			return c.json({ error: "Post not found" }, 404);
		}

		const duration = (Date.now() - startTime) / 1000;
		metrics.httpRequestDuration.observe({ method: "GET", route: "/api/post/:slug", status: "200" }, duration);

		return c.json(post, 200);
	} catch (error) {
		const logger = getLogger();
		const appError =
			error instanceof AppError
				? error
				: AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "Failed to fetch post", {
						metadata: { route: "/api/post/:slug", slug },
						originalError: error instanceof Error ? error : new Error(String(error)),
				  });

		logger.logError(appError, { route: "/api/post/:slug", method: "GET", slug });
		return c.json({ error: appError.message }, 500);
	}
};

// biome-ignore lint/suspicious/noExplicitAny: PoC - type safety will be improved
app.openapi(listPostsRoute, listPostsHandler as any);
// biome-ignore lint/suspicious/noExplicitAny: PoC - type safety will be improved
app.openapi(getPostBySlugRoute, getPostBySlugHandler as any);

export { app as postsRouter };
