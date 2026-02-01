import { describe, expect, test } from "vitest";
import type { Post } from "~/entities/blog";
import type { BlogFeaturedProps, BlogPreviewProps, BlogUpcomingProps } from "./types";

describe("BlogPreview Feature Types", () => {
    describe("BlogFeaturedProps", () => {
        test("should have required fields", () => {
            const mockPost: Post = {
                id: "post-1",
                slug: "test-post",
                title: "Test Post",
                date: "2024-01-01",
                imageTemp: "https://example.com/image.jpg",
                content: {
                    html: "<p>Test content</p>",
                },
                sticky: false,
                tags: [],
            };

            const props: BlogFeaturedProps = {
                post: mockPost,
            };

            expect(props.post).toBeDefined();
            expect(props.post.id).toBe("post-1");
            expect(props.post.slug).toBe("test-post");
        });

        test("should support optional className field", () => {
            const mockPost: Post = {
                id: "post-1",
                slug: "test-post",
                title: "Test Post",
                date: "2024-01-01",
                imageTemp: "https://example.com/image.jpg",
                content: {
                    html: "<p>Test content</p>",
                },
                sticky: false,
                tags: [],
            };

            const props: BlogFeaturedProps = {
                className: "custom-class",
                post: mockPost,
            };

            expect(props.className).toBe("custom-class");
        });
    });

    describe("BlogPreviewProps", () => {
        test("should have required fields", () => {
            const props: BlogPreviewProps = {
                date: "2024-01-01",
                slug: "test-post",
                title: "Test Post",
                image: "https://example.com/image.jpg",
            };

            expect(props.date).toBe("2024-01-01");
            expect(props.slug).toBe("test-post");
            expect(props.title).toBe("Test Post");
            expect(props.image).toBe("https://example.com/image.jpg");
        });

        test("should support optional fields", () => {
            const props: BlogPreviewProps = {
                className: "custom-class",
                date: "2024-01-01",
                heading: "h2",
                slug: "test-post",
                title: "Test Post",
                image: "https://example.com/image.jpg",
            };

            expect(props.className).toBe("custom-class");
            expect(props.heading).toBe("h2");
        });
    });

    describe("BlogUpcomingProps", () => {
        test("should support optional className field", () => {
            const props: BlogUpcomingProps = {
                className: "custom-class",
            };

            expect(props.className).toBe("custom-class");
        });

        test("should work without className", () => {
            const props: BlogUpcomingProps = {};

            expect(props).toBeDefined();
        });
    });
});
