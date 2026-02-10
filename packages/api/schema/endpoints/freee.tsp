import "@typespec/http";
import "../models/freee.tsp";
import "../models/error-response.tsp";

using TypeSpec.Http;

@route("/freee")
@tag("Freee")
namespace Api.Freee;

@route("/auth/url")
@get
op getAuthUrl(): FreeeAuthUrlResponse | ErrorResponse;

@route("/auth/callback")
@post
op handleCallback(@body body: FreeeCallbackInput): FreeeIntegration | ErrorResponse;

@route("/integration")
@get
op getIntegration(): FreeeIntegration | ErrorResponse;

@route("/integration")
@delete
op disconnectIntegration(): void | ErrorResponse;

@route("/sync/partners/import")
@post
op syncPartnersFromFreee(): FreeeSyncLog | ErrorResponse;

@route("/sync/partners/export")
@post
op syncPartnersToFreee(): FreeeSyncLog | ErrorResponse;

@route("/sync/logs")
@get
op getSyncLogs(@query limit?: int32): FreeeSyncLog[] | ErrorResponse;

@route("/partners")
@get
op getPartners(): FreeePartner[] | ErrorResponse;

@route("/companies")
@get
op getCompanies(): FreeeCompany[] | ErrorResponse;

@route("/tokens")
@put
op updateTokens(@body body: UpdateFreeeTokensInput): FreeeOAuthTokens | ErrorResponse;

@route("/mappings/customers")
@get
op getCustomerMappings(): CustomerFreeeMapping[] | ErrorResponse;

@route("/mappings/customers")
@post
op createCustomerMapping(@body body: CreateCustomerMappingInput): CustomerFreeeMapping | ErrorResponse;

@route("/mappings/deals")
@get
op getDealMappings(): DealFreeeMapping[] | ErrorResponse;

@route("/mappings/deals")
@post
op createDealMapping(@body body: CreateDealMappingInput): DealFreeeMapping | ErrorResponse;

@route("/integrations")
@post
op createIntegration(@body body: CreateFreeeIntegrationInput): FreeeIntegration | ErrorResponse;

@route("/sync/logs")
@post
op createSyncLog(@body body: CreateSyncLogInput): FreeeSyncLog | ErrorResponse;

@route("/sync/logs/{id}")
@put
op updateSyncLog(@path id: string, @body body: UpdateSyncLogInput): FreeeSyncLog | ErrorResponse;
