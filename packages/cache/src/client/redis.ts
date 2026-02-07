import Redis from "ioredis";

export interface CreateRedisClientOptions {
    redisUrl?: string;
    maxRetriesPerRequest?: number;
    lazyConnect?: boolean;
}

let redisInstance: Redis | null = null;

export function createRedisClient(options: CreateRedisClientOptions = {}): Redis {
    const { redisUrl, maxRetriesPerRequest = 3, lazyConnect = false } = options;

    if (redisInstance) {
        return redisInstance;
    }

    const url = redisUrl || process.env.CACHE_URL || process.env.REDIS_URL;

    if (!url) {
        throw new Error(
            "CACHE_URL environment variable is required. Please set CACHE_URL in your .env file or pass it as an option.",
        );
    }

    redisInstance = new Redis(url, {
        maxRetriesPerRequest,
        lazyConnect,
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
        enableReadyCheck: true,
    });

    redisInstance.on("error", (error) => {
        console.error("Redis Client Error:", error);
    });

    redisInstance.on("connect", () => {
        console.log("Redis Client Connected");
    });

    redisInstance.on("ready", () => {
        console.log("Redis Client Ready");
    });

    return redisInstance;
}

export type RedisClientType = ReturnType<typeof createRedisClient>;

export function resetRedisClient(): void {
    if (redisInstance) {
        redisInstance.disconnect();
        redisInstance = null;
    }
}
