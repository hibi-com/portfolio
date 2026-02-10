import { describe, expect, test } from "vitest";
import { AppError, ErrorCodes } from "@portfolio/log";
import { validateBody } from "./validate";

// モックスキーマの型定義
type ZodIssue = {
    message: string;
    path: PropertyKey[];
    code: string;
};

type ZodLikeSchema<T = unknown> = {
    safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: { issues: ZodIssue[] } };
};

describe("validateBody", () => {
    describe("正常系", () => {
        test("バリデーション成功時: 正しいデータを返す", () => {
            // Given: 前提条件 - バリデーション成功するスキーマとデータ
            const schema: ZodLikeSchema<{ name: string }> = {
                safeParse: (data: unknown) => ({
                    success: true,
                    data: data as { name: string },
                }),
            };
            const body = { name: "test" };

            // When: 操作 - バリデーション実行
            const result = validateBody(schema, body);

            // Then: 検証 - 元のデータがそのまま返される
            expect(result).toEqual({ name: "test" });
        });

        test("バリデーション成功時: 複雑なオブジェクトを返す", () => {
            // Given
            const schema: ZodLikeSchema<{ user: { id: number; email: string } }> = {
                safeParse: (data: unknown) => ({
                    success: true,
                    data: data as { user: { id: number; email: string } },
                }),
            };
            const body = { user: { id: 1, email: "test@example.com" } };

            // When
            const result = validateBody(schema, body);

            // Then
            expect(result).toEqual({ user: { id: 1, email: "test@example.com" } });
        });
    });

    describe("異常系", () => {
        test("バリデーション失敗時: AppErrorをスロー", () => {
            // Given: 前提条件 - バリデーション失敗するスキーマ
            const schema: ZodLikeSchema<never> = {
                safeParse: () => ({
                    success: false,
                    error: {
                        issues: [
                            {
                                message: "Invalid email format",
                                path: ["email"],
                                code: "invalid_string",
                            },
                        ],
                    },
                }),
            };
            const body = { email: "invalid" };

            // When & Then: エラーがスローされることを確認
            expect(() => validateBody(schema, body)).toThrow(AppError);
        });

        test("バリデーション失敗時: エラーコードがVALIDATION_INVALID_FORMAT", () => {
            // Given
            const schema: ZodLikeSchema<never> = {
                safeParse: () => ({
                    success: false,
                    error: {
                        issues: [
                            {
                                message: "Invalid email format",
                                path: ["email"],
                                code: "invalid_string",
                            },
                        ],
                    },
                }),
            };
            const body = { email: "invalid" };

            // When & Then
            try {
                validateBody(schema, body);
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).code).toBe(ErrorCodes.VALIDATION_INVALID_FORMAT);
            }
        });

        test("バリデーション失敗時: 最初のissueのメッセージを使用", () => {
            // Given: 前提条件 - 複数のissuesがある
            const schema: ZodLikeSchema<never> = {
                safeParse: () => ({
                    success: false,
                    error: {
                        issues: [
                            {
                                message: "First error message",
                                path: ["field1"],
                                code: "invalid_type",
                            },
                            {
                                message: "Second error message",
                                path: ["field2"],
                                code: "invalid_string",
                            },
                        ],
                    },
                }),
            };
            const body = {};

            // When & Then
            try {
                validateBody(schema, body);
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                expect((error as AppError).message).toBe("First error message");
            }
        });

        test("複数のissuesがある場合: すべてのissuesがメタデータに含まれる", () => {
            // Given
            const schema: ZodLikeSchema<never> = {
                safeParse: () => ({
                    success: false,
                    error: {
                        issues: [
                            {
                                message: "First error",
                                path: ["field1"],
                                code: "invalid_type",
                            },
                            {
                                message: "Second error",
                                path: ["field2"],
                                code: "invalid_string",
                            },
                        ],
                    },
                }),
            };
            const body = {};

            // When & Then
            try {
                validateBody(schema, body);
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                const appError = error as AppError;
                expect(appError.metadata?.issues).toHaveLength(2);
                expect(appError.metadata?.issues).toEqual([
                    {
                        path: "field1",
                        message: "First error",
                        code: "invalid_type",
                    },
                    {
                        path: "field2",
                        message: "Second error",
                        code: "invalid_string",
                    },
                ]);
            }
        });

        test("ネストしたパス: パスが正しくドット区切りで連結される", () => {
            // Given: 前提条件 - ネストしたフィールドパス
            const schema: ZodLikeSchema<never> = {
                safeParse: () => ({
                    success: false,
                    error: {
                        issues: [
                            {
                                message: "Invalid nested field",
                                path: ["user", "profile", "email"],
                                code: "invalid_string",
                            },
                        ],
                    },
                }),
            };
            const body = {};

            // When & Then
            try {
                validateBody(schema, body);
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                const appError = error as AppError;
                expect(appError.metadata?.field).toBe("user.profile.email");
                expect(appError.metadata?.issues).toEqual([
                    {
                        path: "user.profile.email",
                        message: "Invalid nested field",
                        code: "invalid_string",
                    },
                ]);
            }
        });
    });

    describe("エッジケース", () => {
        test("issuesが空の場合: デフォルトメッセージを使用", () => {
            // Given: 前提条件 - issuesが空配列
            const schema: ZodLikeSchema<never> = {
                safeParse: () => ({
                    success: false,
                    error: {
                        issues: [],
                    },
                }),
            };
            const body = {};

            // When & Then
            try {
                validateBody(schema, body);
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                const appError = error as AppError;
                expect(appError.message).toBe("Validation failed");
                expect(appError.metadata?.field).toBe("");
                expect(appError.metadata?.issues).toEqual([]);
            }
        });

        test("パスが空配列の場合: 空文字列を返す", () => {
            // Given
            const schema: ZodLikeSchema<never> = {
                safeParse: () => ({
                    success: false,
                    error: {
                        issues: [
                            {
                                message: "Root level error",
                                path: [],
                                code: "invalid_type",
                            },
                        ],
                    },
                }),
            };
            const body = {};

            // When & Then
            try {
                validateBody(schema, body);
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                const appError = error as AppError;
                expect(appError.metadata?.field).toBe("");
                expect(appError.metadata?.issues).toEqual([
                    {
                        path: "",
                        message: "Root level error",
                        code: "invalid_type",
                    },
                ]);
            }
        });

        test("パスに数値インデックスが含まれる場合: 正しく文字列に変換される", () => {
            // Given: 前提条件 - 配列インデックスを含むパス
            const schema: ZodLikeSchema<never> = {
                safeParse: () => ({
                    success: false,
                    error: {
                        issues: [
                            {
                                message: "Invalid array item",
                                path: ["items", 0, "name"],
                                code: "invalid_string",
                            },
                        ],
                    },
                }),
            };
            const body = {};

            // When & Then
            try {
                validateBody(schema, body);
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                const appError = error as AppError;
                expect(appError.metadata?.field).toBe("items.0.name");
                expect(appError.metadata?.issues).toEqual([
                    {
                        path: "items.0.name",
                        message: "Invalid array item",
                        code: "invalid_string",
                    },
                ]);
            }
        });

        test("パスにSymbolが含まれる場合: 正しく文字列に変換される", () => {
            // Given: 前提条件 - Symbolを含むパス
            const testSymbol = Symbol("testField");
            const schema: ZodLikeSchema<never> = {
                safeParse: () => ({
                    success: false,
                    error: {
                        issues: [
                            {
                                message: "Invalid symbol field",
                                path: [testSymbol, "nested"],
                                code: "invalid_type",
                            },
                        ],
                    },
                }),
            };
            const body = {};

            // When & Then
            try {
                validateBody(schema, body);
            } catch (error) {
                expect(error).toBeInstanceOf(AppError);
                const appError = error as AppError;
                // Symbol.toString() の結果とnestedが連結される
                expect(appError.metadata?.field).toContain("Symbol");
                expect(appError.metadata?.field).toContain("nested");
            }
        });
    });
});
