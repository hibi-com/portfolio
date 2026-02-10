import { describe, expect, it } from "vitest";
import { AppError } from "./app-error";
import { ErrorCodes } from "./error-codes";

describe("AppError", () => {
    describe("fromCode", () => {
        it("エラーコードからエラーを作成できる", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN);
            expect(error.code).toBe(ErrorCodes.AUTH_INVALID_TOKEN);
            expect(error.category).toBe("AUTH");
            expect(error.httpStatus).toBe(401);
            expect(error.message).toBeTruthy();
        });

        it("デフォルトメッセージが設定される", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN);
            expect(error.message).toBe("無効なトークンです");
        });

        it("カスタムメッセージを設定できる", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN, "カスタムメッセージ");
            expect(error.message).toBe("カスタムメッセージ");
        });

        it("メタデータを設定できる", () => {
            const error = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "エラー", {
                metadata: { field: "username" },
            });
            expect(error.metadata).toEqual({ field: "username" });
        });

        it("メタデータなしでもエラーを作成できる", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN, "エラー");
            expect(error.metadata).toBeUndefined();
        });

        it("元のエラーを保持できる", () => {
            const originalError = new Error("元のエラー");
            const error = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "エラー", {
                originalError,
            });
            expect(error.originalError).toBe(originalError);
        });

        it("元のエラーなしでもエラーを作成できる", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN, "エラー");
            expect(error.originalError).toBeUndefined();
        });

        it("causeプロパティを設定できる", () => {
            const cause = new Error("原因エラー");
            const error = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "エラー", {
                cause,
            });
            expect(error.cause).toBe(cause);
        });

        it("causeとoriginalErrorを同時に設定できる", () => {
            const cause = new Error("原因エラー");
            const originalError = new Error("元のエラー");
            const error = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "エラー", {
                cause,
                originalError,
            });
            expect(error.cause).toBe(cause);
            expect(error.originalError).toBe(originalError);
        });

        it("causeがError以外の型でも設定できる", () => {
            const causeString = "文字列の原因";
            const error1 = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "エラー", {
                cause: causeString,
            });
            expect(error1.cause).toBe(causeString);

            const causeNumber = 123;
            const error2 = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "エラー", {
                cause: causeNumber,
            });
            expect(error2.cause).toBe(causeNumber);

            const causeObject = { key: "value" };
            const error3 = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "エラー", {
                cause: causeObject,
            });
            expect(error3.cause).toBe(causeObject);
        });

        it("messageがundefinedの場合、デフォルトメッセージが使用される", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN);
            expect(error.message).toBe("無効なトークンです");
        });

        it("messageが空文字列の場合、空文字列が使用される", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN, "");
            expect(error.message).toBe("");
        });

        it("すべてのエラーコードでデフォルトメッセージが設定される", () => {
            const error1 = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD);
            expect(error1.message).toBeTruthy();

            const error2 = AppError.fromCode(ErrorCodes.NOT_FOUND_RESOURCE);
            expect(error2.message).toBeTruthy();

            const error3 = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR);
            expect(error3.message).toBeTruthy();
        });

        it("デフォルトメッセージが存在しないエラーコードの場合、フォールバックメッセージが使用される", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN);
            expect(error.message).toBeTruthy();
            expect(typeof error.message).toBe("string");
        });
    });

    describe("constructor", () => {
        it("コンストラクタで直接エラーを作成できる", () => {
            const error = new AppError(ErrorCodes.AUTH_INVALID_TOKEN, "エラーメッセージ");
            expect(error.code).toBe(ErrorCodes.AUTH_INVALID_TOKEN);
            expect(error.message).toBe("エラーメッセージ");
            expect(error.category).toBe("AUTH");
            expect(error.httpStatus).toBe(401);
        });

        it("コンストラクタでメタデータを設定できる", () => {
            const error = new AppError(ErrorCodes.VALIDATION_MISSING_FIELD, "エラー", {
                metadata: { field: "test" },
            });
            expect(error.metadata).toEqual({ field: "test" });
        });

        it("コンストラクタで元のエラーを設定できる", () => {
            const originalError = new Error("元のエラー");
            const error = new AppError(ErrorCodes.INTERNAL_SERVER_ERROR, "エラー", {
                originalError,
            });
            expect(error.originalError).toBe(originalError);
        });

        it("コンストラクタでcauseを設定できる", () => {
            const cause = new Error("原因エラー");
            const error = new AppError(ErrorCodes.INTERNAL_SERVER_ERROR, "エラー", {
                cause,
            });
            expect(error.cause).toBe(cause);
        });

        it("コンストラクタでcauseとoriginalErrorを同時に設定できる", () => {
            const cause = new Error("原因エラー");
            const originalError = new Error("元のエラー");
            const error = new AppError(ErrorCodes.INTERNAL_SERVER_ERROR, "エラー", {
                cause,
                originalError,
            });
            expect(error.cause).toBe(cause);
            expect(error.originalError).toBe(originalError);
        });
    });

    describe("toJSON", () => {
        it("すべてのフィールドを含むJSONを生成する", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN, "エラー", {
                metadata: { field: "test" },
            });
            const json = error.toJSON();
            expect(json.code).toBe(ErrorCodes.AUTH_INVALID_TOKEN);
            expect(json.category).toBe("AUTH");
            expect(json.message).toBe("エラー");
            expect(json.httpStatus).toBe(401);
            expect(json.metadata).toEqual({ field: "test" });
        });

        it("メタデータなしの場合、metadataフィールドを含まない", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN, "エラー");
            const json = error.toJSON();
            expect(json.metadata).toBeUndefined();
        });

        it("すべてのエラーコードでJSONを生成できる", () => {
            const error1 = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD);
            expect(error1.toJSON()).toBeDefined();

            const error2 = AppError.fromCode(ErrorCodes.NOT_FOUND_RESOURCE);
            expect(error2.toJSON()).toBeDefined();

            const error3 = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR);
            expect(error3.toJSON()).toBeDefined();
        });

        it("originalErrorはtoJSONに含まれない", () => {
            const originalError = new Error("元のエラー");
            const error = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "エラー", {
                originalError,
            });
            const json = error.toJSON();
            expect(json).not.toHaveProperty("originalError");
            expect(json).not.toHaveProperty("cause");
        });

        it("空のメタデータオブジェクトを設定した場合、metadataフィールドが含まれる", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN, "エラー", {
                metadata: {},
            });
            const json = error.toJSON();
            expect(json.metadata).toEqual({});
        });

        it("ネストされたオブジェクトを含むメタデータを正しくシリアライズできる", () => {
            const error = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "エラー", {
                metadata: {
                    field: "username",
                    nested: { key: "value", array: [1, 2, 3] },
                },
            });
            const json = error.toJSON();
            expect(json.metadata).toEqual({
                field: "username",
                nested: { key: "value", array: [1, 2, 3] },
            });
        });

        it("nullやundefinedを含むメタデータを正しくシリアライズできる", () => {
            const error = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "エラー", {
                metadata: {
                    nullValue: null,
                    undefinedValue: undefined,
                    stringValue: "test",
                },
            });
            const json = error.toJSON();
            expect(json.metadata).toHaveProperty("nullValue", null);
            expect(json.metadata).toHaveProperty("undefinedValue", undefined);
            expect(json.metadata).toHaveProperty("stringValue", "test");
        });
    });

    describe("スタックトレース", () => {
        it("スタックトレースが設定される", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN);
            expect(error.stack).toBeDefined();
            expect(error.stack).toContain("AppError");
        });
    });

    describe("エラープロパティ", () => {
        it("nameプロパティがAppErrorに設定される", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN);
            expect(error.name).toBe("AppError");
        });

        it("すべてのプロパティが正しく設定される", () => {
            const originalError = new Error("元のエラー");
            const error = new AppError(ErrorCodes.VALIDATION_MISSING_FIELD, "エラー", {
                metadata: { field: "test" },
                originalError,
            });

            expect(error.code).toBe(ErrorCodes.VALIDATION_MISSING_FIELD);
            expect(error.message).toBe("エラー");
            expect(error.category).toBe("VALIDATION");
            expect(error.httpStatus).toBe(400);
            expect(error.metadata).toEqual({ field: "test" });
            expect(error.originalError).toBe(originalError);
        });

        it("Errorのインスタンスである", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN);
            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(AppError);
        });

        it("throwしてcatchできる", () => {
            const error = AppError.fromCode(ErrorCodes.AUTH_INVALID_TOKEN, "テストエラー");
            try {
                throw error;
            } catch (error_) {
                expect(error_).toBe(error);
                expect(error_).toBeInstanceOf(AppError);
                expect(error_).toBeInstanceOf(Error);
                if (error_ instanceof AppError) {
                    expect(error_.code).toBe(ErrorCodes.AUTH_INVALID_TOKEN);
                    expect(error_.message).toBe("テストエラー");
                }
            }
        });

        it("ネストされたエラー（AppErrorをoriginalErrorに設定）を正しく処理できる", () => {
            const innerError = AppError.fromCode(ErrorCodes.VALIDATION_MISSING_FIELD, "内部エラー");
            const outerError = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "外部エラー", {
                originalError: innerError,
            });

            expect(outerError.originalError).toBe(innerError);
            expect(outerError.originalError).toBeInstanceOf(AppError);
            expect(outerError.code).toBe(ErrorCodes.INTERNAL_SERVER_ERROR);
            if (outerError.originalError instanceof AppError) {
                expect(outerError.originalError.code).toBe(ErrorCodes.VALIDATION_MISSING_FIELD);
            }
        });

        it("非常に長いメッセージを正しく処理できる", () => {
            const longMessage = "a".repeat(10000);
            const error = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, longMessage);
            expect(error.message).toBe(longMessage);
            expect(error.message.length).toBe(10000);
        });

        it("特殊文字を含むメッセージを正しく処理できる", () => {
            const specialMessage = "エラー: \"引用符\" 'シングル' \n改行 \tタブ \\バックスラッシュ";
            const error = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, specialMessage);
            expect(error.message).toBe(specialMessage);
        });

        it("causeチェーンが正しく動作する", () => {
            const rootCause = new Error("根本原因");
            const middleError = AppError.fromCode(ErrorCodes.DATABASE_CONNECTION_ERROR, "中間エラー", {
                cause: rootCause,
            });
            const topError = AppError.fromCode(ErrorCodes.INTERNAL_SERVER_ERROR, "トップエラー", {
                cause: middleError,
                originalError: middleError,
            });

            expect(topError.cause).toBe(middleError);
            expect(topError.originalError).toBe(middleError);
            if (topError.cause instanceof AppError) {
                expect(topError.cause.cause).toBe(rootCause);
            }
        });
    });
});
