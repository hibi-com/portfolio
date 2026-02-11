import { describe, expect, test, vi } from "vitest";
import type { Post, PostRepository } from "~/domain/post";
import { GetPostsUseCase } from "./getPosts";

describe("GetPostsUseCase", () => {
    test("should return all posts", async () => {
        const mockPosts: Post[] = [
            {
                id: "1",
                title: "Test Post",
                slug: "test-post",
                date: "2024-01-01",
                content: { html: "Test content" },
                imageTemp: "test.jpg",
                sticky: false,
                tags: ["test"],
                createdAt: "2024-01-01T00:00:00.000Z",
                updatedAt: "2024-01-01T00:00:00.000Z",
            },
        ];

        const mockRepository: PostRepository = {
            findAll: vi.fn().mockResolvedValue(mockPosts),
            findBySlug: vi.fn(),
            findById: vi.fn(),
        };

        const useCase = new GetPostsUseCase(mockRepository);
        const result = await useCase.execute();

        expect(result).toEqual(mockPosts);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
});
