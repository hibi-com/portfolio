import { describe, expect, test } from "vitest";
import {
	createInquiryInputSchema,
	createInquiryResponseInputSchema,
	inquiryCategorySchema,
	inquiryPrioritySchema,
	inquiryResponseSchema,
	inquirySchema,
	inquiryStatusSchema,
	updateInquiryInputSchema,
} from "./inquiry";

describe("Inquiry Zod Schemas", () => {
	describe("inquiryStatusSchema", () => {
		test("should validate valid status values", () => {
			expect(inquiryStatusSchema.safeParse("OPEN").success).toBe(true);
			expect(inquiryStatusSchema.safeParse("IN_PROGRESS").success).toBe(true);
			expect(inquiryStatusSchema.safeParse("WAITING_CUSTOMER").success).toBe(true);
			expect(inquiryStatusSchema.safeParse("RESOLVED").success).toBe(true);
			expect(inquiryStatusSchema.safeParse("CLOSED").success).toBe(true);
		});

		test("should reject invalid status", () => {
			expect(inquiryStatusSchema.safeParse("UNKNOWN").success).toBe(false);
		});
	});

	describe("inquiryPrioritySchema", () => {
		test("should validate valid priority values", () => {
			expect(inquiryPrioritySchema.safeParse("LOW").success).toBe(true);
			expect(inquiryPrioritySchema.safeParse("MEDIUM").success).toBe(true);
			expect(inquiryPrioritySchema.safeParse("HIGH").success).toBe(true);
			expect(inquiryPrioritySchema.safeParse("URGENT").success).toBe(true);
		});

		test("should reject invalid priority", () => {
			expect(inquiryPrioritySchema.safeParse("CRITICAL").success).toBe(false);
		});
	});

	describe("inquiryCategorySchema", () => {
		test("should validate valid category values", () => {
			expect(inquiryCategorySchema.safeParse("GENERAL").success).toBe(true);
			expect(inquiryCategorySchema.safeParse("TECHNICAL").success).toBe(true);
			expect(inquiryCategorySchema.safeParse("BILLING").success).toBe(true);
			expect(inquiryCategorySchema.safeParse("SALES").success).toBe(true);
			expect(inquiryCategorySchema.safeParse("COMPLAINT").success).toBe(true);
			expect(inquiryCategorySchema.safeParse("FEATURE_REQUEST").success).toBe(true);
			expect(inquiryCategorySchema.safeParse("OTHER").success).toBe(true);
		});

		test("should reject invalid category", () => {
			expect(inquiryCategorySchema.safeParse("RANDOM").success).toBe(false);
		});
	});

	describe("inquirySchema", () => {
		test("should validate complete inquiry", () => {
			const result = inquirySchema.safeParse({
				id: "inq-123",
				customerId: "cust-123",
				assigneeId: "user-456",
				subject: "Help needed",
				content: "I have a question about billing",
				status: "OPEN",
				priority: "MEDIUM",
				category: "BILLING",
				tags: ["billing", "account"],
				source: "email",
				metadata: { ticketNumber: "TKT-001" },
				resolvedAt: "2024-06-01T00:00:00Z",
				closedAt: "2024-06-02T00:00:00Z",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate inquiry with minimum required fields", () => {
			const result = inquirySchema.safeParse({
				id: "inq-123",
				subject: "Question",
				content: "My question is...",
				status: "OPEN",
				priority: "LOW",
				category: "GENERAL",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should reject inquiry without subject", () => {
			const result = inquirySchema.safeParse({
				id: "inq-123",
				content: "My question is...",
				status: "OPEN",
				priority: "LOW",
				category: "GENERAL",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});

		test("should reject inquiry without content", () => {
			const result = inquirySchema.safeParse({
				id: "inq-123",
				subject: "Question",
				status: "OPEN",
				priority: "LOW",
				category: "GENERAL",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("inquiryResponseSchema", () => {
		test("should validate complete response", () => {
			const result = inquiryResponseSchema.safeParse({
				id: "resp-123",
				inquiryId: "inq-123",
				userId: "user-456",
				content: "Here is the answer...",
				isInternal: false,
				attachments: ["file1.pdf", "file2.png"],
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate internal response", () => {
			const result = inquiryResponseSchema.safeParse({
				id: "resp-123",
				inquiryId: "inq-123",
				content: "Internal note",
				isInternal: true,
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("createInquiryInputSchema", () => {
		test("should validate create input with all fields", () => {
			const result = createInquiryInputSchema.safeParse({
				customerId: "cust-123",
				assigneeId: "user-456",
				subject: "New inquiry",
				content: "I need help with...",
				status: "OPEN",
				priority: "HIGH",
				category: "TECHNICAL",
				tags: ["urgent"],
				source: "web",
				metadata: { browser: "Chrome" },
			});
			expect(result.success).toBe(true);
		});

		test("should validate create input with minimum fields", () => {
			const result = createInquiryInputSchema.safeParse({
				subject: "New inquiry",
				content: "I need help",
			});
			expect(result.success).toBe(true);
		});

		test("should reject create input without subject", () => {
			const result = createInquiryInputSchema.safeParse({
				content: "I need help",
			});
			expect(result.success).toBe(false);
		});

		test("should reject create input without content", () => {
			const result = createInquiryInputSchema.safeParse({
				subject: "New inquiry",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("updateInquiryInputSchema", () => {
		test("should validate update input with partial fields", () => {
			const result = updateInquiryInputSchema.safeParse({
				status: "RESOLVED",
				priority: "LOW",
			});
			expect(result.success).toBe(true);
		});

		test("should validate update input with empty object", () => {
			const result = updateInquiryInputSchema.safeParse({});
			expect(result.success).toBe(true);
		});
	});

	describe("createInquiryResponseInputSchema", () => {
		test("should validate create response input", () => {
			const result = createInquiryResponseInputSchema.safeParse({
				inquiryId: "inq-123",
				userId: "user-456",
				content: "Thank you for your inquiry",
				isInternal: false,
				attachments: ["guide.pdf"],
			});
			expect(result.success).toBe(true);
		});

		test("should validate create response with minimum fields", () => {
			const result = createInquiryResponseInputSchema.safeParse({
				inquiryId: "inq-123",
				content: "Response",
			});
			expect(result.success).toBe(true);
		});

		test("should reject create response without inquiryId", () => {
			const result = createInquiryResponseInputSchema.safeParse({
				content: "Response",
			});
			expect(result.success).toBe(false);
		});

		test("should reject create response without content", () => {
			const result = createInquiryResponseInputSchema.safeParse({
				inquiryId: "inq-123",
			});
			expect(result.success).toBe(false);
		});
	});
});
