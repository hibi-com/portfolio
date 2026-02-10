import "@typespec/http";
import "@typespec/openapi3";
import "../models/lead.tsp";
import "../models/paginated-response.tsp";
import "../models/error-response.tsp";

using TypeSpec.Http;

@tag("Leads")
@route("/api/crm")
namespace Api.Leads {
    @get
    @route("/leads")
    @summary("Get all leads")
    op listLeads(
        @query page?: int32,
        @query perPage?: int32,
        @query status?: LeadStatus,
        @query customerId?: string,
    ): Lead[] | PaginatedResponse<Lead>;

    @get
    @route("/leads/{id}")
    @summary("Get a lead by ID")
    op getLeadById(@path id: string): {
        @statusCode statusCode: 200;
        @body body: Lead;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/leads")
    @summary("Create a new lead")
    op createLead(@body body: CreateLeadInput): {
        @statusCode statusCode: 201;
        @body body: Lead;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };

    @put
    @route("/leads/{id}")
    @summary("Update a lead")
    op updateLead(@path id: string, @body body: UpdateLeadInput): {
        @statusCode statusCode: 200;
        @body body: Lead;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @delete
    @route("/leads/{id}")
    @summary("Delete a lead")
    op deleteLead(@path id: string): {
        @statusCode statusCode: 204;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/leads/{id}/convert")
    @summary("Convert a lead to a deal")
    op convertLead(@path id: string): {
        @statusCode statusCode: 200;
        @body body: Lead;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };
}
