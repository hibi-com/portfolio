import type { Redis } from "ioredis";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { createRedisClient, resetRedisClient } from "./redis";

describe("createRedisClient", () => {
    let client: Redis | null = null;

    beforeEach(() => {
        client = null;
    });

    afterEach(async () => {
        resetRedisClient();
        client = null;
    });

    test("should throw error when CACHE_URL is not provided", () => {
        const originalCache = process.env.CACHE_URL;
        const originalRedis = process.env.REDIS_URL;
        delete process.env.CACHE_URL;
        delete process.env.REDIS_URL;

        expect(() => {
            createRedisClient();
        }).toThrow("CACHE_URL environment variable is required");

        if (originalCache !== undefined) process.env.CACHE_URL = originalCache;
        if (originalRedis !== undefined) process.env.REDIS_URL = originalRedis;
    });

    test("should create Redis client with redis URL", () => {
        const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

        client = createRedisClient({ redisUrl });

        expect(client).toBeDefined();
        expect(typeof client.get).toBe("function");
        expect(typeof client.set).toBe("function");
    });

    test("should create Redis client without options (using env var)", () => {
        const redisUrl = process.env.CACHE_URL || process.env.REDIS_URL || "redis://localhost:6379";
        process.env.CACHE_URL = redisUrl;

        client = createRedisClient();

        expect(client).toBeDefined();
        expect(typeof client.get).toBe("function");
        expect(typeof client.set).toBe("function");
    });

    test("should return same instance on multiple calls (singleton)", () => {
        const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

        const client1 = createRedisClient({ redisUrl });
        const client2 = createRedisClient({ redisUrl });

        expect(client1).toBe(client2);
    });

    test("should create Redis client with custom options", () => {
        const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

        client = createRedisClient({
            redisUrl,
            maxRetriesPerRequest: 5,
            lazyConnect: true,
        });

        expect(client).toBeDefined();
        expect(client.options.maxRetriesPerRequest).toBe(5);
        expect(client.options.lazyConnect).toBe(true);
    });
});
