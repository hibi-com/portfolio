import { describe, expect, it } from "vitest";
import {
    ErrorCategory,
    ErrorCodes,
    getErrorCategory,
    getErrorCodeName,
    getHttpStatusFromErrorCode,
} from "./error-codes";

describe("ErrorCodes", () => {
    it("すべてのエラーコードがPF形式で定義されている", () => {
        // 認証エラー (PF1xxxxx)
        expect(ErrorCodes.AUTH_INVALID_TOKEN).toBe("PF100001");
        expect(ErrorCodes.AUTH_TOKEN_EXPIRED).toBe("PF100002");
        expect(ErrorCodes.AUTH_UNAUTHORIZED).toBe("PF100003");
        expect(ErrorCodes.AUTH_FORBIDDEN).toBe("PF100004");
        expect(ErrorCodes.AUTH_MISSING_CREDENTIALS).toBe("PF100005");

        // バリデーションエラー (PF2xxxxx)
        expect(ErrorCodes.VALIDATION_MISSING_FIELD).toBe("PF200001");
        expect(ErrorCodes.VALIDATION_INVALID_FORMAT).toBe("PF200002");
        expect(ErrorCodes.VALIDATION_OUT_OF_RANGE).toBe("PF200003");
        expect(ErrorCodes.VALIDATION_INVALID_TYPE).toBe("PF200004");

        // リソース未発見 (PF3xxxxx)
        expect(ErrorCodes.NOT_FOUND_RESOURCE).toBe("PF300001");
        expect(ErrorCodes.NOT_FOUND_USER).toBe("PF300002");
        expect(ErrorCodes.NOT_FOUND_PORTFOLIO).toBe("PF300003");
        expect(ErrorCodes.NOT_FOUND_POST).toBe("PF300004");

        // 内部エラー (PF4xxxxx)
        expect(ErrorCodes.INTERNAL_SERVER_ERROR).toBe("PF400001");
        expect(ErrorCodes.INTERNAL_PROCESSING_ERROR).toBe("PF400002");

        // 外部サービスエラー (PF5xxxxx)
        expect(ErrorCodes.EXTERNAL_API_ERROR).toBe("PF500001");
        expect(ErrorCodes.EXTERNAL_TIMEOUT).toBe("PF500002");
        expect(ErrorCodes.EXTERNAL_RATE_LIMIT).toBe("PF500003");

        // レート制限 (PF6xxxxx)
        expect(ErrorCodes.RATE_LIMIT_EXCEEDED).toBe("PF600001");

        // データベースエラー (PF7xxxxx)
        expect(ErrorCodes.DATABASE_CONNECTION_ERROR).toBe("PF700001");
        expect(ErrorCodes.DATABASE_QUERY_ERROR).toBe("PF700002");
        expect(ErrorCodes.DATABASE_TRANSACTION_ERROR).toBe("PF700003");

        // キャッシュエラー (PF8xxxxx)
        expect(ErrorCodes.CACHE_CONNECTION_ERROR).toBe("PF800001");
        expect(ErrorCodes.CACHE_OPERATION_ERROR).toBe("PF800002");
    });

    it("すべてのエラーコードがPFで始まる", () => {
        for (const code of Object.values(ErrorCodes)) {
            expect(code.startsWith("PF")).toBe(true);
        }
    });

    describe("getErrorCategory", () => {
        it("認証エラーのカテゴリを正しく返す (PF1xxxxx)", () => {
            expect(getErrorCategory(ErrorCodes.AUTH_INVALID_TOKEN)).toBe(ErrorCategory.AUTHENTICATION);
            expect(getErrorCategory(ErrorCodes.AUTH_TOKEN_EXPIRED)).toBe(ErrorCategory.AUTHENTICATION);
            expect(getErrorCategory(ErrorCodes.AUTH_UNAUTHORIZED)).toBe(ErrorCategory.AUTHENTICATION);
            expect(getErrorCategory(ErrorCodes.AUTH_FORBIDDEN)).toBe(ErrorCategory.AUTHENTICATION);
            expect(getErrorCategory(ErrorCodes.AUTH_MISSING_CREDENTIALS)).toBe(ErrorCategory.AUTHENTICATION);
        });

        it("バリデーションエラーのカテゴリを正しく返す (PF2xxxxx)", () => {
            expect(getErrorCategory(ErrorCodes.VALIDATION_MISSING_FIELD)).toBe(ErrorCategory.VALIDATION);
            expect(getErrorCategory(ErrorCodes.VALIDATION_INVALID_FORMAT)).toBe(ErrorCategory.VALIDATION);
            expect(getErrorCategory(ErrorCodes.VALIDATION_OUT_OF_RANGE)).toBe(ErrorCategory.VALIDATION);
            expect(getErrorCategory(ErrorCodes.VALIDATION_INVALID_TYPE)).toBe(ErrorCategory.VALIDATION);
        });

        it("リソースエラーのカテゴリを正しく返す (PF3xxxxx)", () => {
            expect(getErrorCategory(ErrorCodes.NOT_FOUND_RESOURCE)).toBe(ErrorCategory.NOT_FOUND);
            expect(getErrorCategory(ErrorCodes.NOT_FOUND_USER)).toBe(ErrorCategory.NOT_FOUND);
            expect(getErrorCategory(ErrorCodes.NOT_FOUND_PORTFOLIO)).toBe(ErrorCategory.NOT_FOUND);
            expect(getErrorCategory(ErrorCodes.NOT_FOUND_POST)).toBe(ErrorCategory.NOT_FOUND);
        });

        it("サーバーエラーのカテゴリを正しく返す (PF4xxxxx)", () => {
            expect(getErrorCategory(ErrorCodes.INTERNAL_SERVER_ERROR)).toBe(ErrorCategory.INTERNAL);
            expect(getErrorCategory(ErrorCodes.INTERNAL_PROCESSING_ERROR)).toBe(ErrorCategory.INTERNAL);
        });

        it("外部サービスエラーのカテゴリを正しく返す (PF5xxxxx)", () => {
            expect(getErrorCategory(ErrorCodes.EXTERNAL_API_ERROR)).toBe(ErrorCategory.EXTERNAL);
            expect(getErrorCategory(ErrorCodes.EXTERNAL_TIMEOUT)).toBe(ErrorCategory.EXTERNAL);
            expect(getErrorCategory(ErrorCodes.EXTERNAL_RATE_LIMIT)).toBe(ErrorCategory.EXTERNAL);
        });

        it("レート制限エラーのカテゴリを正しく返す (PF6xxxxx)", () => {
            expect(getErrorCategory(ErrorCodes.RATE_LIMIT_EXCEEDED)).toBe(ErrorCategory.RATE_LIMIT);
        });

        it("データベースエラーのカテゴリを正しく返す (PF7xxxxx)", () => {
            expect(getErrorCategory(ErrorCodes.DATABASE_CONNECTION_ERROR)).toBe(ErrorCategory.DATABASE);
            expect(getErrorCategory(ErrorCodes.DATABASE_QUERY_ERROR)).toBe(ErrorCategory.DATABASE);
            expect(getErrorCategory(ErrorCodes.DATABASE_TRANSACTION_ERROR)).toBe(ErrorCategory.DATABASE);
        });

        it("キャッシュエラーのカテゴリを正しく返す (PF8xxxxx)", () => {
            expect(getErrorCategory(ErrorCodes.CACHE_CONNECTION_ERROR)).toBe(ErrorCategory.CACHE);
            expect(getErrorCategory(ErrorCodes.CACHE_OPERATION_ERROR)).toBe(ErrorCategory.CACHE);
        });
    });

    describe("getHttpStatusFromErrorCode", () => {
        it("認証エラーのHTTPステータスコードを正しく返す", () => {
            expect(getHttpStatusFromErrorCode(ErrorCodes.AUTH_UNAUTHORIZED)).toBe(401);
            expect(getHttpStatusFromErrorCode(ErrorCodes.AUTH_FORBIDDEN)).toBe(403);
            expect(getHttpStatusFromErrorCode(ErrorCodes.AUTH_INVALID_TOKEN)).toBe(401);
            expect(getHttpStatusFromErrorCode(ErrorCodes.AUTH_TOKEN_EXPIRED)).toBe(401);
            expect(getHttpStatusFromErrorCode(ErrorCodes.AUTH_MISSING_CREDENTIALS)).toBe(401);
        });

        it("バリデーションエラーのHTTPステータスコードを正しく返す", () => {
            expect(getHttpStatusFromErrorCode(ErrorCodes.VALIDATION_MISSING_FIELD)).toBe(400);
            expect(getHttpStatusFromErrorCode(ErrorCodes.VALIDATION_INVALID_FORMAT)).toBe(400);
            expect(getHttpStatusFromErrorCode(ErrorCodes.VALIDATION_OUT_OF_RANGE)).toBe(400);
            expect(getHttpStatusFromErrorCode(ErrorCodes.VALIDATION_INVALID_TYPE)).toBe(400);
        });

        it("リソースエラーのHTTPステータスコードを正しく返す", () => {
            expect(getHttpStatusFromErrorCode(ErrorCodes.NOT_FOUND_RESOURCE)).toBe(404);
            expect(getHttpStatusFromErrorCode(ErrorCodes.NOT_FOUND_USER)).toBe(404);
            expect(getHttpStatusFromErrorCode(ErrorCodes.NOT_FOUND_PORTFOLIO)).toBe(404);
            expect(getHttpStatusFromErrorCode(ErrorCodes.NOT_FOUND_POST)).toBe(404);
        });

        it("レート制限エラーのHTTPステータスコードを正しく返す", () => {
            expect(getHttpStatusFromErrorCode(ErrorCodes.RATE_LIMIT_EXCEEDED)).toBe(429);
        });

        it("サーバーエラーのHTTPステータスコードを正しく返す", () => {
            expect(getHttpStatusFromErrorCode(ErrorCodes.INTERNAL_SERVER_ERROR)).toBe(500);
            expect(getHttpStatusFromErrorCode(ErrorCodes.INTERNAL_PROCESSING_ERROR)).toBe(500);
        });

        it("外部サービスエラーのHTTPステータスコードを正しく返す", () => {
            expect(getHttpStatusFromErrorCode(ErrorCodes.EXTERNAL_API_ERROR)).toBe(500);
            expect(getHttpStatusFromErrorCode(ErrorCodes.EXTERNAL_TIMEOUT)).toBe(500);
            expect(getHttpStatusFromErrorCode(ErrorCodes.EXTERNAL_RATE_LIMIT)).toBe(500);
        });

        it("データベースエラーのHTTPステータスコードを正しく返す", () => {
            expect(getHttpStatusFromErrorCode(ErrorCodes.DATABASE_CONNECTION_ERROR)).toBe(500);
            expect(getHttpStatusFromErrorCode(ErrorCodes.DATABASE_QUERY_ERROR)).toBe(500);
            expect(getHttpStatusFromErrorCode(ErrorCodes.DATABASE_TRANSACTION_ERROR)).toBe(500);
        });

        it("キャッシュエラーのHTTPステータスコードを正しく返す", () => {
            expect(getHttpStatusFromErrorCode(ErrorCodes.CACHE_CONNECTION_ERROR)).toBe(500);
            expect(getHttpStatusFromErrorCode(ErrorCodes.CACHE_OPERATION_ERROR)).toBe(500);
        });
    });

    describe("getErrorCodeName", () => {
        it("エラーコードから人間が読める名前を取得できる", () => {
            expect(getErrorCodeName(ErrorCodes.AUTH_INVALID_TOKEN)).toBe("AUTH_INVALID_TOKEN");
            expect(getErrorCodeName(ErrorCodes.VALIDATION_MISSING_FIELD)).toBe("VALIDATION_MISSING_FIELD");
            expect(getErrorCodeName(ErrorCodes.NOT_FOUND_RESOURCE)).toBe("NOT_FOUND_RESOURCE");
            expect(getErrorCodeName(ErrorCodes.INTERNAL_SERVER_ERROR)).toBe("INTERNAL_SERVER_ERROR");
        });
    });
});
