import { AppError, ErrorCodes } from "@portfolio/log";
import type { Portfolio, PortfolioRepository } from "~/domain/portfolio";
import { getLogger } from "~/lib/logger";
import { CacheService } from "./cache.service";
import { PortfolioRepositoryImpl } from "./portfolio.repository";

export class CachedPortfolioRepository implements PortfolioRepository {
    private readonly cacheService: CacheService;
    private readonly dbRepository: PortfolioRepositoryImpl;
    private readonly logger = getLogger();

    constructor(databaseUrl?: string, redisUrl?: string) {
        this.cacheService = new CacheService(redisUrl);
        this.dbRepository = new PortfolioRepositoryImpl(databaseUrl);
    }

    private getCacheKey(method: string, ...args: unknown[]): string {
        return `portfolio:${method}:${args.join(":")}`;
    }

    async findAll(): Promise<Portfolio[]> {
        const cacheKey = this.getCacheKey("findAll");

        const cached = await this.cacheService.get<Portfolio[]>(cacheKey);
        if (cached) {
            return cached;
        }

        const portfolios = await this.dbRepository.findAll();

        this.cacheService.set(cacheKey, portfolios).catch((error) => {
            const appError = AppError.fromCode(ErrorCodes.CACHE_OPERATION_ERROR, "Redis書き込みエラー（findAll）", {
                metadata: { method: "findAll", cacheKey },
                originalError: error instanceof Error ? error : new Error(String(error)),
            });
            this.logger.warn(appError.message, { error: appError });
        });

        return portfolios;
    }

    async findBySlug(slug: string): Promise<Portfolio | null> {
        const cacheKey = this.getCacheKey("findBySlug", slug);

        const cached = await this.cacheService.get<Portfolio>(cacheKey);
        if (cached) {
            return cached;
        }

        const portfolio = await this.dbRepository.findBySlug(slug);

        if (portfolio) {
            this.cacheService.set(cacheKey, portfolio).catch((error) => {
                const appError = AppError.fromCode(
                    ErrorCodes.CACHE_OPERATION_ERROR,
                    "Redis書き込みエラー（findBySlug）",
                    {
                        metadata: { method: "findBySlug", cacheKey, slug },
                        originalError: error instanceof Error ? error : new Error(String(error)),
                    },
                );
                this.logger.warn(appError.message, { error: appError });
            });
        }

        return portfolio;
    }

    async findById(id: string): Promise<Portfolio | null> {
        const cacheKey = this.getCacheKey("findById", id);

        const cached = await this.cacheService.get<Portfolio>(cacheKey);
        if (cached) {
            return cached;
        }

        const portfolio = await this.dbRepository.findById(id);

        if (portfolio) {
            this.cacheService.set(cacheKey, portfolio).catch((error) => {
                const appError = AppError.fromCode(
                    ErrorCodes.CACHE_OPERATION_ERROR,
                    "Redis書き込みエラー（findById）",
                    {
                        metadata: { method: "findById", cacheKey, id },
                        originalError: error instanceof Error ? error : new Error(String(error)),
                    },
                );
                this.logger.warn(appError.message, { error: appError });
            });
        }

        return portfolio;
    }

    async addImage(portfolioId: string, imageUrl: string): Promise<void> {
        await this.dbRepository.addImage(portfolioId, imageUrl);
        const portfolio = await this.dbRepository.findById(portfolioId);
        if (portfolio) {
            await this.invalidateCache(portfolio.slug, portfolioId);
        }
    }

    async invalidateCache(slug?: string, id?: string): Promise<void> {
        await this.cacheService.delete(this.getCacheKey("findAll"));

        if (slug) {
            await this.cacheService.delete(this.getCacheKey("findBySlug", slug));
        }

        if (id) {
            await this.cacheService.delete(this.getCacheKey("findById", id));
        }
    }
}
