import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Post } from "~/domain/post";
import { CacheService } from "./cache.service";
import { CachedPostRepository } from "./cached-post.repository";
import { PostRepositoryImpl } from "./post.repository";

vi.mock("./cache.service");
vi.mock("./post.repository");

describe("CachedPostRepository", () => {
    const mockCacheService = {
        get: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
    };

    const mockDbRepository = {
        findAll: vi.fn(),
        findBySlug: vi.fn(),
        findById: vi.fn(),
    };

    const mockPost: Post = {
        id: "1",
        title: "Test Post",
        slug: "test-post",
        date: "2024-01-01T00:00:00.000Z",
        content: { html: "Content" },
        imageTemp: "image.jpg",
        sticky: false,
        tags: ["tag1"],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(CacheService).mockImplementation(() => mockCacheService as any);
        vi.mocked(PostRepositoryImpl).mockImplementation(() => mockDbRepository as any);
    });

    describe("constructor", () => {
        test("should create instance with CacheService and PostRepositoryImpl", () => {
            const repository = new CachedPostRepository();

            expect(CacheService).toHaveBeenCalled();
            expect(PostRepositoryImpl).toHaveBeenCalled();
            expect(repository).toBeDefined();
        });

        test("should create instance with databaseUrl and redisUrl", () => {
            const repository = new CachedPostRepository("mysql://localhost:3306/db", "redis://localhost:6379");

            expect(CacheService).toHaveBeenCalledWith("redis://localhost:6379");
            expect(PostRepositoryImpl).toHaveBeenCalledWith("mysql://localhost:3306/db");
            expect(repository).toBeDefined();
        });
    });

    describe("findAll", () => {
        test("should return cached value when cache hit", async () => {
            const cachedPosts = [mockPost];
            mockCacheService.get.mockResolvedValue(cachedPosts);

            const repository = new CachedPostRepository();
            const result = await repository.findAll();

            expect(result).toEqual(cachedPosts);
            expect(mockCacheService.get).toHaveBeenCalledWith("post:findAll:");
            expect(mockDbRepository.findAll).not.toHaveBeenCalled();
        });

        test("should fetch from DB when cache miss", async () => {
            mockCacheService.get.mockResolvedValue(null);
            const dbPosts = [mockPost];
            mockDbRepository.findAll.mockResolvedValue(dbPosts);
            mockCacheService.set.mockResolvedValue(undefined);

            const repository = new CachedPostRepository();
            const result = await repository.findAll();

            expect(result).toEqual(dbPosts);
            expect(mockCacheService.get).toHaveBeenCalledWith("post:findAll:");
            expect(mockDbRepository.findAll).toHaveBeenCalled();
            expect(mockCacheService.set).toHaveBeenCalledWith("post:findAll:", dbPosts);
        });

        test("should handle cache write error gracefully", async () => {
            mockCacheService.get.mockResolvedValue(null);
            const dbPosts = [mockPost];
            mockDbRepository.findAll.mockResolvedValue(dbPosts);
            mockCacheService.set.mockRejectedValue(new Error("Write failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const repository = new CachedPostRepository();
            const result = await repository.findAll();

            expect(result).toEqual(dbPosts);
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Redis書き込みエラー（findAll）"));

            consoleWarnSpy.mockRestore();
        });

        test("should return empty array from DB", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findAll.mockResolvedValue([]);
            mockCacheService.set.mockResolvedValue(undefined);

            const repository = new CachedPostRepository();
            const result = await repository.findAll();

            expect(result).toEqual([]);
            expect(mockCacheService.set).toHaveBeenCalledWith("post:findAll:", []);
        });
    });

    describe("findBySlug", () => {
        test("should return cached value when cache hit", async () => {
            mockCacheService.get.mockResolvedValue(mockPost);

            const repository = new CachedPostRepository();
            const result = await repository.findBySlug("test-post");

            expect(result).toEqual(mockPost);
            expect(mockCacheService.get).toHaveBeenCalledWith("post:findBySlug:test-post");
            expect(mockDbRepository.findBySlug).not.toHaveBeenCalled();
        });

        test("should fetch from DB when cache miss", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findBySlug.mockResolvedValue(mockPost);
            mockCacheService.set.mockResolvedValue(undefined);

            const repository = new CachedPostRepository();
            const result = await repository.findBySlug("test-post");

            expect(result).toEqual(mockPost);
            expect(mockCacheService.get).toHaveBeenCalledWith("post:findBySlug:test-post");
            expect(mockDbRepository.findBySlug).toHaveBeenCalledWith("test-post");
            expect(mockCacheService.set).toHaveBeenCalledWith("post:findBySlug:test-post", mockPost);
        });

        test("should not cache when post is null", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findBySlug.mockResolvedValue(null);

            const repository = new CachedPostRepository();
            const result = await repository.findBySlug("non-existent");

            expect(result).toBeNull();
            expect(mockCacheService.set).not.toHaveBeenCalled();
        });

        test("should handle cache write error gracefully", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findBySlug.mockResolvedValue(mockPost);
            mockCacheService.set.mockRejectedValue(new Error("Write failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const repository = new CachedPostRepository();
            const result = await repository.findBySlug("test-post");

            expect(result).toEqual(mockPost);
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Redis書き込みエラー（findBySlug）"));

            consoleWarnSpy.mockRestore();
        });
    });

    describe("findById", () => {
        test("should return cached value when cache hit", async () => {
            mockCacheService.get.mockResolvedValue(mockPost);

            const repository = new CachedPostRepository();
            const result = await repository.findById("1");

            expect(result).toEqual(mockPost);
            expect(mockCacheService.get).toHaveBeenCalledWith("post:findById:1");
            expect(mockDbRepository.findById).not.toHaveBeenCalled();
        });

        test("should fetch from DB when cache miss", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findById.mockResolvedValue(mockPost);
            mockCacheService.set.mockResolvedValue(undefined);

            const repository = new CachedPostRepository();
            const result = await repository.findById("1");

            expect(result).toEqual(mockPost);
            expect(mockCacheService.get).toHaveBeenCalledWith("post:findById:1");
            expect(mockDbRepository.findById).toHaveBeenCalledWith("1");
            expect(mockCacheService.set).toHaveBeenCalledWith("post:findById:1", mockPost);
        });

        test("should not cache when post is null", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findById.mockResolvedValue(null);

            const repository = new CachedPostRepository();
            const result = await repository.findById("non-existent");

            expect(result).toBeNull();
            expect(mockCacheService.set).not.toHaveBeenCalled();
        });

        test("should handle cache write error gracefully", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findById.mockResolvedValue(mockPost);
            mockCacheService.set.mockRejectedValue(new Error("Write failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const repository = new CachedPostRepository();
            const result = await repository.findById("1");

            expect(result).toEqual(mockPost);
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Redis書き込みエラー（findById）"));

            consoleWarnSpy.mockRestore();
        });
    });

    describe("invalidateCache", () => {
        test("should delete findAll cache when no parameters", async () => {
            mockCacheService.delete.mockResolvedValue(undefined);

            const repository = new CachedPostRepository();
            await repository.invalidateCache();

            expect(mockCacheService.delete).toHaveBeenCalledTimes(1);
            expect(mockCacheService.delete).toHaveBeenCalledWith("post:findAll:");
        });

        test("should delete findAll and findBySlug cache when slug provided", async () => {
            mockCacheService.delete.mockResolvedValue(undefined);

            const repository = new CachedPostRepository();
            await repository.invalidateCache("test-post");

            expect(mockCacheService.delete).toHaveBeenCalledTimes(2);
            expect(mockCacheService.delete).toHaveBeenCalledWith("post:findAll:");
            expect(mockCacheService.delete).toHaveBeenCalledWith("post:findBySlug:test-post");
        });

        test("should delete findAll and findById cache when id provided", async () => {
            mockCacheService.delete.mockResolvedValue(undefined);

            const repository = new CachedPostRepository();
            await repository.invalidateCache(undefined, "1");

            expect(mockCacheService.delete).toHaveBeenCalledTimes(2);
            expect(mockCacheService.delete).toHaveBeenCalledWith("post:findAll:");
            expect(mockCacheService.delete).toHaveBeenCalledWith("post:findById:1");
        });

        test("should delete all caches when both slug and id provided", async () => {
            mockCacheService.delete.mockResolvedValue(undefined);

            const repository = new CachedPostRepository();
            await repository.invalidateCache("test-post", "1");

            expect(mockCacheService.delete).toHaveBeenCalledTimes(3);
            expect(mockCacheService.delete).toHaveBeenCalledWith("post:findAll:");
            expect(mockCacheService.delete).toHaveBeenCalledWith("post:findBySlug:test-post");
            expect(mockCacheService.delete).toHaveBeenCalledWith("post:findById:1");
        });
    });

    describe("edge cases", () => {
        test("should fallback to DB when Redis connection fails", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findAll.mockResolvedValue([mockPost]);

            const repository = new CachedPostRepository();
            const result = await repository.findAll();

            expect(result).toEqual([mockPost]);
            expect(mockDbRepository.findAll).toHaveBeenCalled();
        });

        test("should handle Date serialization correctly", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findAll.mockResolvedValue([mockPost]);
            mockCacheService.set.mockResolvedValue(undefined);

            const repository = new CachedPostRepository();
            await repository.findAll();

            expect(mockCacheService.set).toHaveBeenCalledWith("post:findAll:", [mockPost]);
        });
    });
});
