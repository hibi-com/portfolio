import { Hono } from "hono";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createRateLimiter, type RateLimitConfig, resetRateLimitStore } from "./rateLimit";

describe("Rate Limiter Middleware", () => {
    let app: Hono;

    beforeEach(() => {
        vi.useFakeTimers();
        resetRateLimitStore();
        app = new Hono();
    });

    afterEach(() => {
        vi.useRealTimers();
        resetRateLimitStore();
    });

    test("should allow requests under the limit", async () => {
        const config: RateLimitConfig = {
            maxRequests: 5,
            windowMs: 60000,
        };
        const rateLimiter = createRateLimiter(config);

        app.use("*", rateLimiter);
        app.get("/test", (c) => c.json({ status: "ok" }));

        for (let i = 0; i < 5; i++) {
            const response = await app.request("/test", {
                headers: { "CF-Connecting-IP": "192.168.1.1" },
            });
            expect(response.status).toBe(200);
        }
    });

    test("should block requests over the limit", async () => {
        const config: RateLimitConfig = {
            maxRequests: 3,
            windowMs: 60000,
        };
        const rateLimiter = createRateLimiter(config);

        app.use("*", rateLimiter);
        app.get("/test", (c) => c.json({ status: "ok" }));

        for (let i = 0; i < 3; i++) {
            const response = await app.request("/test", {
                headers: { "CF-Connecting-IP": "192.168.1.1" },
            });
            expect(response.status).toBe(200);
        }

        const blockedResponse = await app.request("/test", {
            headers: { "CF-Connecting-IP": "192.168.1.1" },
        });
        expect(blockedResponse.status).toBe(429);
        const data = await blockedResponse.json();
        expect(data).toHaveProperty("error");
    });

    test("should reset count after window expires", async () => {
        const config: RateLimitConfig = {
            maxRequests: 2,
            windowMs: 60000,
        };
        const rateLimiter = createRateLimiter(config);

        app.use("*", rateLimiter);
        app.get("/test", (c) => c.json({ status: "ok" }));

        for (let i = 0; i < 2; i++) {
            await app.request("/test", {
                headers: { "CF-Connecting-IP": "192.168.1.1" },
            });
        }

        const blockedResponse = await app.request("/test", {
            headers: { "CF-Connecting-IP": "192.168.1.1" },
        });
        expect(blockedResponse.status).toBe(429);

        vi.advanceTimersByTime(60001);

        const allowedResponse = await app.request("/test", {
            headers: { "CF-Connecting-IP": "192.168.1.1" },
        });
        expect(allowedResponse.status).toBe(200);
    });

    test("should track different IPs separately", async () => {
        const config: RateLimitConfig = {
            maxRequests: 2,
            windowMs: 60000,
        };
        const rateLimiter = createRateLimiter(config);

        app.use("*", rateLimiter);
        app.get("/test", (c) => c.json({ status: "ok" }));

        for (let i = 0; i < 2; i++) {
            await app.request("/test", {
                headers: { "CF-Connecting-IP": "192.168.1.1" },
            });
        }

        const response = await app.request("/test", {
            headers: { "CF-Connecting-IP": "192.168.1.2" },
        });
        expect(response.status).toBe(200);
    });

    test("should include rate limit headers", async () => {
        const config: RateLimitConfig = {
            maxRequests: 5,
            windowMs: 60000,
        };
        const rateLimiter = createRateLimiter(config);

        app.use("*", rateLimiter);
        app.get("/test", (c) => c.json({ status: "ok" }));

        const response = await app.request("/test", {
            headers: { "CF-Connecting-IP": "192.168.1.1" },
        });

        expect(response.headers.get("X-RateLimit-Limit")).toBe("5");
        expect(response.headers.get("X-RateLimit-Remaining")).toBe("4");
    });
});
