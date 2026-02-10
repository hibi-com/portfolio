import { createPrismaClient } from "@portfolio/db";
import { describe, expect, test, vi } from "vitest";
import type { Post } from "~/domain/post";
import { PostRepositoryImpl } from "./post.repository";

vi.mock("@portfolio/db", () => ({
    createPrismaClient: vi.fn(),
}));

describe("PostRepositoryImpl", () => {
    const testDatabaseUrl = "mysql://user:password@localhost:3306/portfolio";

    test("should create repository instance", () => {
        const repository = new PostRepositoryImpl(testDatabaseUrl);

        expect(repository).toBeDefined();
    });

    test("should implement findAll", async () => {
        const mockPosts: Post[] = [];

        vi.mocked(createPrismaClient).mockReturnValue({
            post: {
                findMany: vi.fn().mockResolvedValue([]),
            },
        } as any);

        const repository = new PostRepositoryImpl(testDatabaseUrl);
        const result = await repository.findAll();

        expect(result).toEqual(mockPosts);
    });

    test("should implement findBySlug", async () => {
        vi.mocked(createPrismaClient).mockReturnValue({
            post: {
                findUnique: vi.fn().mockResolvedValue(null),
            },
        } as any);

        const repository = new PostRepositoryImpl(testDatabaseUrl);
        const result = await repository.findBySlug("test-slug");

        expect(result).toBeNull();
    });
});
