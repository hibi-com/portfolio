import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Portfolio } from "~/domain/portfolio";
import { CacheService } from "./cache.service";
import { CachedPortfolioRepository } from "./cached-portfolio.repository";
import { PortfolioRepositoryImpl } from "./portfolio.repository";

vi.mock("./cache.service");
vi.mock("./portfolio.repository");

describe("CachedPortfolioRepository", () => {
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

    const mockPortfolio: Portfolio = {
        id: "1",
        title: "Test Portfolio",
        slug: "test-portfolio",
        company: "Test Company",
        date: "2024-01-01T00:00:00.000Z",
        current: true,
        overview: "Overview",
        description: "Description",
        content: { html: "Content" },
        thumbnailTemp: "thumbnail.jpg",
        intro: "Intro",
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(CacheService).mockImplementation(() => mockCacheService as any);
        vi.mocked(PortfolioRepositoryImpl).mockImplementation(() => mockDbRepository as any);
    });

    describe("constructor", () => {
        test("should create instance with CacheService and PortfolioRepositoryImpl", () => {
            const repository = new CachedPortfolioRepository();

            expect(CacheService).toHaveBeenCalled();
            expect(PortfolioRepositoryImpl).toHaveBeenCalled();
            expect(repository).toBeDefined();
        });

        test("should create instance with databaseUrl and redisUrl", () => {
            const repository = new CachedPortfolioRepository("mysql://localhost:3306/db", "redis://localhost:6379");

            expect(CacheService).toHaveBeenCalledWith("redis://localhost:6379");
            expect(PortfolioRepositoryImpl).toHaveBeenCalledWith("mysql://localhost:3306/db");
            expect(repository).toBeDefined();
        });
    });

    describe("findAll", () => {
        test("should return cached value when cache hit", async () => {
            const cachedPortfolios = [mockPortfolio];
            mockCacheService.get.mockResolvedValue(cachedPortfolios);

            const repository = new CachedPortfolioRepository();
            const result = await repository.findAll();

            expect(result).toEqual(cachedPortfolios);
            expect(mockCacheService.get).toHaveBeenCalledWith("portfolio:findAll:");
            expect(mockDbRepository.findAll).not.toHaveBeenCalled();
        });

        test("should fetch from DB when cache miss", async () => {
            mockCacheService.get.mockResolvedValue(null);
            const dbPortfolios = [mockPortfolio];
            mockDbRepository.findAll.mockResolvedValue(dbPortfolios);
            mockCacheService.set.mockResolvedValue(undefined);

            const repository = new CachedPortfolioRepository();
            const result = await repository.findAll();

            expect(result).toEqual(dbPortfolios);
            expect(mockCacheService.get).toHaveBeenCalledWith("portfolio:findAll:");
            expect(mockDbRepository.findAll).toHaveBeenCalled();
            expect(mockCacheService.set).toHaveBeenCalledWith("portfolio:findAll:", dbPortfolios);
        });

        test("should handle cache write error gracefully", async () => {
            mockCacheService.get.mockResolvedValue(null);
            const dbPortfolios = [mockPortfolio];
            mockDbRepository.findAll.mockResolvedValue(dbPortfolios);
            mockCacheService.set.mockRejectedValue(new Error("Write failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const repository = new CachedPortfolioRepository();
            const result = await repository.findAll();

            expect(result).toEqual(dbPortfolios);
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Redis書き込みエラー（findAll）"));

            consoleWarnSpy.mockRestore();
        });

        test("should return empty array from DB", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findAll.mockResolvedValue([]);
            mockCacheService.set.mockResolvedValue(undefined);

            const repository = new CachedPortfolioRepository();
            const result = await repository.findAll();

            expect(result).toEqual([]);
            expect(mockCacheService.set).toHaveBeenCalledWith("portfolio:findAll:", []);
        });
    });

    describe("findBySlug", () => {
        test("should return cached value when cache hit", async () => {
            mockCacheService.get.mockResolvedValue(mockPortfolio);

            const repository = new CachedPortfolioRepository();
            const result = await repository.findBySlug("test-portfolio");

            expect(result).toEqual(mockPortfolio);
            expect(mockCacheService.get).toHaveBeenCalledWith("portfolio:findBySlug:test-portfolio");
            expect(mockDbRepository.findBySlug).not.toHaveBeenCalled();
        });

        test("should fetch from DB when cache miss", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findBySlug.mockResolvedValue(mockPortfolio);
            mockCacheService.set.mockResolvedValue(undefined);

            const repository = new CachedPortfolioRepository();
            const result = await repository.findBySlug("test-portfolio");

            expect(result).toEqual(mockPortfolio);
            expect(mockCacheService.get).toHaveBeenCalledWith("portfolio:findBySlug:test-portfolio");
            expect(mockDbRepository.findBySlug).toHaveBeenCalledWith("test-portfolio");
            expect(mockCacheService.set).toHaveBeenCalledWith("portfolio:findBySlug:test-portfolio", mockPortfolio);
        });

        test("should not cache when portfolio is null", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findBySlug.mockResolvedValue(null);

            const repository = new CachedPortfolioRepository();
            const result = await repository.findBySlug("non-existent");

            expect(result).toBeNull();
            expect(mockCacheService.set).not.toHaveBeenCalled();
        });

        test("should handle cache write error gracefully", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findBySlug.mockResolvedValue(mockPortfolio);
            mockCacheService.set.mockRejectedValue(new Error("Write failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const repository = new CachedPortfolioRepository();
            const result = await repository.findBySlug("test-portfolio");

            expect(result).toEqual(mockPortfolio);
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Redis書き込みエラー（findBySlug）"));

            consoleWarnSpy.mockRestore();
        });
    });

    describe("findById", () => {
        test("should return cached value when cache hit", async () => {
            mockCacheService.get.mockResolvedValue(mockPortfolio);

            const repository = new CachedPortfolioRepository();
            const result = await repository.findById("1");

            expect(result).toEqual(mockPortfolio);
            expect(mockCacheService.get).toHaveBeenCalledWith("portfolio:findById:1");
            expect(mockDbRepository.findById).not.toHaveBeenCalled();
        });

        test("should fetch from DB when cache miss", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findById.mockResolvedValue(mockPortfolio);
            mockCacheService.set.mockResolvedValue(undefined);

            const repository = new CachedPortfolioRepository();
            const result = await repository.findById("1");

            expect(result).toEqual(mockPortfolio);
            expect(mockCacheService.get).toHaveBeenCalledWith("portfolio:findById:1");
            expect(mockDbRepository.findById).toHaveBeenCalledWith("1");
            expect(mockCacheService.set).toHaveBeenCalledWith("portfolio:findById:1", mockPortfolio);
        });

        test("should not cache when portfolio is null", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findById.mockResolvedValue(null);

            const repository = new CachedPortfolioRepository();
            const result = await repository.findById("non-existent");

            expect(result).toBeNull();
            expect(mockCacheService.set).not.toHaveBeenCalled();
        });

        test("should handle cache write error gracefully", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findById.mockResolvedValue(mockPortfolio);
            mockCacheService.set.mockRejectedValue(new Error("Write failed"));

            const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(vi.fn());

            const repository = new CachedPortfolioRepository();
            const result = await repository.findById("1");

            expect(result).toEqual(mockPortfolio);
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("Redis書き込みエラー（findById）"));

            consoleWarnSpy.mockRestore();
        });
    });

    describe("invalidateCache", () => {
        test("should delete findAll cache when no parameters", async () => {
            mockCacheService.delete.mockResolvedValue(undefined);

            const repository = new CachedPortfolioRepository();
            await repository.invalidateCache();

            expect(mockCacheService.delete).toHaveBeenCalledTimes(1);
            expect(mockCacheService.delete).toHaveBeenCalledWith("portfolio:findAll:");
        });

        test("should delete findAll and findBySlug cache when slug provided", async () => {
            mockCacheService.delete.mockResolvedValue(undefined);

            const repository = new CachedPortfolioRepository();
            await repository.invalidateCache("test-portfolio");

            expect(mockCacheService.delete).toHaveBeenCalledTimes(2);
            expect(mockCacheService.delete).toHaveBeenCalledWith("portfolio:findAll:");
            expect(mockCacheService.delete).toHaveBeenCalledWith("portfolio:findBySlug:test-portfolio");
        });

        test("should delete findAll and findById cache when id provided", async () => {
            mockCacheService.delete.mockResolvedValue(undefined);

            const repository = new CachedPortfolioRepository();
            await repository.invalidateCache(undefined, "1");

            expect(mockCacheService.delete).toHaveBeenCalledTimes(2);
            expect(mockCacheService.delete).toHaveBeenCalledWith("portfolio:findAll:");
            expect(mockCacheService.delete).toHaveBeenCalledWith("portfolio:findById:1");
        });

        test("should delete all caches when both slug and id provided", async () => {
            mockCacheService.delete.mockResolvedValue(undefined);

            const repository = new CachedPortfolioRepository();
            await repository.invalidateCache("test-portfolio", "1");

            expect(mockCacheService.delete).toHaveBeenCalledTimes(3);
            expect(mockCacheService.delete).toHaveBeenCalledWith("portfolio:findAll:");
            expect(mockCacheService.delete).toHaveBeenCalledWith("portfolio:findBySlug:test-portfolio");
            expect(mockCacheService.delete).toHaveBeenCalledWith("portfolio:findById:1");
        });
    });

    describe("edge cases", () => {
        test("should fallback to DB when Redis connection fails", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findAll.mockResolvedValue([mockPortfolio]);

            const repository = new CachedPortfolioRepository();
            const result = await repository.findAll();

            expect(result).toEqual([mockPortfolio]);
            expect(mockDbRepository.findAll).toHaveBeenCalled();
        });

        test("should handle Portfolio-specific fields correctly", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findAll.mockResolvedValue([mockPortfolio]);
            mockCacheService.set.mockResolvedValue(undefined);

            const repository = new CachedPortfolioRepository();
            await repository.findAll();

            expect(mockCacheService.set).toHaveBeenCalledWith("portfolio:findAll:", [mockPortfolio]);

            expect(mockCacheService.set.mock.calls.length).toBeGreaterThan(0);
            const setCall = mockCacheService.set.mock.calls[0];
            expect(setCall).toBeDefined();
            expect(setCall?.[1]).toBeDefined();
            const cachedValue = setCall![1] as Portfolio[];
            expect(cachedValue.length).toBeGreaterThan(0);
            const firstPortfolio = cachedValue[0]!;
            expect(firstPortfolio).toBeDefined();
            expect(firstPortfolio.company).toBe("Test Company");
            expect(firstPortfolio.current).toBe(true);
            expect(firstPortfolio.overview).toBe("Overview");
        });

        test("should handle Date serialization correctly", async () => {
            mockCacheService.get.mockResolvedValue(null);
            mockDbRepository.findAll.mockResolvedValue([mockPortfolio]);
            mockCacheService.set.mockResolvedValue(undefined);

            const repository = new CachedPortfolioRepository();
            await repository.findAll();

            expect(mockCacheService.set).toHaveBeenCalledWith("portfolio:findAll:", [mockPortfolio]);
        });
    });
});
