import { createRedisClient } from "@portfolio/cache";
import { CacheService } from "./cache.service";

vi.mock("@portfolio/cache", () => ({
    createRedisClient: vi.fn(),
}));

describe("CacheService", () => {
    const mockRedis = {
        get: vi.fn(),
        setex: vi.fn(),
        del: vi.fn(),
        keys: vi.fn(),
        quit: vi.fn(),
        status: "ready" as const,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(createRedisClient).mockReturnValue(mockRedis as any);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("constructor", () => {
        test("should create instance with default TTL", () => {
            const service = new CacheService();
            expect(service).toBeDefined();
        });

        test("should create instance with custom TTL", () => {
            const service = new CacheService(undefined, 7200);
            expect(service).toBeDefined();
        });

        test("should create instance with redisUrl", () => {
            const service = new CacheService("redis://localhost:6379");
            expect(service).toBeDefined();
        });
    });

    describe("getRedis", () => {
        test("should return Redis instance on successful connection", () => {
            const service = new CacheService();
            expect(createRedisClient).not.toHaveBeenCalled();

            service.get("test-key");
            expect(createRedisClient).toHaveBeenCalledWith({
                redisUrl: undefined,
                lazyConnect: false,
            });
        });

        test("should return null on connection failure", async () => {
            vi.mocked(createRedisClient).mockImplementation(() => {
                throw new Error("Connection failed");
            });

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const service = new CacheService();
            const result = await service.get("test-key");

            expect(result).toBeNull();
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Redis接続に失敗しました"));

            consoleWarnSpy.mockRestore();
        });

        test("should reuse existing Redis instance", async () => {
            const service = new CacheService();
            await service.get("key1");
            await service.get("key2");

            expect(createRedisClient).toHaveBeenCalledTimes(1);
        });
    });

    describe("get", () => {
        test("should return null when Redis is null", async () => {
            vi.mocked(createRedisClient).mockImplementation(() => {
                throw new Error("Connection failed");
            });

            const service = new CacheService();
            const result = await service.get("test-key");

            expect(result).toBeNull();
        });

        test("should return null when key does not exist", async () => {
            mockRedis.get.mockResolvedValue(null);

            const service = new CacheService();
            const result = await service.get("non-existent-key");

            expect(result).toBeNull();
            expect(mockRedis.get).toHaveBeenCalledWith("non-existent-key");
        });

        test("should return cached value when key exists", async () => {
            const cachedValue = { id: "1", name: "test" };
            mockRedis.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService();
            const result = await service.get<typeof cachedValue>("test-key");

            expect(result).toEqual(cachedValue);
            expect(mockRedis.get).toHaveBeenCalledWith("test-key");
        });

        test("should handle JSON.parse error gracefully", async () => {
            mockRedis.get.mockResolvedValue("invalid-json");

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const service = new CacheService();
            const result = await service.get("test-key");

            expect(result).toBeNull();
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Redis取得エラー"));

            consoleWarnSpy.mockRestore();
        });

        test("should convert Date strings to Date objects", async () => {
            const cachedValue = {
                id: "1",
                date: "2024-01-01T00:00:00.000Z",
                createdAt: "2024-01-01T00:00:00Z",
            };
            mockRedis.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService();
            const result = await service.get<{
                id: string;
                date: Date;
                createdAt: Date;
            }>("test-key");

            expect(result).not.toBeNull();
            expect(result?.date).toBeInstanceOf(Date);
            expect(result?.createdAt).toBeInstanceOf(Date);
            expect(result?.date.toISOString()).toBe("2024-01-01T00:00:00.000Z");
        });

        test("should not convert non-date strings", async () => {
            const cachedValue = {
                id: "1",
                name: "test",
                date: "2024-01-01",
            };
            mockRedis.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService();
            const result = await service.get<typeof cachedValue>("test-key");

            expect(result?.date).toBe("2024-01-01");
            expect(result?.date).not.toBeInstanceOf(Date);
        });

        test("should handle multiple Date fields in nested objects", async () => {
            const cachedValue = {
                id: "1",
                post: {
                    date: "2024-01-01T00:00:00.000Z",
                    createdAt: "2024-01-01T00:00:00Z",
                },
            };
            mockRedis.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService();
            const result = await service.get<{
                id: string;
                post: { date: Date; createdAt: Date };
            }>("test-key");

            expect(result?.post.date).toBeInstanceOf(Date);
            expect(result?.post.createdAt).toBeInstanceOf(Date);
        });

        test("should handle Date strings with milliseconds", async () => {
            const cachedValue = {
                date: "2024-01-01T12:34:56.789Z",
            };
            mockRedis.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService();
            const result = await service.get<{ date: Date }>("test-key");

            expect(result?.date).toBeInstanceOf(Date);
            expect(result?.date.toISOString()).toBe("2024-01-01T12:34:56.789Z");
        });

        test("should handle Date strings without Z suffix", async () => {
            const cachedValue = {
                date: "2024-01-01T00:00:00.000",
            };
            mockRedis.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService();
            const result = await service.get<{ date: Date }>("test-key");

            expect(result?.date).toBeInstanceOf(Date);
        });

        test("should preserve non-string values", async () => {
            const cachedValue = {
                id: 123,
                active: true,
                tags: ["tag1", "tag2"],
                metadata: { key: "value" },
            };
            mockRedis.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService();
            const result = await service.get<typeof cachedValue>("test-key");

            expect(result?.id).toBe(123);
            expect(result?.active).toBe(true);
            expect(result?.tags).toEqual(["tag1", "tag2"]);
            expect(result?.metadata).toEqual({ key: "value" });
        });
    });

    describe("set", () => {
        test("should do nothing when Redis is null", async () => {
            vi.mocked(createRedisClient).mockImplementation(() => {
                throw new Error("Connection failed");
            });

            const service = new CacheService();
            await service.set("test-key", { value: "test" });

            expect(mockRedis.setex).not.toHaveBeenCalled();
        });

        test("should set value with default TTL", async () => {
            mockRedis.setex.mockResolvedValue("OK");

            const service = new CacheService();
            const value = { id: "1", name: "test" };
            await service.set("test-key", value);

            expect(mockRedis.setex).toHaveBeenCalledWith("test-key", 3600, JSON.stringify(value));
        });

        test("should set value with custom TTL", async () => {
            mockRedis.setex.mockResolvedValue("OK");

            const service = new CacheService(undefined, 7200);
            const value = { id: "1", name: "test" };
            await service.set("test-key", value, 1800);

            expect(mockRedis.setex).toHaveBeenCalledWith("test-key", 1800, JSON.stringify(value));
        });

        test("should handle setex error gracefully", async () => {
            mockRedis.setex.mockRejectedValue(new Error("Setex failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const service = new CacheService();
            await service.set("test-key", { value: "test" });

            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Redis書き込みエラー"));

            consoleWarnSpy.mockRestore();
        });

        test("should serialize Date objects correctly", async () => {
            mockRedis.setex.mockResolvedValue("OK");

            const service = new CacheService();
            const value = {
                id: "1",
                date: new Date("2024-01-01T00:00:00.000Z"),
            };
            await service.set("test-key", value);

            expect(mockRedis.setex.mock.calls.length).toBeGreaterThan(0);
            const callArgs = mockRedis.setex.mock.calls[0];
            expect(callArgs).toBeDefined();
            expect(callArgs?.[2]).toBeDefined();
            const serialized = JSON.parse((callArgs?.[2] ?? "") as string);
            expect(serialized.date).toBe("2024-01-01T00:00:00.000Z");
        });
    });

    describe("delete", () => {
        test("should do nothing when Redis is null", async () => {
            vi.mocked(createRedisClient).mockImplementation(() => {
                throw new Error("Connection failed");
            });

            const service = new CacheService();
            await service.delete("test-key");

            expect(mockRedis.del).not.toHaveBeenCalled();
        });

        test("should delete existing key", async () => {
            mockRedis.del.mockResolvedValue(1);

            const service = new CacheService();
            await service.delete("test-key");

            expect(mockRedis.del).toHaveBeenCalledWith("test-key");
        });

        test("should handle non-existent key gracefully", async () => {
            mockRedis.del.mockResolvedValue(0);

            const service = new CacheService();
            await service.delete("non-existent-key");

            expect(mockRedis.del).toHaveBeenCalledWith("non-existent-key");
        });

        test("should handle del error gracefully", async () => {
            mockRedis.del.mockRejectedValue(new Error("Delete failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const service = new CacheService();
            await service.delete("test-key");

            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Redis削除エラー"));

            consoleWarnSpy.mockRestore();
        });
    });

    describe("deletePattern", () => {
        test("should do nothing when Redis is null", async () => {
            vi.mocked(createRedisClient).mockImplementation(() => {
                throw new Error("Connection failed");
            });

            const service = new CacheService();
            await service.deletePattern("test:*");

            expect(mockRedis.keys).not.toHaveBeenCalled();
        });

        test("should delete keys matching pattern", async () => {
            mockRedis.keys.mockResolvedValue(["test:1", "test:2"]);
            mockRedis.del.mockResolvedValue(2);

            const service = new CacheService();
            await service.deletePattern("test:*");

            expect(mockRedis.keys).toHaveBeenCalledWith("test:*");
            expect(mockRedis.del).toHaveBeenCalledWith("test:1", "test:2");
        });

        test("should handle empty keys array", async () => {
            mockRedis.keys.mockResolvedValue([]);

            const service = new CacheService();
            await service.deletePattern("test:*");

            expect(mockRedis.keys).toHaveBeenCalledWith("test:*");
            expect(mockRedis.del).not.toHaveBeenCalled();
        });

        test("should handle keys error gracefully", async () => {
            mockRedis.keys.mockRejectedValue(new Error("Keys failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const service = new CacheService();
            await service.deletePattern("test:*");

            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Redisパターン削除エラー"));

            consoleWarnSpy.mockRestore();
        });

        test("should handle del error gracefully", async () => {
            mockRedis.keys.mockResolvedValue(["test:1"]);
            mockRedis.del.mockRejectedValue(new Error("Delete failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const service = new CacheService();
            await service.deletePattern("test:*");

            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Redisパターン削除エラー"));

            consoleWarnSpy.mockRestore();
        });
    });

    describe("close", () => {
        test("should do nothing when Redis is null", async () => {
            vi.mocked(createRedisClient).mockImplementation(() => {
                throw new Error("Connection failed");
            });

            const service = new CacheService();
            await service.close();

            expect(mockRedis.quit).not.toHaveBeenCalled();
        });

        test("should close Redis connection", async () => {
            mockRedis.quit.mockResolvedValue("OK");

            const service = new CacheService();
            await service.get("test-key");
            await service.close();

            expect(mockRedis.quit).toHaveBeenCalled();
        });

        test("should handle quit error gracefully", async () => {
            mockRedis.quit.mockRejectedValue(new Error("Quit failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const service = new CacheService();
            await service.get("test-key");
            await service.close();

            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Redis切断エラー"));

            consoleWarnSpy.mockRestore();
        });
    });
});
