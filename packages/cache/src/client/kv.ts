export interface CreateKvClientOptions {
    kv?: KVNamespace;
}

let kvInstance: KVNamespace | null = null;

export function createKvClient(options: CreateKvClientOptions = {}): KVNamespace {
    if (kvInstance) {
        return kvInstance;
    }

    if (!options.kv) {
        throw new Error("KVNamespace is required. Please pass a KV binding via options.kv.");
    }

    kvInstance = options.kv;
    return kvInstance;
}

export type KvClientType = ReturnType<typeof createKvClient>;

export function resetKvClient(): void {
    kvInstance = null;
}

/** @deprecated Use CreateKvClientOptions */
export type CreateRedisClientOptions = CreateKvClientOptions;

/** @deprecated Use createKvClient */
export const createRedisClient = createKvClient;

/** @deprecated Use KvClientType */
export type RedisClientType = KvClientType;

/** @deprecated Use resetKvClient */
export const resetRedisClient = resetKvClient;
