import { describe, expect, test } from "vitest";
import { z } from "zod";
import { formatValidationError, safeParse, validate, validateOrThrow } from "./validation";

describe("validation", () => {
    const testSchema = z.object({
        name: z.string().min(1),
        age: z.number().int().positive(),
    });

    describe("validate", () => {
        test("should return success true with data when validation passes", () => {
            const result = validate(testSchema, {
                name: "John",
                age: 30,
            });

            expect(result.success).toBe(true);
            expect(result.data).toEqual({
                name: "John",
                age: 30,
            });
            expect(result.errors).toBeUndefined();
        });

        test("should return success false with errors when validation fails", () => {
            const result = validate(testSchema, {
                name: "",
                age: -1,
            });

            expect(result.success).toBe(false);
            expect(result.data).toBeUndefined();
            expect(result.errors).toBeDefined();
            expect(result.errors?.issues).toHaveLength(2);
        });

        test("should return success false when data type is invalid", () => {
            const result = validate(testSchema, "invalid");

            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
        });
    });

    describe("validateOrThrow", () => {
        test("should return data when validation passes", () => {
            const result = validateOrThrow(testSchema, {
                name: "John",
                age: 30,
            });

            expect(result).toEqual({
                name: "John",
                age: 30,
            });
        });

        test("should throw ZodError when validation fails", () => {
            expect(() => {
                validateOrThrow(testSchema, {
                    name: "",
                    age: -1,
                });
            }).toThrow();
        });
    });

    describe("safeParse", () => {
        test("should return success true with data when validation passes", () => {
            const result = safeParse(testSchema, { name: "John", age: 30 });

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual({ name: "John", age: 30 });
            }
        });

        test("should return success false with error when validation fails", () => {
            const result = safeParse(testSchema, { name: "", age: -1 });

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues).toHaveLength(2);
            }
        });
    });

    describe("formatValidationError", () => {
        test("should format validation errors by field path", () => {
            const emailSchema = z.string().email();
            const schema = z.object({
                name: z.string().min(1),
                email: emailSchema,
            });
            const result = schema.safeParse({ name: "", email: "invalid" });

            if (!result.success) {
                const formatted = formatValidationError(result.error);
                expect(formatted).toHaveProperty("name");
                expect(formatted).toHaveProperty("email");
            }
        });

        test("should handle nested object paths", () => {
            const schema = z.object({
                user: z.object({
                    name: z.string().min(1),
                    age: z.number().positive(),
                }),
            });
            const result = schema.safeParse({ user: { name: "", age: -1 } });

            if (!result.success) {
                const formatted = formatValidationError(result.error);
                expect(formatted).toHaveProperty("user.name");
                expect(formatted).toHaveProperty("user.age");
            }
        });

        test("should handle array index paths", () => {
            const schema = z.object({
                items: z.array(z.string().min(1)),
            });
            const result = schema.safeParse({ items: ["", "valid"] });

            if (!result.success) {
                const formatted = formatValidationError(result.error);
                expect(formatted).toHaveProperty("items.0");
            }
        });

        test("should collect multiple errors for same field", () => {
            const schema = z.object({
                email: z.string().min(10),
            });
            const result = schema.safeParse({ email: "short" });

            if (!result.success) {
                const formatted = formatValidationError(result.error);
                expect(formatted.email?.length).toBeGreaterThanOrEqual(1);
            }
        });

        test("should handle root level errors", () => {
            const schema = z.string().min(1);
            const result = schema.safeParse("");

            if (!result.success) {
                const formatted = formatValidationError(result.error);
                expect(formatted).toHaveProperty("");
            }
        });
    });
});
