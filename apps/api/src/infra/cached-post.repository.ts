import { AppError, ErrorCodes } from "@portfolio/log";
import type { Post, PostRepository } from "~/domain/post";
import { getLogger } from "~/lib/logger";
import { CacheService } from "./cache.service";
import { PostRepositoryImpl } from "./post.repository";

export class CachedPostRepository implements PostRepository {
    private readonly cacheService: CacheService;
    private readonly dbRepository: PostRepositoryImpl;
    private readonly logger = getLogger();

    constructor(databaseUrl?: string, redisUrl?: string) {
        this.cacheService = new CacheService(redisUrl);
        this.dbRepository = new PostRepositoryImpl(databaseUrl);
    }

    private getCacheKey(method: string, ...args: unknown[]): string {
        return `post:${method}:${args.join(":")}`;
    }

    async findAll(): Promise<Post[]> {
        const cacheKey = this.getCacheKey("findAll");

        const cached = await this.cacheService.get<Post[]>(cacheKey);
        if (cached) {
            return cached;
        }

        const posts = await this.dbRepository.findAll();

        this.cacheService.set(cacheKey, posts).catch((error) => {
            const appError = AppError.fromCode(ErrorCodes.CACHE_OPERATION_ERROR, "Redis書き込みエラー（findAll）", {
                metadata: { method: "findAll", cacheKey },
                originalError: error instanceof Error ? error : new Error(String(error)),
            });
            this.logger.warn(appError.message, { error: appError });
        });

        return posts;
    }

    async findBySlug(slug: string): Promise<Post | null> {
        const cacheKey = this.getCacheKey("findBySlug", slug);

        const cached = await this.cacheService.get<Post>(cacheKey);
        if (cached) {
            return cached;
        }

        const post = await this.dbRepository.findBySlug(slug);

        if (post) {
            this.cacheService.set(cacheKey, post).catch((error) => {
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

        return post;
    }

    async findById(id: string): Promise<Post | null> {
        const cacheKey = this.getCacheKey("findById", id);

        const cached = await this.cacheService.get<Post>(cacheKey);
        if (cached) {
            return cached;
        }

        const post = await this.dbRepository.findById(id);

        if (post) {
            this.cacheService.set(cacheKey, post).catch((error) => {
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

        return post;
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
