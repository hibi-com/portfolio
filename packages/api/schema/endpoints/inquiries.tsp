import "@typespec/http";
import "@typespec/openapi3";
import "../models/inquiry.tsp";
import "../models/paginated-response.tsp";
import "../models/error-response.tsp";

using TypeSpec.Http;

@tag("Inquiries")
@route("/api/support")
namespace Api.Inquiries {
    @get
    @route("/inquiries")
    @summary("Get all inquiries")
    op listInquiries(
        @query page?: int32,
        @query perPage?: int32,
        @query status?: InquiryStatus,
        @query customerId?: string,
        @query assigneeId?: string,
    ): Inquiry[] | PaginatedResponse<Inquiry>;

    @get
    @route("/inquiries/{id}")
    @summary("Get an inquiry by ID")
    op getInquiryById(@path id: string): {
        @statusCode statusCode: 200;
        @body body: Inquiry;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/inquiries")
    @summary("Create a new inquiry")
    op createInquiry(@body body: CreateInquiryInput): {
        @statusCode statusCode: 201;
        @body body: Inquiry;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };

    @put
    @route("/inquiries/{id}")
    @summary("Update an inquiry")
    op updateInquiry(@path id: string, @body body: UpdateInquiryInput): {
        @statusCode statusCode: 200;
        @body body: Inquiry;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @delete
    @route("/inquiries/{id}")
    @summary("Delete an inquiry")
    op deleteInquiry(@path id: string): {
        @statusCode statusCode: 204;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/inquiries/{id}/resolve")
    @summary("Resolve an inquiry")
    op resolveInquiry(@path id: string): {
        @statusCode statusCode: 200;
        @body body: Inquiry;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/inquiries/{id}/close")
    @summary("Close an inquiry")
    op closeInquiry(@path id: string): {
        @statusCode statusCode: 200;
        @body body: Inquiry;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @get
    @route("/inquiries/{id}/responses")
    @summary("Get responses for an inquiry")
    op getInquiryResponses(@path id: string): InquiryResponse[];

    @post
    @route("/inquiries/{id}/responses")
    @summary("Add a response to an inquiry")
    op addInquiryResponse(@path id: string, @body body: CreateInquiryResponseInput): {
        @statusCode statusCode: 201;
        @body body: InquiryResponse;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };
}
