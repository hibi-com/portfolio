import { createRedisClient } from "@portfolio/cache";
import { AppError, ErrorCodes } from "@portfolio/log";
import type { Redis } from "ioredis";
import { getLogger, getMetrics } from "~/lib/logger";

export class CacheService {
    private redis: Redis | null = null;
    private readonly ttl: number;
    private readonly logger = getLogger();
    private readonly metrics = getMetrics();

    constructor(
        private readonly redisUrl?: string,
        ttlSeconds: number = 3600,
    ) {
        this.ttl = ttlSeconds;
    }

    private getRedis(): Redis | null {
        if (this.redis) {
            return this.redis;
        }

        try {
            this.redis = createRedisClient({
                redisUrl: this.redisUrl,
                lazyConnect: false,
            });
            return this.redis;
        } catch (error) {
            const appError = AppError.fromCode(
                ErrorCodes.CACHE_CONNECTION_ERROR,
                "Redis接続に失敗しました。DBから直接読み取ります",
                {
                    metadata: { redisUrl: this.redisUrl },
                    originalError: error instanceof Error ? error : new Error(String(error)),
                },
            );
            this.logger.warn(appError.message, { error: appError });
            this.metrics.cacheOperations.inc({ operation: "connect", status: "error" });
            return null;
        }
    }

    private reviver(_key: string, value: unknown): unknown {
        if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/.test(value)) {
            return new Date(value);
        }
        return value;
    }

    async get<T>(key: string): Promise<T | null> {
        const redis = this.getRedis();
        if (!redis) {
            this.metrics.cacheMisses.inc({ key });
            return null;
        }

        try {
            const value = await redis.get(key);
            if (!value) {
                this.metrics.cacheMisses.inc({ key });
                return null;
            }
            this.metrics.cacheHits.inc({ key });
            return JSON.parse(value, this.reviver.bind(this)) as T;
        } catch (error) {
            const appError = AppError.fromCode(ErrorCodes.CACHE_OPERATION_ERROR, `Redis取得エラー (key: ${key})`, {
                metadata: { key, operation: "get" },
                originalError: error instanceof Error ? error : new Error(String(error)),
            });
            this.logger.warn(appError.message, { error: appError });
            this.metrics.cacheOperations.inc({ operation: "get", status: "error" });
            this.metrics.cacheMisses.inc({ key });
            return null;
        }
    }

    async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
        const redis = this.getRedis();
        if (!redis) {
            return;
        }

        const ttl = ttlSeconds ?? this.ttl;
        try {
            await redis.setex(key, ttl, JSON.stringify(value));
            this.metrics.cacheOperations.inc({ operation: "set", status: "success" });
        } catch (error) {
            const appError = AppError.fromCode(ErrorCodes.CACHE_OPERATION_ERROR, `Redis書き込みエラー (key: ${key})`, {
                metadata: { key, operation: "set", ttl },
                originalError: error instanceof Error ? error : new Error(String(error)),
            });
            this.logger.warn(appError.message, { error: appError });
            this.metrics.cacheOperations.inc({ operation: "set", status: "error" });
        }
    }

    async delete(key: string): Promise<void> {
        const redis = this.getRedis();
        if (!redis) {
            return;
        }

        try {
            await redis.del(key);
            this.metrics.cacheOperations.inc({ operation: "delete", status: "success" });
        } catch (error) {
            const appError = AppError.fromCode(ErrorCodes.CACHE_OPERATION_ERROR, `Redis削除エラー (key: ${key})`, {
                metadata: { key, operation: "delete" },
                originalError: error instanceof Error ? error : new Error(String(error)),
            });
            this.logger.warn(appError.message, { error: appError });
            this.metrics.cacheOperations.inc({ operation: "delete", status: "error" });
        }
    }

    async deletePattern(pattern: string): Promise<void> {
        const redis = this.getRedis();
        if (!redis) {
            return;
        }

        try {
            const keys = await redis.keys(pattern);
            if (keys.length > 0) {
                await redis.del(...keys);
            }
            this.metrics.cacheOperations.inc({ operation: "deletePattern", status: "success" });
        } catch (error) {
            const appError = AppError.fromCode(
                ErrorCodes.CACHE_OPERATION_ERROR,
                `Redisパターン削除エラー (pattern: ${pattern})`,
                {
                    metadata: { pattern, operation: "deletePattern" },
                    originalError: error instanceof Error ? error : new Error(String(error)),
                },
            );
            this.logger.warn(appError.message, { error: appError });
            this.metrics.cacheOperations.inc({ operation: "deletePattern", status: "error" });
        }
    }

    async close(): Promise<void> {
        if (this.redis) {
            try {
                await this.redis.quit();
                this.metrics.cacheOperations.inc({ operation: "close", status: "success" });
            } catch (error) {
                const appError = AppError.fromCode(ErrorCodes.CACHE_CONNECTION_ERROR, "Redis切断エラー", {
                    metadata: { operation: "close" },
                    originalError: error instanceof Error ? error : new Error(String(error)),
                });
                this.logger.warn(appError.message, { error: appError });
                this.metrics.cacheOperations.inc({ operation: "close", status: "error" });
            }
            this.redis = null;
        }
    }
}
