import { createKvClient } from "@portfolio/cache";
import { AppError, ErrorCodes } from "@portfolio/log";
import { getLogger, getMetrics } from "~/lib/logger";

export class CacheService {
    private kv: KVNamespace | null = null;
    private readonly ttl: number;
    private readonly logger = getLogger();
    private readonly metrics = getMetrics();

    constructor(
        private readonly kvNamespace?: KVNamespace,
        ttlSeconds: number = 3600,
    ) {
        this.ttl = ttlSeconds;
    }

    private getKv(): KVNamespace | null {
        if (this.kv) {
            return this.kv;
        }

        if (!this.kvNamespace) {
            return null;
        }

        try {
            this.kv = createKvClient({
                kv: this.kvNamespace,
            });
            return this.kv;
        } catch (error) {
            const appError = AppError.fromCode(
                ErrorCodes.CACHE_CONNECTION_ERROR,
                "KV接続に失敗しました。DBから直接読み取ります",
                {
                    metadata: {},
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
        const kv = this.getKv();
        if (!kv) {
            this.metrics.cacheMisses.inc({ key });
            return null;
        }

        try {
            const value = await kv.get(key, "text");
            if (!value) {
                this.metrics.cacheMisses.inc({ key });
                return null;
            }
            this.metrics.cacheHits.inc({ key });
            return JSON.parse(value, this.reviver.bind(this)) as T;
        } catch (error) {
            const appError = AppError.fromCode(ErrorCodes.CACHE_OPERATION_ERROR, `KV取得エラー (key: ${key})`, {
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
        const kv = this.getKv();
        if (!kv) {
            return;
        }

        const ttl = ttlSeconds ?? this.ttl;
        try {
            await kv.put(key, JSON.stringify(value), { expirationTtl: ttl });
            this.metrics.cacheOperations.inc({ operation: "set", status: "success" });
        } catch (error) {
            const appError = AppError.fromCode(ErrorCodes.CACHE_OPERATION_ERROR, `KV書き込みエラー (key: ${key})`, {
                metadata: { key, operation: "set", ttl },
                originalError: error instanceof Error ? error : new Error(String(error)),
            });
            this.logger.warn(appError.message, { error: appError });
            this.metrics.cacheOperations.inc({ operation: "set", status: "error" });
        }
    }

    async delete(key: string): Promise<void> {
        const kv = this.getKv();
        if (!kv) {
            return;
        }

        try {
            await kv.delete(key);
            this.metrics.cacheOperations.inc({ operation: "delete", status: "success" });
        } catch (error) {
            const appError = AppError.fromCode(ErrorCodes.CACHE_OPERATION_ERROR, `KV削除エラー (key: ${key})`, {
                metadata: { key, operation: "delete" },
                originalError: error instanceof Error ? error : new Error(String(error)),
            });
            this.logger.warn(appError.message, { error: appError });
            this.metrics.cacheOperations.inc({ operation: "delete", status: "error" });
        }
    }

    async deletePattern(pattern: string): Promise<void> {
        const kv = this.getKv();
        if (!kv) {
            return;
        }

        try {
            const prefix = pattern.endsWith("*") ? pattern.slice(0, -1) : pattern;
            let cursor: string | undefined;

            do {
                const result = await kv.list({ prefix, cursor });
                await Promise.all(result.keys.map((entry) => kv.delete(entry.name)));
                cursor = result.list_complete ? undefined : result.cursor;
            } while (cursor);

            this.metrics.cacheOperations.inc({ operation: "deletePattern", status: "success" });
        } catch (error) {
            const appError = AppError.fromCode(
                ErrorCodes.CACHE_OPERATION_ERROR,
                `KVパターン削除エラー (pattern: ${pattern})`,
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
        this.kv = null;
        this.metrics.cacheOperations.inc({ operation: "close", status: "success" });
    }
}
