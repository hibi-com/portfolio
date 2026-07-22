import { createKvClient } from "@portfolio/cache";
import { CacheService } from "./cache.service";

vi.mock("@portfolio/cache", () => ({
    createKvClient: vi.fn(),
}));

describe("CacheService", () => {
    const mockKv = {
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(createKvClient).mockReturnValue(mockKv as unknown as KVNamespace);
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

        test("should create instance with kv namespace", () => {
            const service = new CacheService(mockKv as unknown as KVNamespace);
            expect(service).toBeDefined();
        });
    });

    describe("getKv", () => {
        test("should return KV instance on successful connection", async () => {
            const service = new CacheService(mockKv as unknown as KVNamespace);
            expect(createKvClient).not.toHaveBeenCalled();

            await service.get("test-key");
            expect(createKvClient).toHaveBeenCalledWith({
                kv: mockKv,
            });
        });

        test("should return null when kv is not provided", async () => {
            const service = new CacheService();
            const result = await service.get("test-key");

            expect(result).toBeNull();
            expect(createKvClient).not.toHaveBeenCalled();
        });

        test("should return null on connection failure", async () => {
            vi.mocked(createKvClient).mockImplementation(() => {
                throw new Error("Connection failed");
            });

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const service = new CacheService(mockKv as unknown as KVNamespace);
            const result = await service.get("test-key");

            expect(result).toBeNull();
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("KV接続に失敗しました"));

            consoleWarnSpy.mockRestore();
        });

        test("should reuse existing KV instance", async () => {
            const service = new CacheService(mockKv as unknown as KVNamespace);
            await service.get("key1");
            await service.get("key2");

            expect(createKvClient).toHaveBeenCalledTimes(1);
        });
    });

    describe("get", () => {
        test("should return null when KV is null", async () => {
            const service = new CacheService();
            const result = await service.get("test-key");

            expect(result).toBeNull();
        });

        test("should return null when key does not exist", async () => {
            mockKv.get.mockResolvedValue(null);

            const service = new CacheService(mockKv as unknown as KVNamespace);
            const result = await service.get("non-existent-key");

            expect(result).toBeNull();
            expect(mockKv.get).toHaveBeenCalledWith("non-existent-key", "text");
        });

        test("should return cached value when key exists", async () => {
            const cachedValue = { id: "1", name: "test" };
            mockKv.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService(mockKv as unknown as KVNamespace);
            const result = await service.get<typeof cachedValue>("test-key");

            expect(result).toEqual(cachedValue);
            expect(mockKv.get).toHaveBeenCalledWith("test-key", "text");
        });

        test("should handle JSON.parse error gracefully", async () => {
            mockKv.get.mockResolvedValue("invalid-json");

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const service = new CacheService(mockKv as unknown as KVNamespace);
            const result = await service.get("test-key");

            expect(result).toBeNull();
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("KV取得エラー"));

            consoleWarnSpy.mockRestore();
        });

        test("should convert Date strings to Date objects", async () => {
            const cachedValue = {
                id: "1",
                date: "2024-01-01T00:00:00.000Z",
                createdAt: "2024-01-01T00:00:00Z",
            };
            mockKv.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService(mockKv as unknown as KVNamespace);
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
            mockKv.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService(mockKv as unknown as KVNamespace);
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
            mockKv.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService(mockKv as unknown as KVNamespace);
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
            mockKv.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService(mockKv as unknown as KVNamespace);
            const result = await service.get<{ date: Date }>("test-key");

            expect(result?.date).toBeInstanceOf(Date);
            expect(result?.date.toISOString()).toBe("2024-01-01T12:34:56.789Z");
        });

        test("should handle Date strings without Z suffix", async () => {
            const cachedValue = {
                date: "2024-01-01T00:00:00.000",
            };
            mockKv.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService(mockKv as unknown as KVNamespace);
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
            mockKv.get.mockResolvedValue(JSON.stringify(cachedValue));

            const service = new CacheService(mockKv as unknown as KVNamespace);
            const result = await service.get<typeof cachedValue>("test-key");

            expect(result?.id).toBe(123);
            expect(result?.active).toBe(true);
            expect(result?.tags).toEqual(["tag1", "tag2"]);
            expect(result?.metadata).toEqual({ key: "value" });
        });
    });

    describe("set", () => {
        test("should do nothing when KV is null", async () => {
            const service = new CacheService();
            await service.set("test-key", { value: "test" });

            expect(mockKv.put).not.toHaveBeenCalled();
        });

        test("should set value with default TTL", async () => {
            mockKv.put.mockResolvedValue(undefined);

            const service = new CacheService(mockKv as unknown as KVNamespace);
            const value = { id: "1", name: "test" };
            await service.set("test-key", value);

            expect(mockKv.put).toHaveBeenCalledWith("test-key", JSON.stringify(value), { expirationTtl: 3600 });
        });

        test("should set value with custom TTL", async () => {
            mockKv.put.mockResolvedValue(undefined);

            const service = new CacheService(mockKv as unknown as KVNamespace, 7200);
            const value = { id: "1", name: "test" };
            await service.set("test-key", value, 1800);

            expect(mockKv.put).toHaveBeenCalledWith("test-key", JSON.stringify(value), { expirationTtl: 1800 });
        });

        test("should handle put error gracefully", async () => {
            mockKv.put.mockRejectedValue(new Error("Put failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const service = new CacheService(mockKv as unknown as KVNamespace);
            await service.set("test-key", { value: "test" });

            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("KV書き込みエラー"));

            consoleWarnSpy.mockRestore();
        });

        test("should serialize Date objects correctly", async () => {
            mockKv.put.mockResolvedValue(undefined);

            const service = new CacheService(mockKv as unknown as KVNamespace);
            const value = {
                id: "1",
                date: new Date("2024-01-01T00:00:00.000Z"),
            };
            await service.set("test-key", value);

            expect(mockKv.put.mock.calls.length).toBeGreaterThan(0);
            const callArgs = mockKv.put.mock.calls[0];
            expect(callArgs).toBeDefined();
            expect(callArgs?.[1]).toBeDefined();
            const serialized = JSON.parse((callArgs?.[1] ?? "") as string);
            expect(serialized.date).toBe("2024-01-01T00:00:00.000Z");
        });
    });

    describe("delete", () => {
        test("should do nothing when KV is null", async () => {
            const service = new CacheService();
            await service.delete("test-key");

            expect(mockKv.delete).not.toHaveBeenCalled();
        });

        test("should delete existing key", async () => {
            mockKv.delete.mockResolvedValue(undefined);

            const service = new CacheService(mockKv as unknown as KVNamespace);
            await service.delete("test-key");

            expect(mockKv.delete).toHaveBeenCalledWith("test-key");
        });

        test("should handle non-existent key gracefully", async () => {
            mockKv.delete.mockResolvedValue(undefined);

            const service = new CacheService(mockKv as unknown as KVNamespace);
            await service.delete("non-existent-key");

            expect(mockKv.delete).toHaveBeenCalledWith("non-existent-key");
        });

        test("should handle delete error gracefully", async () => {
            mockKv.delete.mockRejectedValue(new Error("Delete failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const service = new CacheService(mockKv as unknown as KVNamespace);
            await service.delete("test-key");

            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("KV削除エラー"));

            consoleWarnSpy.mockRestore();
        });
    });

    describe("deletePattern", () => {
        test("should do nothing when KV is null", async () => {
            const service = new CacheService();
            await service.deletePattern("test:*");

            expect(mockKv.list).not.toHaveBeenCalled();
        });

        test("should delete keys matching pattern", async () => {
            mockKv.list.mockResolvedValue({
                list_complete: true,
                keys: [{ name: "test:1" }, { name: "test:2" }],
            });
            mockKv.delete.mockResolvedValue(undefined);

            const service = new CacheService(mockKv as unknown as KVNamespace);
            await service.deletePattern("test:*");

            expect(mockKv.list).toHaveBeenCalledWith({ prefix: "test:", cursor: undefined });
            expect(mockKv.delete).toHaveBeenCalledWith("test:1");
            expect(mockKv.delete).toHaveBeenCalledWith("test:2");
        });

        test("should paginate with cursor", async () => {
            mockKv.list
                .mockResolvedValueOnce({
                    list_complete: false,
                    keys: [{ name: "test:1" }],
                    cursor: "next-page",
                })
                .mockResolvedValueOnce({
                    list_complete: true,
                    keys: [{ name: "test:2" }],
                });
            mockKv.delete.mockResolvedValue(undefined);

            const service = new CacheService(mockKv as unknown as KVNamespace);
            await service.deletePattern("test:*");

            expect(mockKv.list).toHaveBeenNthCalledWith(1, { prefix: "test:", cursor: undefined });
            expect(mockKv.list).toHaveBeenNthCalledWith(2, { prefix: "test:", cursor: "next-page" });
            expect(mockKv.delete).toHaveBeenCalledWith("test:1");
            expect(mockKv.delete).toHaveBeenCalledWith("test:2");
        });

        test("should handle empty keys array", async () => {
            mockKv.list.mockResolvedValue({ list_complete: true, keys: [] });

            const service = new CacheService(mockKv as unknown as KVNamespace);
            await service.deletePattern("test:*");

            expect(mockKv.list).toHaveBeenCalledWith({ prefix: "test:", cursor: undefined });
            expect(mockKv.delete).not.toHaveBeenCalled();
        });

        test("should handle list error gracefully", async () => {
            mockKv.list.mockRejectedValue(new Error("List failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const service = new CacheService(mockKv as unknown as KVNamespace);
            await service.deletePattern("test:*");

            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("KVパターン削除エラー"));

            consoleWarnSpy.mockRestore();
        });

        test("should handle delete error gracefully", async () => {
            mockKv.list.mockResolvedValue({
                list_complete: true,
                keys: [{ name: "test:1" }],
            });
            mockKv.delete.mockRejectedValue(new Error("Delete failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const service = new CacheService(mockKv as unknown as KVNamespace);
            await service.deletePattern("test:*");

            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("KVパターン削除エラー"));

            consoleWarnSpy.mockRestore();
        });
    });

    describe("close", () => {
        test("should clear KV reference", async () => {
            const service = new CacheService(mockKv as unknown as KVNamespace);
            await service.get("test-key");
            await service.close();

            mockKv.get.mockClear();
            vi.mocked(createKvClient).mockClear();

            await service.get("test-key");
            expect(createKvClient).toHaveBeenCalledTimes(1);
        });
    });
});
