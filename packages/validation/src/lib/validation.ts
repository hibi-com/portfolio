import type { z } from "zod";

export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: z.ZodError;
}

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
