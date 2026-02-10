import { type ErrorCode, ErrorCodes, getErrorCategory, getHttpStatusFromErrorCode } from "./error-codes";

export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly category: string;
    public readonly httpStatus: number;
    public readonly metadata?: Record<string, unknown>;
    public readonly originalError?: Error;

    constructor(
        code: ErrorCode,
        message: string,
        options?: {
            metadata?: Record<string, unknown>;
            originalError?: Error;
            cause?: unknown;
        },
    ) {
        super(message, { cause: options?.cause });
        this.name = "AppError";
        this.code = code;
        this.category = getErrorCategory(code);
        this.httpStatus = getHttpStatusFromErrorCode(code);
        this.metadata = options?.metadata;
        this.originalError = options?.originalError;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }

    toJSON(): {
        code: ErrorCode;
        category: string;
        message: string;
        httpStatus: number;
        metadata?: Record<string, unknown>;
    } {
        return {
            code: this.code,
            category: this.category,
            message: this.message,
            httpStatus: this.httpStatus,
            ...(this.metadata && { metadata: this.metadata }),
        };
    }

    static fromCode(
        code: ErrorCode,
        message?: string,
        options?: {
            metadata?: Record<string, unknown>;
            originalError?: Error;
            cause?: unknown;
        },
    ): AppError {
        const defaultMessages: Partial<Record<ErrorCode, string>> = {
            [ErrorCodes.AUTH_INVALID_TOKEN]: "無効なトークンです",
            [ErrorCodes.AUTH_TOKEN_EXPIRED]: "トークンの有効期限が切れています",
            [ErrorCodes.AUTH_UNAUTHORIZED]: "認証が必要です",
            [ErrorCodes.AUTH_FORBIDDEN]: "アクセス権限がありません",
            [ErrorCodes.AUTH_MISSING_CREDENTIALS]: "認証情報が不足しています",
            [ErrorCodes.VALIDATION_MISSING_FIELD]: "必須フィールドが不足しています",
            [ErrorCodes.VALIDATION_INVALID_FORMAT]: "無効な形式です",
            [ErrorCodes.VALIDATION_OUT_OF_RANGE]: "値が範囲外です",
            [ErrorCodes.VALIDATION_INVALID_TYPE]: "無効な型です",
            [ErrorCodes.NOT_FOUND_RESOURCE]: "リソースが見つかりません",
            [ErrorCodes.NOT_FOUND_USER]: "ユーザーが見つかりません",
            [ErrorCodes.NOT_FOUND_PORTFOLIO]: "ポートフォリオが見つかりません",
            [ErrorCodes.NOT_FOUND_POST]: "投稿が見つかりません",
            [ErrorCodes.INTERNAL_SERVER_ERROR]: "サーバー内部エラーが発生しました",
            [ErrorCodes.INTERNAL_PROCESSING_ERROR]: "処理中にエラーが発生しました",
            [ErrorCodes.EXTERNAL_API_ERROR]: "外部APIでエラーが発生しました",
            [ErrorCodes.EXTERNAL_TIMEOUT]: "外部サービスへのリクエストがタイムアウトしました",
            [ErrorCodes.EXTERNAL_RATE_LIMIT]: "外部サービスのレート制限に達しました",
            [ErrorCodes.RATE_LIMIT_EXCEEDED]: "レート制限を超えました",
            [ErrorCodes.DATABASE_CONNECTION_ERROR]: "データベースへの接続に失敗しました",
            [ErrorCodes.DATABASE_QUERY_ERROR]: "データベースクエリの実行に失敗しました",
            [ErrorCodes.DATABASE_TRANSACTION_ERROR]: "データベーストランザクションに失敗しました",
            [ErrorCodes.CACHE_CONNECTION_ERROR]: "キャッシュへの接続に失敗しました",
            [ErrorCodes.CACHE_OPERATION_ERROR]: "キャッシュ操作に失敗しました",
        };

        return new AppError(code, message ?? defaultMessages[code] ?? "エラーが発生しました", options);
    }
}
