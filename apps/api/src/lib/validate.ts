import { AppError, ErrorCodes } from "@portfolio/log";

// Zod v3/v4 互換性のための型定義
type ZodIssue = {
	message: string;
	path: PropertyKey[];
	code: string;
};

type ZodLikeSchema<T = unknown> = {
	safeParse: (data: unknown) => { success: true; data: T } | { success: false; error: { issues: ZodIssue[] } };
};

export function validateBody<T>(schema: ZodLikeSchema<T>, body: unknown): T {
	const result = schema.safeParse(body);
	if (!result.success) {
		const issues = result.error.issues;
		const firstIssue = issues[0] ?? { message: "Validation failed", path: [], code: "custom" };
		throw AppError.fromCode(ErrorCodes.VALIDATION_INVALID_FORMAT, firstIssue.message, {
			metadata: {
				field: firstIssue.path.map(String).join("."),
				issues: issues.map((issue) => ({
					path: issue.path.map(String).join("."),
					message: issue.message,
					code: issue.code,
				})),
			},
		});
	}
	return result.data;
}
