import "@typespec/http";
import "@typespec/openapi3";
import "../models/deal.tsp";
import "../models/paginated-response.tsp";
import "../models/error-response.tsp";

using TypeSpec.Http;

@tag("Deals")
@route("/api/crm")
namespace Api.Deals {
    @get
    @route("/deals")
    @summary("Get all deals")
    op listDeals(
        @query page?: int32,
        @query perPage?: int32,
        @query status?: DealStatus,
        @query customerId?: string,
        @query stageId?: string,
    ): Deal[] | PaginatedResponse<Deal>;

    @get
    @route("/deals/{id}")
    @summary("Get a deal by ID")
    op getDealById(@path id: string): {
        @statusCode statusCode: 200;
        @body body: Deal;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/deals")
    @summary("Create a new deal")
    op createDeal(@body body: CreateDealInput): {
        @statusCode statusCode: 201;
        @body body: Deal;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };

    @put
    @route("/deals/{id}")
    @summary("Update a deal")
    op updateDeal(@path id: string, @body body: UpdateDealInput): {
        @statusCode statusCode: 200;
        @body body: Deal;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @delete
    @route("/deals/{id}")
    @summary("Delete a deal")
    op deleteDeal(@path id: string): {
        @statusCode statusCode: 204;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @put
    @route("/deals/{id}/stage")
    @summary("Move a deal to a different stage")
    op moveDealToStage(@path id: string, @body body: { stageId: string }): {
        @statusCode statusCode: 200;
        @body body: Deal;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/deals/{id}/won")
    @summary("Mark a deal as won")
    op markDealAsWon(@path id: string): {
        @statusCode statusCode: 200;
        @body body: Deal;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/deals/{id}/lost")
    @summary("Mark a deal as lost")
    op markDealAsLost(@path id: string, @query reason?: string): {
        @statusCode statusCode: 200;
        @body body: Deal;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };
}
