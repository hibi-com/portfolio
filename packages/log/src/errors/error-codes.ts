export enum ErrorCategory {
    AUTHENTICATION = "AUTH",
    VALIDATION = "VALIDATION",
    NOT_FOUND = "NOT_FOUND",
    INTERNAL = "INTERNAL",
    EXTERNAL = "EXTERNAL",
    RATE_LIMIT = "RATE_LIMIT",
    DATABASE = "DATABASE",
    CACHE = "CACHE",
}

export const ErrorCodes = {
    AUTH_INVALID_TOKEN: "PF100001",
    AUTH_TOKEN_EXPIRED: "PF100002",
    AUTH_UNAUTHORIZED: "PF100003",
    AUTH_FORBIDDEN: "PF100004",
    AUTH_MISSING_CREDENTIALS: "PF100005",
    VALIDATION_MISSING_FIELD: "PF200001",
    VALIDATION_INVALID_FORMAT: "PF200002",
    VALIDATION_OUT_OF_RANGE: "PF200003",
    VALIDATION_INVALID_TYPE: "PF200004",
    NOT_FOUND_RESOURCE: "PF300001",
    NOT_FOUND_USER: "PF300002",
    NOT_FOUND_PORTFOLIO: "PF300003",
    NOT_FOUND_POST: "PF300004",
    INTERNAL_SERVER_ERROR: "PF400001",
    INTERNAL_PROCESSING_ERROR: "PF400002",
    EXTERNAL_API_ERROR: "PF500001",
    EXTERNAL_TIMEOUT: "PF500002",
    EXTERNAL_RATE_LIMIT: "PF500003",
    RATE_LIMIT_EXCEEDED: "PF600001",
    DATABASE_CONNECTION_ERROR: "PF700001",
    DATABASE_QUERY_ERROR: "PF700002",
    DATABASE_TRANSACTION_ERROR: "PF700003",
    CACHE_CONNECTION_ERROR: "PF800001",
    CACHE_OPERATION_ERROR: "PF800002",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export function getErrorCategory(code: ErrorCode): ErrorCategory {
    const categoryDigit = code.charAt(2);

    switch (categoryDigit) {
        case "1":
            return ErrorCategory.AUTHENTICATION;
        case "2":
            return ErrorCategory.VALIDATION;
        case "3":
            return ErrorCategory.NOT_FOUND;
        case "4":
            return ErrorCategory.INTERNAL;
        case "5":
            return ErrorCategory.EXTERNAL;
        case "6":
            return ErrorCategory.RATE_LIMIT;
        case "7":
            return ErrorCategory.DATABASE;
        case "8":
            return ErrorCategory.CACHE;
        default:
            return ErrorCategory.INTERNAL;
    }
}

export function getHttpStatusFromErrorCode(code: ErrorCode): number {
    const category = getErrorCategory(code);

    switch (category) {
        case ErrorCategory.AUTHENTICATION:
            if (code === ErrorCodes.AUTH_UNAUTHORIZED) return 401;
            if (code === ErrorCodes.AUTH_FORBIDDEN) return 403;
            return 401;

        case ErrorCategory.VALIDATION:
            return 400;

        case ErrorCategory.NOT_FOUND:
            return 404;

        case ErrorCategory.RATE_LIMIT:
            return 429;

        case ErrorCategory.EXTERNAL:
        case ErrorCategory.DATABASE:
        case ErrorCategory.CACHE:
        case ErrorCategory.INTERNAL:
        default:
            return 500;
    }
}

export function getErrorCodeName(code: ErrorCode): string {
    const entries = Object.entries(ErrorCodes) as [string, ErrorCode][];
    const entry = entries.find(([, value]) => value === code);
    return entry ? entry[0] : "UNKNOWN";
}
