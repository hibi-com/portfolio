import { describe, expect, test } from "vitest";
import { assetSchema, emailSchema, enumValueSchema, slugSchema, tagSchema, typeInfoSchema, urlSchema } from "./shared";

describe("Shared Zod Schemas", () => {
    describe("slugSchema", () => {
        test.each(["hello-world", "test", "my-post-123", "a", "123"])("should accept valid slug: %s", (slug) => {
            const result = slugSchema.safeParse(slug);
            expect(result.success).toBe(true);
        });

        test.each([
            "Hello-World",
            "test_slug",
            "my post",
            "hello!",
            "UPPERCASE",
            "日本語",
        ])("should reject invalid slug: %s", (slug) => {
            const result = slugSchema.safeParse(slug);
            expect(result.success).toBe(false);
        });

        test("should reject empty string", () => {
            const result = slugSchema.safeParse("");
            expect(result.success).toBe(false);
        });
    });

    describe("urlSchema", () => {
        test("should validate valid URL", () => {
            expect(urlSchema.safeParse("https://example.com").success).toBe(true);
        });

        test("should reject invalid URL", () => {
            expect(urlSchema.safeParse("not-a-url").success).toBe(false);
        });
    });

    describe("emailSchema", () => {
        test.each([
            "test@example.com",
            "user.name@domain.co.jp",
            "user+tag@example.org",
            "a@b.co",
            "user123@test-domain.com",
        ])("should accept valid email: %s", (email) => {
            const result = emailSchema.safeParse(email);
            expect(result.success).toBe(true);
        });

        test.each([
            "invalid-email",
            "@example.com",
            "user@",
            "user@.com",
            "user @example.com",
            "user@ example.com",
            "",
        ])("should reject invalid email: %s", (email) => {
            const result = emailSchema.safeParse(email);
            expect(result.success).toBe(false);
        });
    });

    describe("assetSchema", () => {
        test("should validate asset with valid URL", () => {
            const result = assetSchema.safeParse({
                url: "https://example.com/image.jpg",
            });
            expect(result.success).toBe(true);
        });

        test("should reject asset with invalid URL", () => {
            const result = assetSchema.safeParse({ url: "not-a-url" });
            expect(result.success).toBe(false);
        });
    });

    describe("tagSchema", () => {
        test("should validate tag with name", () => {
            const result = tagSchema.safeParse({ name: "test" });
            expect(result.success).toBe(true);
        });

        test("should reject empty name", () => {
            const result = tagSchema.safeParse({ name: "" });
            expect(result.success).toBe(false);
        });
    });

    describe("enumValueSchema", () => {
        test("should validate enum value with name", () => {
            const result = enumValueSchema.safeParse({ name: "VALUE" });
            expect(result.success).toBe(true);
        });

        test("should reject empty name", () => {
            const result = enumValueSchema.safeParse({ name: "" });
            expect(result.success).toBe(false);
        });
    });

    describe("typeInfoSchema", () => {
        test("should validate type info with enum values", () => {
            const result = typeInfoSchema.safeParse({
                enumValues: [{ name: "VALUE1" }, { name: "VALUE2" }],
            });
            expect(result.success).toBe(true);
        });

        test("should validate type info without enum values", () => {
            const result = typeInfoSchema.safeParse({});
            expect(result.success).toBe(true);
        });
    });
});
