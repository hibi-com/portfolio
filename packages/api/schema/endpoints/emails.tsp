import "@typespec/http";
import "@typespec/openapi3";
import "../models/email.tsp";
import "../models/paginated-response.tsp";
import "../models/error-response.tsp";

using TypeSpec.Http;

@tag("Emails")
@route("/api/email")
namespace Api.Emails {
    @get
    @route("/logs")
    @summary("Get all email logs")
    op listEmailLogs(
        @query page?: int32,
        @query perPage?: int32,
        @query status?: EmailStatus,
        @query customerId?: string,
    ): EmailLog[] | PaginatedResponse<EmailLog>;

    @get
    @route("/logs/{id}")
    @summary("Get an email log by ID")
    op getEmailLogById(@path id: string): {
        @statusCode statusCode: 200;
        @body body: EmailLog;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/send")
    @summary("Send an email")
    op sendEmail(@body body: SendEmailInput): {
        @statusCode statusCode: 201;
        @body body: EmailLog;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };

    @get
    @route("/templates")
    @summary("Get all email templates")
    op listEmailTemplates(
        @query category?: EmailTemplateCategory,
        @query isActive?: boolean,
    ): EmailTemplate[];

    @get
    @route("/templates/{id}")
    @summary("Get an email template by ID")
    op getEmailTemplateById(@path id: string): {
        @statusCode statusCode: 200;
        @body body: EmailTemplate;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @get
    @route("/templates/slug/{slug}")
    @summary("Get an email template by slug")
    op getEmailTemplateBySlug(@path slug: string): {
        @statusCode statusCode: 200;
        @body body: EmailTemplate;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/templates")
    @summary("Create a new email template")
    op createEmailTemplate(@body body: CreateEmailTemplateInput): {
        @statusCode statusCode: 201;
        @body body: EmailTemplate;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };

    @put
    @route("/templates/{id}")
    @summary("Update an email template")
    op updateEmailTemplate(@path id: string, @body body: UpdateEmailTemplateInput): {
        @statusCode statusCode: 200;
        @body body: EmailTemplate;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @delete
    @route("/templates/{id}")
    @summary("Delete an email template")
    op deleteEmailTemplate(@path id: string): {
        @statusCode statusCode: 204;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/send-with-template")
    @summary("Send an email using a template")
    op sendEmailWithTemplate(
        @query templateSlug: string,
        @query toEmail: string,
        @query customerId?: string,
        @body body?: { variables?: Record<string> },
    ): {
        @statusCode statusCode: 201;
        @body body: EmailLog;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };
}
