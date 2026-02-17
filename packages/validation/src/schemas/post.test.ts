import { describe, expect, test } from "vitest";
import { postContentSchema, postSchema } from "./post";

describe("Post Zod Schemas", () => {
    describe("postContentSchema", () => {
        test("should validate post content with html", () => {
            const result = postContentSchema.safeParse({ html: "<p>Test</p>" });
            expect(result.success).toBe(true);
        });

        test("should validate post content with html and raw", () => {
            const result = postContentSchema.safeParse({
                html: "<p>Test</p>",
                raw: { type: "doc" },
            });
            expect(result.success).toBe(true);
        });

        test("should reject post content without html", () => {
            const result = postContentSchema.safeParse({});
            expect(result.success).toBe(false);
        });
    });

    describe("postSchema", () => {
        test("should validate complete post", () => {
            const result = postSchema.safeParse({
                id: "1",
                title: "Test Post",
                slug: "test-post",
                date: "2024-01-01",
                content: "<p>Test</p>",
                imageTemp: "test.jpg",
                tags: ["test"],
                sticky: false,
                createdAt: "2024-01-01",
                updatedAt: "2024-01-01",
            });
            expect(result.success).toBe(true);
        });

        test("should reject post without required fields", () => {
            const result = postSchema.safeParse({
                id: "1",
                title: "Test Post",
            });
            expect(result.success).toBe(false);
        });
    });
});
