import type { ZodError, ZodType, z } from "zod";

export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: z.ZodError;
}

export type SafeParseResult<T> = { success: true; data: T } | { success: false; error: ZodError };

export function validate<T extends z.ZodType>(schema: T, data: unknown): ValidationResult<z.infer<T>> {
    const result = schema.safeParse(data);

    if (result.success) {
        return {
            success: true,
            data: result.data,
        };
    }

    return {
        success: false,
        errors: result.error,
    };
}

export function validateOrThrow<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
    return schema.parse(data);
}

export function safeParse<T>(schema: ZodType<T>, data: unknown): SafeParseResult<T> {
    const result = schema.safeParse(data);
    return result.success ? { success: true, data: result.data } : { success: false, error: result.error };
}

export function formatValidationError(error: ZodError): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of error.issues) {
        const path = issue.path.join(".");
        fieldErrors[path] ??= [];
        fieldErrors[path].push(issue.message);
    }
    return fieldErrors;
}
