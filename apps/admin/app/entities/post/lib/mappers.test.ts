import type { Post } from "../model/types";
import { mapApiPostToPost, postToListItem } from "./mappers";

describe("mapApiPostToPost", () => {
    test("should return Post entity with all fields", () => {
        const mockPost: Post = {
            id: "1",
            title: "Test Post",
            slug: "test-post",
            date: "2024-01-01",
            description: "Test description",
            content: {
                html: "<p>Test content</p>",
                raw: { type: "doc" },
            },
            imageTemp: "/test.jpg",
            tags: ["test", "example"],
            sticky: false,
            intro: "Test intro",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-02T00:00:00Z",
        };

        const result = mapApiPostToPost(mockPost);

        expect(result).toEqual(mockPost);
    });

    test("should handle Post with optional fields undefined", () => {
        const mockPost: Post = {
            id: "1",
            title: "Test Post",
            slug: "test-post",
            date: "2024-01-01",
            content: {
                html: "<p>Test content</p>",
            },
            imageTemp: "/test.jpg",
            tags: [],
            sticky: false,
        };

        const result = mapApiPostToPost(mockPost);

        expect(result).toEqual(mockPost);
        expect(result.description).toBeUndefined();
        expect(result.content.raw).toBeUndefined();
        expect(result.intro).toBeUndefined();
        expect(result.createdAt).toBeUndefined();
        expect(result.updatedAt).toBeUndefined();
    });

    test("should handle Post with content.raw undefined", () => {
        const mockPost: Post = {
            id: "1",
            title: "Test Post",
            slug: "test-post",
            date: "2024-01-01",
            content: {
                html: "<p>Test content</p>",
            },
            imageTemp: "/test.jpg",
            tags: [],
            sticky: false,
        };

        const result = mapApiPostToPost(mockPost);

        expect(result.content.raw).toBeUndefined();
    });
});

describe("postToListItem", () => {
    test("should return PostListItem with required fields", () => {
        const mockPost: Post = {
            id: "1",
            title: "Test Post",
            slug: "test-post",
            date: "2024-01-01",
            description: "Test description",
            content: {
                html: "<p>Test content</p>",
            },
            imageTemp: "/test.jpg",
            tags: ["test", "example"],
            sticky: false,
        };

        const result = postToListItem(mockPost);

        expect(result).toEqual({
            id: "1",
            title: "Test Post",
            slug: "test-post",
            date: "2024-01-01",
            description: "Test description",
            tags: ["test", "example"],
            sticky: false,
        });
    });

    test("should exclude fields not in PostListItem", () => {
        const mockPost: Post = {
            id: "1",
            title: "Test Post",
            slug: "test-post",
            date: "2024-01-01",
            description: "Test description",
            content: {
                html: "<p>Test content</p>",
                raw: { type: "doc" },
            },
            imageTemp: "/test.jpg",
            tags: ["test"],
            sticky: false,
            intro: "Test intro",
            createdAt: "2024-01-01T00:00:00Z",
            updatedAt: "2024-01-02T00:00:00Z",
        };

        const result = postToListItem(mockPost);

        expect(result).not.toHaveProperty("content");
        expect(result).not.toHaveProperty("imageTemp");
        expect(result).not.toHaveProperty("intro");
        expect(result).not.toHaveProperty("createdAt");
        expect(result).not.toHaveProperty("updatedAt");
    });

    test("should handle Post with description undefined", () => {
        const mockPost: Post = {
            id: "1",
            title: "Test Post",
            slug: "test-post",
            date: "2024-01-01",
            content: {
                html: "<p>Test content</p>",
            },
            imageTemp: "/test.jpg",
            tags: [],
            sticky: false,
        };

        const result = postToListItem(mockPost);

        expect(result.description).toBeUndefined();
    });

    test("should handle Post with empty tags array", () => {
        const mockPost: Post = {
            id: "1",
            title: "Test Post",
            slug: "test-post",
            date: "2024-01-01",
            content: {
                html: "<p>Test content</p>",
            },
            imageTemp: "/test.jpg",
            tags: [],
            sticky: false,
        };

        const result = postToListItem(mockPost);

        expect(result.tags).toEqual([]);
    });
});
