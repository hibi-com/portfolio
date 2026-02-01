import { describe, expect, test } from "vitest";
import type { Post } from "../model/types";
import { filterBlogPosts } from "./filter-posts";

describe("blog", () => {
    const createMockPost = (overrides: Partial<Post>): Post => ({
        id: "1",
        title: "Test Post",
        slug: "test-post",
        date: "2023-01-01",
        content: { html: "<p>Test</p>" },
        tags: [],
        sticky: false,
        imageTemp: "",
        ...overrides,
    });

    test("should filter posts by DIY tag", () => {
        const posts: Post[] = [
            createMockPost({ tags: ["DIY"], sticky: false }),
            createMockPost({ tags: ["DIY"], sticky: true }),
            createMockPost({ tags: ["Technical"], sticky: false }),
        ];

        const result = filterBlogPosts(posts);

        expect(result.diy.data).toHaveLength(1);
        expect(result.diy.featured).toHaveLength(1);
        expect(result.diy.data[0]?.tags).toContain("DIY");
        expect(result.diy.featured[0]?.tags).toContain("DIY");
    });

    test("should filter posts by Technical tag", () => {
        const posts: Post[] = [
            createMockPost({ tags: ["Technical"], sticky: false }),
            createMockPost({ tags: ["Technical"], sticky: true }),
            createMockPost({ tags: ["DIY"], sticky: false }),
        ];

        const result = filterBlogPosts(posts);

        expect(result.technical.data).toHaveLength(1);
        expect(result.technical.featured).toHaveLength(1);
        expect(result.technical.data[0]?.tags).not.toContain("DIY");
        expect(result.technical.featured[0]?.tags).not.toContain("DIY");
    });

    test("should separate sticky and non-sticky posts", () => {
        const posts: Post[] = [
            createMockPost({ tags: ["DIY"], sticky: true }),
            createMockPost({ tags: ["DIY"], sticky: false }),
            createMockPost({ tags: ["Technical"], sticky: true }),
            createMockPost({ tags: ["Technical"], sticky: false }),
        ];

        const result = filterBlogPosts(posts);

        expect(result.diy.featured).toHaveLength(1);
        expect(result.diy.data).toHaveLength(1);
        expect(result.technical.featured).toHaveLength(1);
        expect(result.technical.data).toHaveLength(1);
    });

    test("should handle empty posts array", () => {
        const result = filterBlogPosts([]);

        expect(result.diy.data).toHaveLength(0);
        expect(result.diy.featured).toHaveLength(0);
        expect(result.technical.data).toHaveLength(0);
        expect(result.technical.featured).toHaveLength(0);
    });

    test("should handle posts with multiple tags", () => {
        const posts: Post[] = [
            createMockPost({ tags: ["DIY", "Technical"], sticky: false }),
            createMockPost({ tags: ["DIY", "Technical"], sticky: true }),
        ];

        const result = filterBlogPosts(posts);

        // Posts with DIY tag should go to diy category
        expect(result.diy.data).toHaveLength(1);
        expect(result.diy.featured).toHaveLength(1);
        expect(result.technical.data).toHaveLength(0);
        expect(result.technical.featured).toHaveLength(0);
    });

    test("should handle posts with no tags", () => {
        const posts: Post[] = [createMockPost({ tags: [], sticky: false }), createMockPost({ tags: [], sticky: true })];

        const result = filterBlogPosts(posts);

        // Posts with no tags should go to technical category
        expect(result.technical.data).toHaveLength(1);
        expect(result.technical.featured).toHaveLength(1);
        expect(result.diy.data).toHaveLength(0);
        expect(result.diy.featured).toHaveLength(0);
    });

    test("should handle posts with other tags", () => {
        const posts: Post[] = [
            createMockPost({ tags: ["Other"], sticky: false }),
            createMockPost({ tags: ["Other"], sticky: true }),
        ];

        const result = filterBlogPosts(posts);

        // Posts with other tags should go to technical category
        expect(result.technical.data).toHaveLength(1);
        expect(result.technical.featured).toHaveLength(1);
        expect(result.diy.data).toHaveLength(0);
        expect(result.diy.featured).toHaveLength(0);
    });
});
