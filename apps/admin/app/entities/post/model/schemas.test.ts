import { blogDataSchema, postContentSchema, postFormDataSchema, postListItemSchema, postSchema } from "./schemas";

describe("Post Entity Schemas", () => {
    describe("postSchema", () => {
        test("should validate valid post", () => {
            const validPost = {
                id: "post-1",
                title: "Test Post",
                slug: "test-post",
                date: "2024-01-01",
                content: "<p>Test content</p>",
                imageTemp: "https://example.com/image.jpg",
                tags: ["test", "blog"],
                sticky: false,
                createdAt: "2024-01-01",
                updatedAt: "2024-01-01",
            };

            const result = postSchema.safeParse(validPost);
            expect(result.success).toBe(true);
        });

        test("should validate post with optional fields", () => {
            const postWithOptional = {
                id: "post-1",
                title: "Test Post",
                slug: "test-post",
                date: "2024-01-01",
                description: "Test description",
                content: "<p>Test content</p>",
                contentRaw: { type: "doc" },
                imageTemp: "https://example.com/image.jpg",
                tags: ["test"],
                sticky: true,
                intro: "Introduction",
                createdAt: "2024-01-01",
                updatedAt: "2024-01-02",
                images: [{ url: "https://example.com/img.jpg" }],
            };

            const result = postSchema.safeParse(postWithOptional);
            expect(result.success).toBe(true);
        });

        test("should reject invalid post", () => {
            const invalidPosts = [
                {
                    id: "",
                    title: "Test",
                    slug: "test",
                    date: "2024-01-01",
                    content: "content",
                    imageTemp: "img.jpg",
                    tags: [],
                    sticky: false,
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                },
                {
                    id: "post-1",
                    title: "",
                    slug: "test",
                    date: "2024-01-01",
                    content: "content",
                    imageTemp: "img.jpg",
                    tags: [],
                    sticky: false,
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                },
            ];

            for (const invalid of invalidPosts) {
                const result = postSchema.safeParse(invalid);
                expect(result.success).toBe(false);
            }
        });
    });

    describe("postContentSchema", () => {
        test("should validate valid content", () => {
            const validContent = {
                html: "<p>Content</p>",
            };

            const result = postContentSchema.safeParse(validContent);
            expect(result.success).toBe(true);
        });

        test("should validate content with raw", () => {
            const contentWithRaw = {
                html: "<p>Content</p>",
                raw: { type: "doc", content: [] },
            };

            const result = postContentSchema.safeParse(contentWithRaw);
            expect(result.success).toBe(true);
        });
    });

    describe("postListItemSchema", () => {
        test("should validate valid list item", () => {
            const validListItem = {
                id: "post-1",
                title: "Test Post",
                slug: "test-post",
                date: "2024-01-01",
                tags: ["test"],
                sticky: false,
            };

            const result = postListItemSchema.safeParse(validListItem);
            expect(result.success).toBe(true);
        });

        test("should validate list item with optional description", () => {
            const listItemWithDesc = {
                id: "post-1",
                title: "Test Post",
                slug: "test-post",
                date: "2024-01-01",
                description: "Short description",
                tags: ["test", "blog"],
                sticky: true,
            };

            const result = postListItemSchema.safeParse(listItemWithDesc);
            expect(result.success).toBe(true);
        });
    });

    describe("postFormDataSchema", () => {
        test("should validate valid form data", () => {
            const validFormData = {
                title: "New Post",
                slug: "new-post",
                date: "2024-01-01",
                content: {
                    html: "<p>Content</p>",
                },
                imageTemp: "https://example.com/image.jpg",
                tags: ["new"],
                sticky: false,
            };

            const result = postFormDataSchema.safeParse(validFormData);
            expect(result.success).toBe(true);
        });

        test("should validate form data with optional fields", () => {
            const formDataWithOptional = {
                title: "New Post",
                slug: "new-post",
                date: "2024-01-01",
                description: "Description",
                content: {
                    html: "<p>Content</p>",
                    raw: { type: "doc" },
                },
                imageTemp: "https://example.com/image.jpg",
                tags: ["new", "test"],
                sticky: true,
                intro: "Intro text",
            };

            const result = postFormDataSchema.safeParse(formDataWithOptional);
            expect(result.success).toBe(true);
        });

        test("should reject invalid form data", () => {
            const invalidFormData = [
                {
                    title: "",
                    slug: "test",
                    date: "2024-01-01",
                    content: { html: "content" },
                    imageTemp: "img.jpg",
                    tags: [],
                    sticky: false,
                },
                {
                    title: "Test",
                    slug: "",
                    date: "2024-01-01",
                    content: { html: "content" },
                    imageTemp: "img.jpg",
                    tags: [],
                    sticky: false,
                },
                {
                    title: "Test",
                    slug: "test",
                    date: "",
                    content: { html: "content" },
                    imageTemp: "img.jpg",
                    tags: [],
                    sticky: false,
                },
                {
                    title: "Test",
                    slug: "test",
                    date: "2024-01-01",
                    content: { html: "" },
                    imageTemp: "img.jpg",
                    tags: [],
                    sticky: false,
                },
            ];

            for (const invalid of invalidFormData) {
                const result = postFormDataSchema.safeParse(invalid);
                expect(result.success).toBe(false);
            }
        });
    });

    describe("blogDataSchema", () => {
        test("should validate valid blog data", () => {
            const validBlogData = {
                data: [
                    {
                        id: "post-1",
                        title: "Test",
                        slug: "test",
                        date: "2024-01-01",
                        content: "content",
                        imageTemp: "img.jpg",
                        tags: [],
                        sticky: false,
                        createdAt: "2024-01-01",
                        updatedAt: "2024-01-01",
                    },
                ],
                featured: [],
            };

            const result = blogDataSchema.safeParse(validBlogData);
            expect(result.success).toBe(true);
        });
    });
});
