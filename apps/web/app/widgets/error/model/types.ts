interface ErrorData {
    status?: number;
    statusText?: string;
    data?: string;
    toString?: () => string;
}

export interface ErrorProps {
    readonly error: ErrorData;
}
