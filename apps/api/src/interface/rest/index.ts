import { Hono } from "hono";
import { authenticate } from "../middleware/auth";
import { createRateLimiter } from "../middleware/rateLimit";
import {
    convertLeadToDeal,
    createCustomer,
    createDeal,
    createLead,
    createPipeline,
    deleteCustomer,
    deleteDeal,
    deleteLead,
    deletePipeline,
    getCustomerById,
    getCustomers,
    getDealById,
    getDeals,
    getLeadById,
    getLeads,
    getPipelineById,
    getPipelines,
    moveDealToStage,
    updateCustomer,
    updateDeal,
    updateLead,
    updatePipeline,
} from "./crm";
import { getPortfolioBySlug, getPortfolios, uploadPortfolioImage } from "./portfolios";
import { getPostBySlug, getPosts } from "./posts";

const uploadRateLimiter = createRateLimiter({
    maxRequests: 10,
    windowMs: 60000,
});

const crmRateLimiter = createRateLimiter({
    maxRequests: 100,
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

restRouter.get("/crm/customers", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return getCustomers(c);
});

restRouter.get("/crm/customers/:id", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return getCustomerById(c);
});

restRouter.post("/crm/customers", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return createCustomer(c);
});

restRouter.put("/crm/customers/:id", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return updateCustomer(c);
});

restRouter.delete("/crm/customers/:id", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return deleteCustomer(c);
});

restRouter.get("/crm/leads", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return getLeads(c);
});

restRouter.get("/crm/leads/:id", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return getLeadById(c);
});

restRouter.post("/crm/leads", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return createLead(c);
});

restRouter.put("/crm/leads/:id", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return updateLead(c);
});

restRouter.delete("/crm/leads/:id", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return deleteLead(c);
});

restRouter.post("/crm/leads/:id/convert", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return convertLeadToDeal(c);
});

restRouter.get("/crm/deals", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return getDeals(c);
});

restRouter.get("/crm/deals/:id", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return getDealById(c);
});

restRouter.post("/crm/deals", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return createDeal(c);
});

restRouter.put("/crm/deals/:id", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return updateDeal(c);
});

restRouter.delete("/crm/deals/:id", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return deleteDeal(c);
});

restRouter.put("/crm/deals/:id/stage", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return moveDealToStage(c);
});

restRouter.get("/crm/pipelines", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return getPipelines(c);
});

restRouter.get("/crm/pipelines/:id", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return getPipelineById(c);
});

restRouter.post("/crm/pipelines", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return createPipeline(c);
});

restRouter.put("/crm/pipelines/:id", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return updatePipeline(c);
});

restRouter.delete("/crm/pipelines/:id", crmRateLimiter, async (c) => {
    const user = await authenticate(c);
    if (!user) {
        return c.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, 401);
    }
    return deletePipeline(c);
});
