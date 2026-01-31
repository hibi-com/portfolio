import type { Context, MiddlewareHandler, Next } from "hono";

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
    keyGenerator?: (c: Context) => string;
}

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(c: Context): string {
    return (
        c.req.header("CF-Connecting-IP") ||
        c.req.header("X-Forwarded-For")?.split(",")[0]?.trim() ||
        c.req.header("X-Real-IP") ||
        "unknown"
    );
}

function cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now >= entry.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}

export function createRateLimiter(config: RateLimitConfig): MiddlewareHandler {
    const { maxRequests, windowMs, keyGenerator } = config;

    return async (c: Context, next: Next) => {
        cleanupExpiredEntries();

        const key = keyGenerator ? keyGenerator(c) : getClientIp(c);
        const now = Date.now();
        let entry = rateLimitStore.get(key);

        if (!entry || now >= entry.resetTime) {
            entry = {
                count: 0,
                resetTime: now + windowMs,
            };
            rateLimitStore.set(key, entry);
        }

        entry.count++;

        const remaining = Math.max(0, maxRequests - entry.count);
        c.header("X-RateLimit-Limit", String(maxRequests));
        c.header("X-RateLimit-Remaining", String(remaining));
        c.header("X-RateLimit-Reset", String(Math.ceil(entry.resetTime / 1000)));

        if (entry.count > maxRequests) {
            const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
            c.header("Retry-After", String(retryAfter));

            return c.json(
                {
                    error: "Too Many Requests",
                    code: "RATE_LIMIT_EXCEEDED",
                    retryAfter,
                },
                429,
            );
        }

        await next();
    };
}

export function resetRateLimitStore(): void {
    rateLimitStore.clear();
}
