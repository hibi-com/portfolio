import { Hono } from "hono";
import { authenticate } from "../middleware/auth";
import { createRateLimiter } from "../middleware/rateLimit";
import { getPortfolioBySlug, getPortfolios, uploadPortfolioImage } from "./portfolios";
import { getPostBySlug, getPosts } from "./posts";

const uploadRateLimiter = createRateLimiter({
    maxRequests: 10,
    windowMs: 60000,
});

export const restRouter = new Hono();

restRouter.get("/posts", getPosts);
restRouter.get("/post/:slug", getPostBySlug);
restRouter.get("/portfolios", getPortfolios);
restRouter.get("/portfolio/:slug", getPortfolioBySlug);
restRouter.post("/portfolios/:portfolioId/images", uploadRateLimiter, async (c) => {
    const user = await authenticate(c);

    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }

    return uploadPortfolioImage(c);
});
