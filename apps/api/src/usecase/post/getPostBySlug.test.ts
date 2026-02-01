import { describe, expect, test, vi } from "vitest";
import type { Post, PostRepository } from "~/domain/post";
import { GetPostBySlugUseCase } from "./getPostBySlug";

describe("GetPostBySlugUseCase", () => {
    test("should return post by slug", async () => {
        const mockPost: Post = {
            id: "1",
            title: "Test Post",
            slug: "test-post",
            date: new Date(),
            content: "Test content",
            imageTemp: "test.jpg",
            sticky: false,
            tags: ["test"],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockRepository: PostRepository = {
            findAll: vi.fn(),
            findBySlug: vi.fn().mockResolvedValue(mockPost),
            findById: vi.fn(),
        };

        const useCase = new GetPostBySlugUseCase(mockRepository);
        const result = await useCase.execute("test-post");

        expect(result).toEqual(mockPost);
        expect(mockRepository.findBySlug).toHaveBeenCalledWith("test-post");
    });

    test("should return null when post not found", async () => {
        const mockRepository: PostRepository = {
            findAll: vi.fn(),
            findBySlug: vi.fn().mockResolvedValue(null),
            findById: vi.fn(),
        };

        const useCase = new GetPostBySlugUseCase(mockRepository);
        const result = await useCase.execute("non-existent");

        expect(result).toBeNull();
    });
});
