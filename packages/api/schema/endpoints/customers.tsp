import "@typespec/http";
import "@typespec/openapi3";
import "../models/customer.tsp";
import "../models/paginated-response.tsp";
import "../models/error-response.tsp";

using TypeSpec.Http;

@tag("Customers")
@route("/api/crm")
namespace Api.Customers {
    @get
    @route("/customers")
    @summary("Get all customers")
    op listCustomers(
        @query page?: int32,
        @query perPage?: int32,
        @query status?: CustomerStatus,
    ): Customer[] | PaginatedResponse<Customer>;

    @get
    @route("/customers/{id}")
    @summary("Get a customer by ID")
    op getCustomerById(@path id: string): {
        @statusCode statusCode: 200;
        @body body: Customer;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @post
    @route("/customers")
    @summary("Create a new customer")
    op createCustomer(@body body: CreateCustomerInput): {
        @statusCode statusCode: 201;
        @body body: Customer;
    } | {
        @statusCode statusCode: 400;
        @body body: ErrorResponse;
    };

    @put
    @route("/customers/{id}")
    @summary("Update a customer")
    op updateCustomer(@path id: string, @body body: UpdateCustomerInput): {
        @statusCode statusCode: 200;
        @body body: Customer;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };

    @delete
    @route("/customers/{id}")
    @summary("Delete a customer")
    op deleteCustomer(@path id: string): {
        @statusCode statusCode: 204;
    } | {
        @statusCode statusCode: 404;
        @body body: ErrorResponse;
    };
}
