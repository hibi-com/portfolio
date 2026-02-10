import { describe, expect, test } from "vitest";
import {
	createEmailTemplateInputSchema,
	emailLogSchema,
	emailStatusSchema,
	emailTemplateCategorySchema,
	emailTemplateSchema,
	sendEmailInputSchema,
	updateEmailTemplateInputSchema,
} from "./email";

describe("Email Zod Schemas", () => {
	describe("emailStatusSchema", () => {
		test("should validate valid status values", () => {
			expect(emailStatusSchema.safeParse("PENDING").success).toBe(true);
			expect(emailStatusSchema.safeParse("SENT").success).toBe(true);
			expect(emailStatusSchema.safeParse("DELIVERED").success).toBe(true);
			expect(emailStatusSchema.safeParse("BOUNCED").success).toBe(true);
			expect(emailStatusSchema.safeParse("FAILED").success).toBe(true);
		});

		test("should reject invalid status", () => {
			expect(emailStatusSchema.safeParse("UNKNOWN").success).toBe(false);
		});
	});

	describe("emailTemplateCategorySchema", () => {
		test("should validate valid category values", () => {
			expect(emailTemplateCategorySchema.safeParse("MARKETING").success).toBe(true);
			expect(emailTemplateCategorySchema.safeParse("TRANSACTIONAL").success).toBe(true);
			expect(emailTemplateCategorySchema.safeParse("SUPPORT").success).toBe(true);
			expect(emailTemplateCategorySchema.safeParse("NOTIFICATION").success).toBe(true);
		});

		test("should reject invalid category", () => {
			expect(emailTemplateCategorySchema.safeParse("PROMOTIONAL").success).toBe(false);
		});
	});

	describe("emailLogSchema", () => {
		test("should validate complete email log", () => {
			const result = emailLogSchema.safeParse({
				id: "log-123",
				customerId: "cust-123",
				templateId: "tmpl-456",
				resendId: "resend-789",
				fromEmail: "noreply@example.com",
				toEmail: "user@example.com",
				ccEmail: "cc@example.com",
				bccEmail: "bcc@example.com",
				subject: "Welcome!",
				htmlContent: "<p>Welcome to our service</p>",
				textContent: "Welcome to our service",
				status: "SENT",
				sentAt: "2024-01-01T10:00:00Z",
				deliveredAt: "2024-01-01T10:01:00Z",
				openedAt: "2024-01-01T11:00:00Z",
				clickedAt: "2024-01-01T11:30:00Z",
				metadata: { campaign: "welcome" },
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate email log with minimum required fields", () => {
			const result = emailLogSchema.safeParse({
				id: "log-123",
				fromEmail: "noreply@example.com",
				toEmail: "user@example.com",
				subject: "Test",
				status: "PENDING",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should reject email log without fromEmail", () => {
			const result = emailLogSchema.safeParse({
				id: "log-123",
				toEmail: "user@example.com",
				subject: "Test",
				status: "PENDING",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});

		test("should reject email log without toEmail", () => {
			const result = emailLogSchema.safeParse({
				id: "log-123",
				fromEmail: "noreply@example.com",
				subject: "Test",
				status: "PENDING",
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("emailTemplateSchema", () => {
		test("should validate complete email template", () => {
			const result = emailTemplateSchema.safeParse({
				id: "tmpl-123",
				name: "Welcome Email",
				slug: "welcome-email",
				description: "Sent to new users",
				category: "TRANSACTIONAL",
				subject: "Welcome, {{name}}!",
				htmlContent: "<p>Hello {{name}}</p>",
				textContent: "Hello {{name}}",
				variables: ["name", "company"],
				isActive: true,
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should validate template with minimum required fields", () => {
			const result = emailTemplateSchema.safeParse({
				id: "tmpl-123",
				name: "Basic Template",
				slug: "basic",
				category: "NOTIFICATION",
				subject: "Notification",
				htmlContent: "<p>Content</p>",
				isActive: true,
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(true);
		});

		test("should reject template without name", () => {
			const result = emailTemplateSchema.safeParse({
				id: "tmpl-123",
				slug: "basic",
				category: "NOTIFICATION",
				subject: "Notification",
				htmlContent: "<p>Content</p>",
				isActive: true,
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});

		test("should reject template without htmlContent", () => {
			const result = emailTemplateSchema.safeParse({
				id: "tmpl-123",
				name: "Basic Template",
				slug: "basic",
				category: "NOTIFICATION",
				subject: "Notification",
				isActive: true,
				createdAt: "2024-01-01T00:00:00Z",
				updatedAt: "2024-01-01T00:00:00Z",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("sendEmailInputSchema", () => {
		test("should validate send email input with all fields", () => {
			const result = sendEmailInputSchema.safeParse({
				customerId: "cust-123",
				templateId: "tmpl-456",
				fromEmail: "noreply@example.com",
				toEmail: "user@example.com",
				ccEmail: "cc@example.com",
				bccEmail: "bcc@example.com",
				subject: "Hello",
				htmlContent: "<p>Hello</p>",
				textContent: "Hello",
				variables: { name: "John" },
				metadata: { source: "api" },
			});
			expect(result.success).toBe(true);
		});

		test("should validate send email input with minimum fields", () => {
			const result = sendEmailInputSchema.safeParse({
				toEmail: "user@example.com",
				subject: "Test",
			});
			expect(result.success).toBe(true);
		});

		test("should reject send email without toEmail", () => {
			const result = sendEmailInputSchema.safeParse({
				subject: "Test",
			});
			expect(result.success).toBe(false);
		});

		test("should reject send email without subject", () => {
			const result = sendEmailInputSchema.safeParse({
				toEmail: "user@example.com",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("createEmailTemplateInputSchema", () => {
		test("should validate create template input with all fields", () => {
			const result = createEmailTemplateInputSchema.safeParse({
				name: "New Template",
				slug: "new-template",
				description: "A new template",
				category: "MARKETING",
				subject: "Check this out!",
				htmlContent: "<p>Content</p>",
				textContent: "Content",
				variables: ["link"],
				isActive: true,
			});
			expect(result.success).toBe(true);
		});

		test("should validate create template input with minimum fields", () => {
			const result = createEmailTemplateInputSchema.safeParse({
				name: "New Template",
				slug: "new-template",
				subject: "Subject",
				htmlContent: "<p>Content</p>",
			});
			expect(result.success).toBe(true);
		});

		test("should reject create template without name", () => {
			const result = createEmailTemplateInputSchema.safeParse({
				slug: "new-template",
				subject: "Subject",
				htmlContent: "<p>Content</p>",
			});
			expect(result.success).toBe(false);
		});

		test("should reject create template without slug", () => {
			const result = createEmailTemplateInputSchema.safeParse({
				name: "New Template",
				subject: "Subject",
				htmlContent: "<p>Content</p>",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("updateEmailTemplateInputSchema", () => {
		test("should validate update template input with partial fields", () => {
			const result = updateEmailTemplateInputSchema.safeParse({
				name: "Updated Name",
				isActive: false,
			});
			expect(result.success).toBe(true);
		});

		test("should validate update template input with empty object", () => {
			const result = updateEmailTemplateInputSchema.safeParse({});
			expect(result.success).toBe(true);
		});
	});
});
