import { describe, expect, test } from "vitest";
import type { BlogData, EnumValue, Post } from "./types";

describe("Blog Entity Types", () => {
    describe("Post", () => {
        test("should have required fields", () => {
            const post: Post = {
                id: "post-1",
                slug: "test-post",
                title: "Test Post",
                date: "2024-01-01",
                imageTemp: "https://example.com/image.jpg",
                content: {
                    html: "<p>Test content</p>",
                },
                sticky: false,
                tags: ["test", "blog"],
            };

            expect(post.id).toBe("post-1");
            expect(post.slug).toBe("test-post");
            expect(post.title).toBe("Test Post");
            expect(post.date).toBe("2024-01-01");
            expect(post.imageTemp).toBe("https://example.com/image.jpg");
            expect(post.content.html).toBe("<p>Test content</p>");
            expect(post.sticky).toBe(false);
            expect(post.tags).toEqual(["test", "blog"]);
        });

        test("should support optional fields", () => {
            const post: Post = {
                id: "post-1",
                slug: "test-post",
                title: "Test Post",
                date: "2024-01-01",
                imageTemp: "https://example.com/image.jpg",
                content: {
                    html: "<p>Test content</p>",
                    raw: { blocks: [] },
                },
                sticky: true,
                tags: ["test"],
                description: "Test description",
                intro: "Test intro",
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-02T00:00:00Z",
                images: [
                    {
                        url: "https://example.com/image.jpg",
                    },
                ],
            };

            expect(post.description).toBe("Test description");
            expect(post.intro).toBe("Test intro");
            expect(post.createdAt).toBe("2024-01-01T00:00:00Z");
            expect(post.updatedAt).toBe("2024-01-02T00:00:00Z");
            expect(post.images).toHaveLength(1);
            expect(post.sticky).toBe(true);
        });

        test("should support content with raw field", () => {
            const post: Post = {
                id: "post-1",
                slug: "test-post",
                title: "Test Post",
                date: "2024-01-01",
                imageTemp: "https://example.com/image.jpg",
                content: {
                    html: "<p>Test content</p>",
                    raw: { blocks: [{ type: "paragraph", data: { text: "Test" } }] },
                },
                sticky: false,
                tags: [],
            };

            expect(post.content.raw).toBeDefined();
        });
    });

    describe("EnumValue", () => {
        test("should have name field", () => {
            const enumValue: EnumValue = {
                name: "TypeScript",
            };

            expect(enumValue.name).toBe("TypeScript");
        });
    });

    describe("BlogData", () => {
        test("should have data and featured arrays", () => {
            const blogData: BlogData = {
                data: [
                    {
                        id: "post-1",
                        slug: "test-post-1",
                        title: "Test Post 1",
                        date: "2024-01-01",
                        imageTemp: "https://example.com/image1.jpg",
                        content: { html: "<p>Content 1</p>" },
                        sticky: false,
                        tags: [],
                    },
                ],
                featured: [
                    {
                        id: "post-2",
                        slug: "test-post-2",
                        title: "Test Post 2",
                        date: "2024-01-02",
                        imageTemp: "https://example.com/image2.jpg",
                        content: { html: "<p>Content 2</p>" },
                        sticky: true,
                        tags: [],
                    },
                ],
            };

            expect(blogData.data).toHaveLength(1);
            expect(blogData.featured).toHaveLength(1);
            expect(blogData.data[0]?.title).toBe("Test Post 1");
            expect(blogData.featured[0]?.title).toBe("Test Post 2");
        });
    });
});
