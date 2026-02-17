import { blogDataSchema, enumValueSchema, postSchema } from "./schemas";

describe("Blog Entity Schemas", () => {
    describe("postSchema", () => {
        test("should validate valid post", () => {
            const validPost = {
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

            const result = postSchema.safeParse(validPost);
            expect(result.success).toBe(true);
        });

        test("should validate post with optional fields", () => {
            const postWithOptional = {
                id: "post-1",
                slug: "test-post",
                title: "Test Post",
                date: "2024-01-01",
                imageTemp: "https://example.com/image.jpg",
                content: {
                    html: "<p>Test content</p>",
                    raw: { type: "doc" },
                },
                sticky: false,
                tags: ["test", "blog"],
                createdAt: "2024-01-01",
                description: "Test description",
                images: [{ url: "https://example.com/image.jpg" }],
                intro: "Test intro",
                updatedAt: "2024-01-02",
            };

            const result = postSchema.safeParse(postWithOptional);
            expect(result.success).toBe(true);
        });

        test("should reject invalid post", () => {
            const invalidPosts = [
                {
                    id: "",
                    slug: "test-post",
                    title: "Test Post",
                    date: "2024-01-01",
                    imageTemp: "https://example.com/image.jpg",
                    content: {
                        html: "<p>Test content</p>",
                    },
                    sticky: false,
                    tags: ["test", "blog"],
                },
                {
                    id: "post-1",
                    slug: "",
                    title: "Test Post",
                    date: "2024-01-01",
                    imageTemp: "https://example.com/image.jpg",
                    content: {
                        html: "<p>Test content</p>",
                    },
                    sticky: false,
                    tags: ["test", "blog"],
                },
            ];

            for (const invalid of invalidPosts) {
                const result = postSchema.safeParse(invalid);
                expect(result.success).toBe(false);
            }
        });
    });

    describe("enumValueSchema", () => {
        test("should validate valid enum value", () => {
            const validEnumValue = {
                name: "TypeScript",
            };

            const result = enumValueSchema.safeParse(validEnumValue);
            expect(result.success).toBe(true);
        });

        test("should reject invalid enum value", () => {
            const result = enumValueSchema.safeParse({ name: "" });
            expect(result.success).toBe(false);
        });
    });

    describe("blogDataSchema", () => {
        test("should validate valid blog data", () => {
            const validBlogData = {
                data: [
                    {
                        id: "post-1",
                        slug: "test-post",
                        title: "Test Post",
                        date: "2024-01-01",
                        imageTemp: "https://example.com/image.jpg",
                        content: {
                            html: "<p>Test content</p>",
                        },
                        sticky: false,
                        tags: ["test"],
                    },
                ],
                featured: [],
            };

            const result = blogDataSchema.safeParse(validBlogData);
            expect(result.success).toBe(true);
        });
    });
});
